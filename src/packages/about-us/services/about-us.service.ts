import { BasePrismaService } from '@/packages/common/services/prisma.service';
import { AboutUsRepository } from '../repository/about-us.repository';
import { Council, Position } from '@prisma/client';
import { NotFoundError } from '@/packages/common/errors';
import { destroyImage, uploadImage } from '@/packages/common/services/image.service';
import { CouncilMemberInput } from '../validation/council.validation';

const IMAGE_FOLDER = 'council';
const POSITION_RANK: Record<Position, number> = { PRESIDENT: 0, VICE_PRESIDENT: 1, COUNCIL_MEMBER: 2 };

export type CouncilImageChange = { imageFile?: File; imageRef?: string; removeImage?: boolean };

const notFound = () => new NotFoundError('Council member not found', 'COUNCIL_MEMBER_NOT_FOUND');

/** President, vice-president, then the members by `order` and name. */
export function sortCouncilMembers<T extends Pick<Council, 'position' | 'order' | 'name'>>(members: T[]): T[] {
  return [...members].sort(
    (a, b) => POSITION_RANK[a.position] - POSITION_RANK[b.position] || a.order - b.order || a.name.localeCompare(b.name, 'ar')
  );
}

export class AboutUsService extends BasePrismaService<'council'> {
  private static singleton: AboutUsService;
  constructor(repository: AboutUsRepository = new AboutUsRepository()) {
    super(repository);
  }

  public static instance(): AboutUsService {
    if (!AboutUsService.singleton) {
      AboutUsService.singleton = new AboutUsService();
    }
    return AboutUsService.singleton;
  }

  public async getCouncilMembers(): Promise<Council[]> {
    return sortCouncilMembers(await this.repository.findMany());
  }

  public async getCouncilMemberById(id: string): Promise<Council> {
    const member = await this.repository.findUnique({ where: { id } });
    if (!member) throw notFound();
    return member;
  }

  public async createCouncilMember(input: CouncilMemberInput, image: CouncilImageChange = {}): Promise<Council> {
    const imageId = image.imageFile ? await uploadImage(image.imageFile, IMAGE_FOLDER) : (image.imageRef ?? null);
    return this.repository.create({ data: { ...input, image: imageId } });
  }

  public async updateCouncilMember(id: string, input: Partial<CouncilMemberInput>, image: CouncilImageChange = {}): Promise<Council> {
    const existing = await this.getCouncilMemberById(id);

    let imageId = existing.image;
    if (image.imageFile) {
      imageId = await uploadImage(image.imageFile, IMAGE_FOLDER);
    } else if (image.imageRef !== undefined) {
      imageId = image.imageRef;
    } else if (image.removeImage) {
      imageId = null;
    }

    let updated;
    try {
      updated = await this.repository.update({ where: { id }, data: { ...input, image: imageId } });
    } catch (error) {
      // The new upload isn't used: remove it again.
      if (image.imageFile) await destroyImage(imageId);
      throw error;
    }
    if (existing.image && existing.image !== imageId) await destroyImage(existing.image);
    return updated;
  }

  public async deleteCouncilMember(id: string): Promise<void> {
    const existing = await this.getCouncilMemberById(id);
    await this.repository.delete({ where: { id } });
    await destroyImage(existing.image);
  }
}
