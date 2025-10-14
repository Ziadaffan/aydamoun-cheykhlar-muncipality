import { useTranslation } from 'react-i18next';

export default function JobsHeader() {
  const { t } = useTranslation();

  return (
    <div className="mb-16 text-center">
      <h1 className="mb-6 text-4xl font-bold text-gray-800 md:text-5xl lg:text-6xl">{t('jobs.title')}</h1>
      <p className="text-lg leading-relaxed text-gray-700 md:text-xl">{t('jobs.subtitle')}</p>
    </div>
  );
}
