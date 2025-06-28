import { TFunction } from 'i18next';
import React from 'react';

type HomeHeaderSectionProps = {
  t: TFunction<'translation', undefined>;
};

export default function HomeHeaderSection({ t }: HomeHeaderSectionProps) {
  return (
    <div
      className="relative flex h-100 items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("/assets/images/bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="relative z-10 px-4 text-center text-white">
        <h1 className="mb-6 text-4xl leading-tight font-bold md:text-6xl">
          {t('home.hero.title')}
        </h1>
        <p className="mb-8 text-xl text-gray-200 md:text-2xl">{t('home.hero.subtitle')}</p>
        <button className="transform rounded-lg bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700">
          {t('home.hero.ctaButton')}
        </button>
      </div>
    </div>
  );
}
