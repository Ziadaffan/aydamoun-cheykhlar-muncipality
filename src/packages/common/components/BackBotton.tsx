import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export const BackButton = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <button
      onClick={() => router.back()}
      className="flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2 text-gray-700 shadow-md transition-all hover:bg-gray-50 hover:shadow-lg"
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span>{t('common.back')}</span>
    </button>
  );
};
