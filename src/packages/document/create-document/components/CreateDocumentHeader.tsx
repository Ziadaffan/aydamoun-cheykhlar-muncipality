import { BackButton } from '@/packages/common/components/BackBotton';
import { useTranslation } from 'react-i18next';

export default function CreateDocumentHeader() {
  const { t } = useTranslation();
  return (
    <div className="mb-16 text-center">
      <BackButton />
      <h1 className="mb-6 text-4xl font-bold text-gray-800">{t('documents.form.title')}</h1>
    </div>
  );
}
