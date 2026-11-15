import type { AnnouncementPriority } from '@prisma/client';

/** An announcement as the API sends it (dates as ISO strings). */
export type AnnouncementDto = {
  id: string;
  title: string;
  body: string;
  titleEn: string | null;
  bodyEn: string | null;
  imageUrl: string | null;
  priority: AnnouncementPriority;
  pinned: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};
