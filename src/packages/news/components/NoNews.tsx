import { TFunction } from 'i18next';

type NoNewsProps = {
  t: TFunction;
};

export default function NoNews({ t }: NoNewsProps) {
  return (
    <div className="py-12 text-center">
      <div className="mb-4 text-gray-400">
        <svg className="mx-auto h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-medium text-gray-900">{t('news.page.noNews')}</h3>
      <p className="text-gray-500">{t('news.page.noNewsInCategory')}</p>
    </div>
  );
}
