import { Position } from '@prisma/client';

const LABELS: Record<Position, { ar: string; en: string }> = {
  [Position.PRESIDENT]: { ar: 'رئيس البلدية', en: 'Mayor' },
  [Position.VICE_PRESIDENT]: { ar: 'نائب رئيس البلدية', en: 'Deputy mayor' },
  [Position.COUNCIL_MEMBER]: { ar: 'عضو لجنة البلدية', en: 'Council member' },
};

/** Council position label; without `language` it follows <html lang> (Arabic on the server). */
export const getPositionLabel = (position: Position, language?: string) => {
  const lang = language ?? (typeof document !== 'undefined' ? document.documentElement.lang : 'ar');
  const label = LABELS[position];
  return lang?.startsWith('en') ? label.en : label.ar;
};
