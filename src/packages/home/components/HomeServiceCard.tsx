import { TFunction } from 'i18next';
import React from 'react';
import { ServiceCard } from './HomeServicesSection';

type HomeServiceCardProps = {
  service: ServiceCard;
  t: TFunction<'translation', undefined>;
};

export default function HomeServiceCard({ service, t }: HomeServiceCardProps) {
  return (
    <div key={service.id} className="relative w-full">
      <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-blue-400 to-green-400 opacity-10 blur-sm"></div>
      <div className="relative rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
        <div className="mb-4 text-center text-4xl">{service.icon}</div>
        <h3 className="mb-3 text-center text-xl font-bold text-gray-800">{t(service.titleKey)}</h3>
        <p className="text-center leading-relaxed text-gray-700">{t(service.descriptionKey)}</p>
      </div>
    </div>
  );
}
