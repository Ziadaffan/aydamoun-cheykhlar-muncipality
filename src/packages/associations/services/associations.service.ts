import { Association } from '@prisma/client';
import { BasePrismaService } from '@/packages/common/services/prisma.service';
import { AssociationsRepository } from '../repository/associations.repository';
import { v2 as cloudinary } from 'cloudinary';

export class AssociationsService extends BasePrismaService<'association'> {
  private static singleton: AssociationsService;

  constructor(repository: AssociationsRepository = new AssociationsRepository()) {
    super(repository);
  }

  public static instance(): AssociationsService {
    if (!AssociationsService.singleton) {
      if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        throw new Error('Cloudinary environment variables are missing');
      }

      cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      });

      AssociationsService.singleton = new AssociationsService();
    }
    return AssociationsService.singleton;
  }

  private async uploadAssociationImage(imageBase64: string, mimeType: string): Promise<string> {
    const uploadResult = await cloudinary.uploader.upload(`data:${mimeType};base64,${imageBase64}`, {
      folder: 'associations',
      resource_type: 'image',
    });

    return uploadResult.public_id;
  }

  public async getAssociations(): Promise<Association[]> {
    return this.repository.findMany({ orderBy: { createdAt: 'desc' } });
  }

  public async getAssociationById(id: string): Promise<Association | null> {
    return this.repository.findUnique({ where: { id } });
  }

  public async create(
    associationData: Omit<Association, 'id' | 'createdAt' | 'updatedAt' | 'picaURL'>,
    imageBase64: string,
    imageMimeType: string
  ): Promise<Association> {
    const picaURL = await this.uploadAssociationImage(imageBase64, imageMimeType);

    return this.repository.create({
      data: {
        ...associationData,
        picaURL,
      },
    });
  }

  public async updateAssociation(
    id: string,
    associationData: Omit<Association, 'id' | 'createdAt' | 'updatedAt' | 'picaURL'>,
    imageBase64?: string,
    imageMimeType?: string
  ): Promise<Association> {
    const existingAssociation = await this.repository.findUnique({ where: { id } });

    if (!existingAssociation) {
      throw new Error('Association not found');
    }

    let picaURL = existingAssociation.picaURL;

    if (imageBase64 && imageMimeType) {
      const newPublicId = await this.uploadAssociationImage(imageBase64, imageMimeType);
      if (existingAssociation.picaURL) {
        await cloudinary.uploader.destroy(existingAssociation.picaURL, { resource_type: 'image' });
      }
      picaURL = newPublicId;
    }

    return this.repository.update({
      where: { id },
      data: {
        ...associationData,
        picaURL,
      },
    });
  }

  public async deleteAssociation(id: string): Promise<boolean> {
    try {
      const association = await this.repository.findUnique({ where: { id } });

      if (!association) {
        return false;
      }

      if (association.picaURL) {
        await cloudinary.uploader.destroy(association.picaURL, { resource_type: 'image' });
      }

      await this.repository.delete({ where: { id } });
      return true;
    } catch (error) {
      console.error('Error deleting association:', error);
      return false;
    }
  }
}
