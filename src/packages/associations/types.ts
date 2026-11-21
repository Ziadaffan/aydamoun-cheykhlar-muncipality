/** An association as GET /api/associations returns it (dates as ISO strings). */
export type AssociationItem = {
  id: string;
  name: string;
  description: string;
  /** Cloudinary public id or an https URL. */
  picaURL: string;
  nameEn?: string | null;
  descriptionEn?: string | null;
  createdAt?: string;
};
