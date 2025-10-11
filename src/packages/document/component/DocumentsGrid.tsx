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
    <div className="flex flex-wrap justify-center gap-6">
      {documents.map(document => (
        <DocumentCard key={document.id} document={document} t={t} role={role} />
      ))}
    </div>
  );
}
