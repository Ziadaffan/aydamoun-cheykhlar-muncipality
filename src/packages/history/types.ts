/** A history timeline entry as the API sends it. */
export type HistoryEntryDto = {
  id: string;
  period: string;
  title: string;
  description: string;
  periodEn: string | null;
  titleEn: string | null;
  descriptionEn: string | null;
  imageUrl: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
};
