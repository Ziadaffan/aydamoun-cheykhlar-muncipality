import { TFunction } from 'i18next';
import Image from 'next/image';

type DocumentsEmptyStateProps = {
  t: TFunction;
};

export default function DocumentsEmptyState({ t }: DocumentsEmptyStateProps) {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
        <Image src="/file.svg" alt="No documents" width={32} height={32} className="text-gray-400" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-gray-800">{t('documents.noDocuments')}</h3>
      <p className="text-gray-700">{t('documents.noDocumentsDescription')}</p>
    </div>
  );
}
