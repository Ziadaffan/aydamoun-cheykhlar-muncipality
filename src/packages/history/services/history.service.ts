import { HistoryEntry } from '@prisma/client';
import { BasePrismaService } from '@/packages/common/services/prisma.service';
import { NotFoundError } from '@/packages/common/errors';
import { destroyImage, uploadImage } from '@/packages/common/services/image.service';
import { HistoryRepository } from '../repository/history.repository';
import { HistoryEntryInput } from '../validation/history.validation';

const IMAGE_FOLDER = 'history';

export type HistoryImageChange = { imageFile?: File; imageRef?: string; removeImage?: boolean };

const notFound = () => new NotFoundError('History entry not found', 'HISTORY_ENTRY_NOT_FOUND');

export class HistoryService extends BasePrismaService<'historyEntry'> {
  private static singleton: HistoryService;

  constructor(repository: HistoryRepository = new HistoryRepository()) {
    super(repository);
  }

  public static instance(): HistoryService {
    if (!HistoryService.singleton) {
      HistoryService.singleton = new HistoryService();
    }
    return HistoryService.singleton;
  }

  /** Chronological: `order` ascending, then creation. */
  public async getEntries(): Promise<HistoryEntry[]> {
    return this.repository.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] });
  }

  public async getEntryById(id: string): Promise<HistoryEntry> {
    const entry = await this.repository.findUnique({ where: { id } });
    if (!entry) throw notFound();
    return entry;
  }

  public async create(input: HistoryEntryInput, image: HistoryImageChange = {}): Promise<HistoryEntry> {
    const imageUrl = image.imageFile ? await uploadImage(image.imageFile, IMAGE_FOLDER) : (image.imageRef ?? null);
    return this.repository.create({ data: { ...input, imageUrl } });
  }

  public async update(id: string, input: Partial<HistoryEntryInput>, image: HistoryImageChange = {}): Promise<HistoryEntry> {
    const existing = await this.getEntryById(id);

    let imageUrl = existing.imageUrl;
    if (image.imageFile) {
      imageUrl = await uploadImage(image.imageFile, IMAGE_FOLDER);
    } else if (image.imageRef !== undefined) {
      imageUrl = image.imageRef;
    } else if (image.removeImage) {
      imageUrl = null;
    }

    const updated = await this.repository.update({ where: { id }, data: { ...input, imageUrl } });
    if (existing.imageUrl && existing.imageUrl !== imageUrl) await destroyImage(existing.imageUrl);
    return updated;
  }

  public async delete(id: string): Promise<void> {
    const existing = await this.getEntryById(id);
    await this.repository.delete({ where: { id } });
    await destroyImage(existing.imageUrl);
  }
}
