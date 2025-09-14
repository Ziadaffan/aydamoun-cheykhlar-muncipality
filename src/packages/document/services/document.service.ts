import { BasePrismaService } from '@/packages/common/services/prisma.service';
import { DocumentRepository } from '../repository/document.repository';
import { Document } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export class DocumentService extends BasePrismaService<'document'> {
  private static singleton: DocumentService;

  private constructor(repository: DocumentRepository = new DocumentRepository()) {
    super(repository);
  }

  private getResourceType(fileExtension: string): 'raw' | 'image' | 'video' {
    const ext = fileExtension.toLowerCase();

    if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar', '7z'].includes(ext)) {
      return 'raw';
    }

    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(ext)) {
      return 'video';
    }

    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) {
      return 'image';
    }

    return 'raw';
  }

  public static instance(): DocumentService {
    if (!DocumentService.singleton) {
      if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        throw new Error('Cloudinary environment variables are missing');
      }

      cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      });

      DocumentService.singleton = new DocumentService();
    }
    return DocumentService.singleton;
  }

  public async getAllDocuments(): Promise<Document[]> {
    return this.repository.findMany({ orderBy: { createdAt: 'desc' } });
  }

  public async createDocument(filePath: string, document: Omit<Document, 'id' | 'fileUrl' | 'createdAt' | 'updatedAt'>) {
    const id = uuidv4();

    const resourceType = this.getResourceType(document.type);

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      public_id: id,
      folder: 'documents',
      resource_type: resourceType,
      format: document.type,
      access_mode: 'public',
      invalidate: true,
    });

    const savedDoc = await this.repository.create({
      data: {
        ...document,
        id,
        fileUrl: uploadResult.secure_url,
      },
    });

    return { document: savedDoc, url: uploadResult.secure_url };
  }

  public async deleteDocument(id: string): Promise<boolean> {
    const doc = await this.repository.findUnique({ where: { id } });
    if (!doc) throw new Error('Document not found');

    const ext = path.extname(new URL(doc.fileUrl).pathname).toLowerCase().replace('.', '');
    const resource_type = this.getResourceType(ext);

    const publicId = resource_type === 'raw' ? `documents/${id}.${ext}` : `documents/${id}`;

    const result = await cloudinary.uploader.destroy(publicId, { resource_type });

    if (result.result === 'not found') {
      throw new Error('Document not found in cloudinary');
    }

    await this.repository.delete({ where: { id } });
    return true;
  }
}
