import { TFunction } from 'i18next';
import React from 'react';
import ServiceCard from './ServiceCard';

type ServicesCategorySectionProps = {
  t: TFunction<'translation', undefined>;
  categoryKey: string;
  icon: string;
  bgColor: string;
};

export default function ServicesCategorySection({ t, categoryKey, icon, bgColor }: ServicesCategorySectionProps) {
  const services = t(`services.${categoryKey}.services`, { returnObjects: true }) as Array<{
    id: number;
    title: string;
    description: string;
  }>;

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 text-6xl">{icon}</div>
            <h2 className="text-3xl font-bold text-gray-800 md:text-4xl">{t(`services.${categoryKey}.title`)}</h2>
          </div>

          {/* Services Grid */}
          <div className="flex flex-wrap justify-center gap-6">
            {services.map(service => (
              <ServiceCard key={service.id} service={service} bgColor={bgColor} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
