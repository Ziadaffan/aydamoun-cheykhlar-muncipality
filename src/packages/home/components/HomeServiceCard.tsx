import { TFunction } from 'i18next';
import React, { useState } from 'react';
import { ServiceCard } from './HomeServicesSection';

type HomeServiceCardProps = {
  service: ServiceCard;
  t: TFunction<'translation', undefined>;
};

export default function HomeServiceCard({ service, t }: HomeServiceCardProps) {
  const [isHovered, setIsHovered] = useState<number | null>(null);

  return (
    <div
      key={service.id}
      className={`cursor-pointer rounded-lg bg-white p-6 text-center shadow-lg transition-all duration-300 ${
        isHovered === service.id ? '-translate-y-2 transform shadow-xl' : 'hover:-translate-y-1 hover:transform'
      }`}
      onMouseEnter={() => setIsHovered(service.id)}
      onMouseLeave={() => setIsHovered(null)}
    >
      <div className="mb-4 text-4xl">{service.icon}</div>
      <h3 className="mb-3 text-xl font-bold text-gray-800">{t(service.titleKey)}</h3>
      <p className="leading-relaxed text-gray-600">{t(service.descriptionKey)}</p>
    </div>
  );
}
