import { Announcement, Prisma } from '@prisma/client';
import { BasePrismaService } from '@/packages/common/services/prisma.service';
import { NotFoundError } from '@/packages/common/errors';
import { destroyImage, uploadImage } from '@/packages/common/services/image.service';
import { AnnouncementsRepository } from '../repository/announcements.repository';
import { AnnouncementInput } from '../validation/announcements.validation';

const IMAGE_FOLDER = 'announcements';
const MAX_LIMIT = 100;

export type AnnouncementImageChange = { imageFile?: File; imageRef?: string; removeImage?: boolean };

const notFound = () => new NotFoundError('Announcement not found', 'ANNOUNCEMENT_NOT_FOUND');

export class AnnouncementsService extends BasePrismaService<'announcement'> {
  private static singleton: AnnouncementsService;

  constructor(repository: AnnouncementsRepository = new AnnouncementsRepository()) {
    super(repository);
  }

  public static instance(): AnnouncementsService {
    if (!AnnouncementsService.singleton) {
      AnnouncementsService.singleton = new AnnouncementsService();
    }
    return AnnouncementsService.singleton;
  }

  /** Pinned first, newest first. Expired ones only with `includeExpired` (admin). */
  public async getAnnouncements({ limit, includeExpired = false }: { limit?: number; includeExpired?: boolean } = {}): Promise<Announcement[]> {
    const where: Prisma.AnnouncementWhereInput | undefined = includeExpired
      ? undefined
      : { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] };
    return this.repository.findMany({
      where,
      orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
      ...(limit && { take: Math.min(Math.max(limit, 1), MAX_LIMIT) }),
    });
  }

  public async getAnnouncementById(id: string): Promise<Announcement> {
    const announcement = await this.repository.findUnique({ where: { id } });
    if (!announcement) throw notFound();
    return announcement;
  }

  public async create(input: AnnouncementInput, createdBy: string, image: AnnouncementImageChange = {}): Promise<Announcement> {
    const imageUrl = image.imageFile ? await uploadImage(image.imageFile, IMAGE_FOLDER) : (image.imageRef ?? null);
    return this.repository.create({ data: { ...input, imageUrl, createdBy } });
  }

  public async update(id: string, input: Partial<AnnouncementInput>, image: AnnouncementImageChange = {}): Promise<Announcement> {
    const existing = await this.getAnnouncementById(id);

    let imageUrl = existing.imageUrl;
    if (image.imageFile) {
      imageUrl = await uploadImage(image.imageFile, IMAGE_FOLDER);
    } else if (image.imageRef !== undefined) {
      imageUrl = image.imageRef;
    } else if (image.removeImage) {
      imageUrl = null;
    }

    let updated;
    try {
      updated = await this.repository.update({ where: { id }, data: { ...input, imageUrl } });
    } catch (error) {
      // The new upload isn't used: remove it again.
      if (image.imageFile) await destroyImage(imageUrl);
      throw error;
    }
    if (existing.imageUrl && existing.imageUrl !== imageUrl) await destroyImage(existing.imageUrl);
    return updated;
  }

  public async delete(id: string): Promise<void> {
    const existing = await this.getAnnouncementById(id);
    await this.repository.delete({ where: { id } });
    await destroyImage(existing.imageUrl);
  }
}
