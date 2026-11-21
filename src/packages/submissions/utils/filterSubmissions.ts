import { ServiceStatus, ServiceSubmission, ServiceType } from '@prisma/client';
import { submissionReference } from '@/packages/serviceSubmissions/utils/reference';

/** A request as /api/user/service-submissions returns it (with its service). */
export type MySubmission = ServiceSubmission & {
  service?: { name: string; nameEn?: string | null; type: ServiceType } | null;
};

export type StatusFilter = 'ALL' | ServiceStatus;
export type SortKey = 'newest' | 'oldest' | 'updated';

export const STATUSES: ServiceStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'];
export const SORT_KEYS: SortKey[] = ['newest', 'oldest', 'updated'];
export const ALL_CATEGORIES = 'ALL';

/** Same order as the services page. */
export const CATEGORY_ORDER: ServiceType[] = [
  'LICENSEES_AND_CONSTRUCTION_SERVICES',
  'ENVIRONMENTAL_SERVICES',
  'ADMINISTRATIVE_SERVICES',
  'DOWNLOAD_OFFICIAL_FORMS_SERVICES',
  'COMPLAINTS_AND_SUGGESTIONS_SERVICES',
  'OTHER',
];

/** Lower-case, without Arabic diacritics/tatweel, with alef/yaa/taa-marbuta forms unified. */
export function normalizeSearchText(text: string): string {
  return text
    .toLocaleLowerCase()
    .replace(/[ً-ٰٟـ]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim();
}

export const submissionCategory = (s: MySubmission): ServiceType => s.service?.type ?? 'OTHER';

const time = (value: Date | string) => new Date(value).getTime() || 0;

export const SORTERS: Record<SortKey, (a: MySubmission, b: MySubmission) => number> = {
  newest: (a, b) => time(b.createdAt) - time(a.createdAt),
  oldest: (a, b) => time(a.createdAt) - time(b.createdAt),
  updated: (a, b) => time(b.updatedAt) - time(a.updatedAt),
};

/**
 * Whether a request matches every word of the search: its service name (Arabic or English),
 * description, or reference number (with or without a leading '#').
 */
export function matchesQuery(s: MySubmission, query: string): boolean {
  const terms = normalizeSearchText(query.replace(/#/g, ' ')).split(' ').filter(Boolean);
  if (terms.length === 0) return true;
  const text = normalizeSearchText(
    [s.service?.name, s.service?.nameEn, s.description, submissionReference(s.id), s.id].filter(Boolean).join(' ')
  );
  return terms.every(term => text.includes(term));
}
