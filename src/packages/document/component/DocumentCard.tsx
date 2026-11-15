import { Document } from '@prisma/client';
import { TFunction } from 'i18next';
import Button from '@/packages/common/components/Button';
import { useDeleteDocument } from '@/packages/document/hooks/useDeleteDocument';
import { useTranslation } from 'react-i18next';
import { useLocalized } from '@/lib/localized';
import { dateLocale } from '@/packages/common/utils/date.utils';
import { documentExtension, documentMimeType, isRemoteFileUrl } from '@/packages/document/utils/document.utils';

type DocumentCardProps = {
  document: Document;
  role?: string;
  t: TFunction;
};

// The API returns the file's web address; base64 (older API) still works as a data: URI.
const getFileUrl = (doc: Document) => {
  if (isRemoteFileUrl(doc.fileUrl) || doc.fileUrl.startsWith('data:')) return doc.fileUrl;
  return `data:${documentMimeType(doc.type)};base64,${doc.fileUrl}`;
};

const formatDate = (date: Date, language: string | undefined) => {
  return new Date(date).toLocaleDateString(dateLocale(language), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function DocumentCard({ document, role, t }: DocumentCardProps) {
  const { mutate: deleteDocument, isPending } = useDeleteDocument();
  const fileSrc = getFileUrl(document);
  const { i18n } = useTranslation();
  const loc = useLocalized();
  const title = loc(document.title, document.titleEn);
  const description = document.description ? loc(document.description, document.descriptionEn) : null;

  const onDelete = () => {
    deleteDocument(document.id);
  };

  return (
    <div key={document.id} className="relative h-60 w-96">
      <div className="relative flex h-full flex-col rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
        {/* Document Title */}
        <h3 className="mb-3 line-clamp-1 text-xl font-bold text-gray-800">{title}</h3>

        {/* Document Description */}
        {description && (
          <p className="mb-4 line-clamp-2 leading-relaxed break-words whitespace-normal text-gray-600">{description}</p>
        )}

        {/* Document Meta */}
        <div className="mb-4 text-xs text-gray-500">
          <span>
            {t('documents.added')} {formatDate(document.createdAt, i18n.language)}
          </span>
        </div>

        {/* Download Button */}
        <div className="mt-auto flex items-center gap-3">
          <a
            href={fileSrc}
            download={`${title}.${documentExtension(document.type)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex flex-1 cursor-pointer items-center justify-center rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-opacity duration-200 hover:opacity-80`}
          >
            {t('documents.download')}
          </a>
          {role === 'ADMIN' && (
            <Button variant="danger" loading={isPending} onClick={onDelete} className="flex-1" disabled={isPending}>
              {t('documents.deleteDocument')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
