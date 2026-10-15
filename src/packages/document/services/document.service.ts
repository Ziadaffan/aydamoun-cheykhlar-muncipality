import { BasePrismaService } from '@/packages/common/services/prisma.service';
import { DocumentRepository } from '../repository/document.repository';
import { Document } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { NotFoundError } from '@/packages/common/errors';
import { documentFileUrl } from '../utils/document.utils';

/** The fields needed to serve a document's file. */
export type DocumentFile = Pick<Document, 'id' | 'title' | 'type' | 'fileUrl' | 'updatedAt'>;

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

  /**
   * Every document, newest first, with `fileUrl` as an absolute web address.
   * Uploads are stored as base64 in `fileUrl`; those are pointed at
   * GET /api/documents/<id>/file so the list never carries the files themselves.
   */
  public async getAllDocuments(origin: string): Promise<Document[]> {
    // Two small queries instead of one that would read every base64 file: the
    // list without fileUrl, then fileUrl only for the rows that hold a web address.
    const [documents, linked] = await Promise.all([
      this.repository.findMany({
        select: { id: true, title: true, description: true, type: true, createdAt: true, updatedAt: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.repository.findMany({
        where: {
          OR: [
            { fileUrl: { startsWith: 'https://', mode: 'insensitive' } },
            { fileUrl: { startsWith: 'http://', mode: 'insensitive' } },
          ],
        },
        select: { id: true, fileUrl: true },
      }),
    ]);
    const urls = new Map(linked.map(({ id, fileUrl }) => [id, fileUrl]));

    return documents.map(doc => ({ ...doc, fileUrl: urls.get(doc.id) ?? documentFileUrl(origin, doc.id) }));
  }

  /** The document's file as stored (a web address or base64); 404 when the document doesn't exist. */
  public async getDocumentFile(id: string): Promise<DocumentFile> {
    const doc = await this.repository.findUnique({
      where: { id },
      select: { id: true, title: true, type: true, fileUrl: true, updatedAt: true },
    });
    if (!doc) throw new NotFoundError('Document not found', 'DOCUMENT_NOT_FOUND');
    return doc;
  }

  public async createDocument(filePath: string, document: Omit<Document, 'id' | 'fileUrl' | 'createdAt' | 'updatedAt'>) {
    const savedDoc = await this.repository.create({
      data: {
        ...document,
        fileUrl: filePath,
      },
    });

    return savedDoc;
  }

  public async deleteDocument(id: string): Promise<boolean> {
    const doc = await this.repository.findUnique({ where: { id }, select: { id: true } });
    if (!doc) throw new NotFoundError('Document not found', 'DOCUMENT_NOT_FOUND');

    await this.repository.delete({ where: { id } });
    return true;
  }
}
