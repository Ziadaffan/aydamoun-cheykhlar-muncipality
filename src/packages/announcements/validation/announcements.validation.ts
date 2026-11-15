import { AnnouncementPriority } from '@prisma/client';
import { definedOnly, fieldReaders } from '@/packages/common/utils/request-body.utils';

/** Server-side checks of an admin's announcement (JSON or form data). Code: INVALID_ANNOUNCEMENT. */

export type AnnouncementInput = {
  title: string;
  body: string;
  titleEn: string | null;
  bodyEn: string | null;
  priority: AnnouncementPriority;
  pinned: boolean;
  expiresAt: Date | null;
};

export const ANNOUNCEMENT_PRIORITIES: readonly AnnouncementPriority[] = ['NORMAL', 'IMPORTANT', 'URGENT'];
export const ANNOUNCEMENT_LIMITS = { title: 200, body: 10000 };

export function parseAnnouncementInput(body: Record<string, unknown>, partial: true): Partial<AnnouncementInput>;
export function parseAnnouncementInput(body: Record<string, unknown>, partial?: false): AnnouncementInput;
export function parseAnnouncementInput(body: Record<string, unknown>, partial = false): Partial<AnnouncementInput> {
  const read = fieldReaders(body, 'INVALID_ANNOUNCEMENT');
  // English versions are optional: '' or null clears one; absent leaves it as it was on an update.
  const english = (key: string, max: number) => (partial ? read.optionalText(key, max) : (read.optionalText(key, max) ?? null));
  const input = {
    title: read.requiredText('title', ANNOUNCEMENT_LIMITS.title, partial),
    body: read.requiredText('body', ANNOUNCEMENT_LIMITS.body, partial),
    titleEn: english('titleEn', ANNOUNCEMENT_LIMITS.title),
    bodyEn: english('bodyEn', ANNOUNCEMENT_LIMITS.body),
    priority: body.priority === undefined && !partial ? 'NORMAL' : read.oneOf('priority', ANNOUNCEMENT_PRIORITIES, partial),
    pinned: read.bool('pinned') ?? (partial ? undefined : false),
    expiresAt: partial ? read.date('expiresAt') : (read.date('expiresAt') ?? null),
  };
  return partial ? definedOnly(input) : (input as AnnouncementInput);
}
