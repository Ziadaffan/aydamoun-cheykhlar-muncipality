import { TFunction } from 'i18next';
import React from 'react';
import PageHeader from '@/packages/common/components/PageHeader';

type ServicesHeroSectionProps = {
  t: TFunction<'translation', undefined>;
};

export default function ServicesHeroSection({ t }: ServicesHeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-gray-300 pt-12">
      <div className="relative container mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          <PageHeader title={t('services.hero.title')} subtitle={t('services.hero.subtitle')} />
        </div>
      </div>
    </section>
  );
}
