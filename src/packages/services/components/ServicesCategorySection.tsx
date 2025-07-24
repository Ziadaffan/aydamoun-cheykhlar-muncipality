import { TFunction } from 'i18next';
import React from 'react';
import ServiceCard from './ServiceCard';
import { Service } from '@prisma/client';

type ServicesCategorySectionProps = {
  t: TFunction<'translation', undefined>;
  categoryKey: string;
  icon: string;
  bgColor: string;
  services: Service[];
};

export default function ServicesCategorySection({ t, categoryKey, icon, bgColor, services }: ServicesCategorySectionProps) {
  return (
    <section className="py-12" id={categoryKey}>
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 text-6xl">{icon}</div>
            <h2 className="text-3xl font-bold text-gray-800 md:text-4xl">{t(`services.${categoryKey}.title`)}</h2>
          </div>

          {/* Services Grid */}
          <div className="flex flex-wrap justify-center gap-6">
            {services.map((service, index) => (
              <ServiceCard key={service.id} num={index + 1} service={service} bgColor={bgColor} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
