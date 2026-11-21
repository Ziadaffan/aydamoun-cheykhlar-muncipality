import { definedOnly, fieldReaders } from '@/packages/common/utils/request-body.utils';

/** Server-side checks of a history timeline entry (JSON or form data). Code: INVALID_HISTORY_ENTRY. */

export type HistoryEntryInput = {
  title: string;
  description: string;
  titleEn: string | null;
  descriptionEn: string | null;
  order: number;
};

export const HISTORY_LIMITS = { title: 200, description: 10000 };

export function parseHistoryEntryInput(body: Record<string, unknown>, partial: true): Partial<HistoryEntryInput>;
export function parseHistoryEntryInput(body: Record<string, unknown>, partial?: false): HistoryEntryInput;
export function parseHistoryEntryInput(body: Record<string, unknown>, partial = false): Partial<HistoryEntryInput> {
  const read = fieldReaders(body, 'INVALID_HISTORY_ENTRY');
  // English versions are optional: '' or null clears one; absent leaves it as it was on an update.
  const english = (key: string, max: number) => (partial ? read.optionalText(key, max) : (read.optionalText(key, max) ?? null));
  const input = {
    title: read.requiredText('title', HISTORY_LIMITS.title, partial),
    description: read.requiredText('description', HISTORY_LIMITS.description, partial),
    titleEn: english('titleEn', HISTORY_LIMITS.title),
    descriptionEn: english('descriptionEn', HISTORY_LIMITS.description),
    order: read.int('order') ?? (partial ? undefined : 0),
  };
  return partial ? definedOnly(input) : (input as HistoryEntryInput);
}
