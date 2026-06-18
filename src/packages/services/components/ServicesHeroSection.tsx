import { TFunction } from 'i18next';
import React from 'react';

type ServicesHeroSectionProps = {
  t: TFunction<'translation', undefined>;
};

export default function ServicesHeroSection({ t }: ServicesHeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-gray-300 pt-20">
      <div className="relative container mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-4xl font-bold text-gray-800 md:text-5xl lg:text-6xl">{t('services.hero.title')}</h1>
            <p className="text-lg leading-relaxed text-gray-700 md:text-xl">{t('services.hero.subtitle')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
