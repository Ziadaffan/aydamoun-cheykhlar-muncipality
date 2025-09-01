import { BasePrismaService } from '@/packages/common/services/prisma.service';
import { DocumentRepository } from '../repository/document.repository';
import { Document } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import mime from 'mime-types';

export class DocumentService extends BasePrismaService<'document'> {
  private static singleton: DocumentService;

  private constructor(repository: DocumentRepository = new DocumentRepository()) {
    super(repository);
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

  private resolveResourceType = (filePath: string): 'image' | 'video' | 'raw' => {
    const mt = mime.lookup(filePath) || '';
    if (mt.startsWith('image/')) return 'image';
    if (mt.startsWith('video/')) return 'video';
    return 'raw';
  };

  public async getAllDocuments(): Promise<Document[]> {
    return this.repository.findMany({ orderBy: { createdAt: 'desc' } });
  }

  public async createDocument(filePath: string, document: Omit<Document, 'id' | 'fileUrl' | 'createdAt' | 'updatedAt'>) {
    const id = uuidv4();
    const resource_type = this.resolveResourceType(filePath);

    try {
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        public_id: id,
        folder: 'documents',
        resource_type,
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
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(`Failed to upload document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async deleteDocument(id: string): Promise<boolean> {
    try {
      const doc = await this.repository.findUnique({ where: { id } });
      if (!doc) throw new Error('Document not found');

      const ext = path.extname(new URL(doc.fileUrl).pathname).toLowerCase();
      const isPdfOrRaw = ext === '.pdf' || !ext;
      const resource_type = isPdfOrRaw ? 'raw' : 'image';

      console.log(resource_type);

      const publicId = `documents/${id}`;
      const result = await cloudinary.uploader.destroy(publicId, { resource_type });
      console.log('result', result);

      await this.repository.delete({ where: { id } });
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new Error(`Failed to delete document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
