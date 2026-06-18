import { TFunction } from 'i18next';
import CreateDocumentAdminButton from './CreateDocumentAdminButton';

type DocumentsHeaderProps = {
  t: TFunction;
  role?: string;
};

export default function DocumentsHeader({ t, role }: DocumentsHeaderProps) {
  return (
    <div className="mb-16 text-center">
      <h1 className="mb-6 text-4xl font-bold text-gray-800 md:text-5xl lg:text-6xl">{t('documents.title')}</h1>
      <p className="text-lg leading-relaxed text-gray-700 md:text-xl">{t('documents.description')}</p>
      {role === 'ADMIN' && <CreateDocumentAdminButton t={t} />}
    </div>
  );
}
