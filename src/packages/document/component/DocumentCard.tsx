import { Document } from '@prisma/client';
import { FileText } from 'lucide-react';
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
    <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Fixed band with the file type, the same height on every document card. */}
      <div className="relative flex h-28 flex-shrink-0 items-center justify-center gap-3 bg-blue-100 text-blue-700" aria-hidden="true">
        <FileText className="h-12 w-12 opacity-80" />
        <span className="rounded-md bg-white/70 px-2 py-0.5 text-sm font-bold uppercase">{documentExtension(document.type)}</span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-3 line-clamp-2 text-xl font-bold break-words text-gray-800 [overflow-wrap:anywhere]">{title}</h3>

        {description && <p className="mb-4 line-clamp-3 leading-relaxed break-words text-gray-600 [overflow-wrap:anywhere]">{description}</p>}

        <div className="mb-4 text-xs text-gray-500">
          <span>
            {t('documents.added')} {formatDate(document.createdAt, i18n.language)}
          </span>
        </div>

        <div className="mt-auto flex items-center gap-3">
          <a
            href={fileSrc}
            download={`${title}.${documentExtension(document.type)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-bold text-white shadow transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
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
    </article>
  );
}
