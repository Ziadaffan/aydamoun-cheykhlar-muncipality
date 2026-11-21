import { Document } from '@prisma/client';
import DocumentCard from '@/packages/document/component/DocumentCard';
import { TFunction } from 'i18next';

type DocumentsGridProps = {
  documents: Document[];
  t: TFunction;
  role? : string;
};

export default function DocumentsGrid({ documents, t, role }: DocumentsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {documents.map(document => (
        <DocumentCard key={document.id} document={document} t={t} role={role} />
      ))}
    </div>
  );
}
