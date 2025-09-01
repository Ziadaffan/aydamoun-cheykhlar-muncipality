import { Document } from '@prisma/client';
import { TFunction } from 'i18next';
import Button from '@/packages/common/components/Button';
import { useDeleteDocument } from '@/packages/document/hooks/useDeleteDocument';

type DocumentCardProps = {
  document: Document;
  role?: string;
  t: TFunction;
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function DocumentCard({ document, role, t }: DocumentCardProps) {
  const { mutate: deleteDocument, isPending } = useDeleteDocument();

  const onDelete = () => {
    deleteDocument(document.id);
  };

  return (
    <div key={document.id} className="relative h-70 w-96">
      <div className="relative flex h-full flex-col rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
        {/* Document Title */}
        <h3 className="mb-3 line-clamp-1 text-xl font-bold text-gray-800">{document.title}</h3>

        {/* Document Description */}
        {document.description && (
          <p className="mb-4 line-clamp-3 leading-relaxed break-words whitespace-normal text-gray-600">{document.description}</p>
        )}

        {/* Document Meta */}
        <div className="mb-4 text-xs text-gray-500">
          <span>
            {t('documents.added')} {formatDate(document.createdAt)}
          </span>
        </div>

        {/* Download Button */}
        <div className="mt-auto flex items-center gap-3">
          <a
            href={document.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex flex-1 cursor-pointer items-center justify-center rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-opacity duration-200 hover:opacity-80`}
          >
            {t('documents.download')}
          </a>
          {role === 'ADMIN' && (
            <Button variant="danger" onClick={onDelete} className="flex-1" disabled={isPending}>
              {t('documents.deleteDocument')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
