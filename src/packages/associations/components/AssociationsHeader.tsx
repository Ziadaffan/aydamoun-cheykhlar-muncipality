import { useTranslation } from 'react-i18next';
export default function AssociationsHeader() {
  const { t } = useTranslation();
  return (
    <div className="mb-10 text-center">
      <h1 className="mb-3 text-3xl font-bold text-gray-900 md:text-5xl">{t('associations.title')}</h1>
      <p className="mx-auto max-w-3xl text-sm text-gray-600 md:text-lg">
        {t('associations.subtitle')}
      </p>
    </div>
  );
}
