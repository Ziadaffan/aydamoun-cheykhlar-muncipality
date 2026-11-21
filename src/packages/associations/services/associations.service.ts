import { Association, Prisma } from '@prisma/client';
import { BasePrismaService } from '@/packages/common/services/prisma.service';
import { BadRequestError, NotFoundError } from '@/packages/common/errors';
import { destroyImage, uploadImage } from '@/packages/common/services/image.service';
import { fieldReaders } from '@/packages/common/utils/request-body.utils';
import { AssociationsRepository } from '../repository/associations.repository';

const IMAGE_FOLDER = 'associations';

/**
 * The optional English fields of an association form: trimmed, '' → null (clears it),
 * absent → undefined (an update leaves the stored value alone).
 */
export function readAssociationEnglish(formData: FormData) {
  const fields = fieldReaders(Object.fromEntries(formData), 'INVALID_ASSOCIATION');
  return {
    nameEn: fields.optionalText('nameEn', 150),
    descriptionEn: fields.optionalText('descriptionEn', 5000),
  };
}

/** The file in the `image` form field; undefined when none was picked (absent, empty part or a plain string). */
export function readAssociationImage(formData: FormData): File | undefined {
  const value = formData.get('image');
  return value && typeof value !== 'string' && value.size > 0 ? value : undefined;
}

export class AssociationsService extends BasePrismaService<'association'> {
  private static singleton: AssociationsService;

  constructor(repository: AssociationsRepository = new AssociationsRepository()) {
    super(repository);
  }

  public static instance(): AssociationsService {
    if (!AssociationsService.singleton) {
      AssociationsService.singleton = new AssociationsService();
    }
    return AssociationsService.singleton;
  }

  public async getAssociations(): Promise<Association[]> {
    return this.repository.findMany({ orderBy: { createdAt: 'desc' } });
  }

  public async getAssociationById(id: string): Promise<Association | null> {
    return this.repository.findUnique({ where: { id } });
  }

  /** The image is required; it is removed again if the row can't be saved. */
  public async create(associationData: Omit<Prisma.AssociationCreateInput, 'picaURL'>, image: File | undefined): Promise<Association> {
    if (!image) {
      throw new BadRequestError('Image is required', 'INVALID_IMAGE');
    }
    const picaURL = await uploadImage(image, IMAGE_FOLDER);

    try {
      return await this.repository.create({ data: { ...associationData, picaURL } });
    } catch (error) {
      await destroyImage(picaURL);
      throw error;
    }
  }

  /**
   * Without a new image the stored one is kept. With one, the old image is removed
   * only once the row points at the new one.
   */
  public async updateAssociation(id: string, associationData: Omit<Prisma.AssociationUpdateInput, 'picaURL'>, image?: File): Promise<Association> {
    const existingAssociation = await this.repository.findUnique({ where: { id } });

    if (!existingAssociation) {
      throw new NotFoundError('Association not found');
    }

    const newPicaURL = image ? await uploadImage(image, IMAGE_FOLDER) : undefined;

    let updated: Association;
    try {
      updated = await this.repository.update({
        where: { id },
        data: { ...associationData, ...(newPicaURL && { picaURL: newPicaURL }) },
      });
    } catch (error) {
      await destroyImage(newPicaURL);
      throw error;
    }

    if (newPicaURL && existingAssociation.picaURL !== newPicaURL) {
      await destroyImage(existingAssociation.picaURL);
    }
    return updated;
  }

  public async deleteAssociation(id: string): Promise<boolean> {
    try {
      const association = await this.repository.findUnique({ where: { id } });

      if (!association) {
        return false;
      }

      await this.repository.delete({ where: { id } });
      await destroyImage(association.picaURL);
      return true;
    } catch (error) {
      console.error('Error deleting association:', error);
      return false;
    }
  }
}
