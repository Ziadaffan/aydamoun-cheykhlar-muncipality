import { TFunction } from 'i18next';
import React from 'react';
import HomeServiceCard from './HomeServiceCard';

type HomeServicesSectionProps = {
  t: TFunction<'translation', undefined>;
};

export interface ServiceCard {
  id: number;
  titleKey: string;
  descriptionKey: string;
  icon: string;
}

const services: ServiceCard[] = [
  {
    id: 1,
    titleKey: 'home.services.cards.submitRequest.title',
    descriptionKey: 'home.services.cards.submitRequest.description',
    icon: '📝',
  },
  {
    id: 2,
    titleKey: 'home.services.cards.payBills.title',
    descriptionKey: 'home.services.cards.payBills.description',
    icon: '💳',
  },
  {
    id: 3,
    titleKey: 'home.services.cards.buildingLicense.title',
    descriptionKey: 'home.services.cards.buildingLicense.description',
    icon: '🏗️',
  },
  {
    id: 4,
    titleKey: 'home.services.cards.submitComplaint.title',
    descriptionKey: 'home.services.cards.submitComplaint.description',
    icon: '📞',
  },
  {
    id: 5,
    titleKey: 'home.services.cards.bookAppointment.title',
    descriptionKey: 'home.services.cards.bookAppointment.description',
    icon: '📅',
  },
  {
    id: 6,
    titleKey: 'home.services.cards.downloadForms.title',
    descriptionKey: 'home.services.cards.downloadForms.description',
    icon: '📄',
  },
];

export default function HomeServicesSection({ t }: HomeServicesSectionProps) {
  return (
    <div className="bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
            {t('home.services.title')}
          </h2>
          <p className="text-xl text-gray-600">{t('home.services.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map(service => (
            <HomeServiceCard key={service.id} service={service} t={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
