import { TFunction } from 'i18next';

type NewHeaderProps = {
  t: TFunction;
};

export const NewHeader = ({ t }: NewHeaderProps) => {
  return (
    <div className={`mb-12`}>
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">{t('new.page.title')}</h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">{t('new.page.description')}</p>
        </div>
      </div>
    </div>
  );
};
