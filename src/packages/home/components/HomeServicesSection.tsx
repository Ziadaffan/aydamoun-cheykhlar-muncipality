import { TFunction } from 'i18next';
import React from 'react';
import HomeServiceCard from './HomeServiceCard';
import HomeSectionHeader from './HomeSectionHeader';

type HomeServicesSectionProps = {
  t: TFunction<'translation', undefined>;
};

export interface ServiceCard {
  id: number;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  serviceUrl: string;
}

const services: ServiceCard[] = [
  {
    id: 1,
    titleKey: 'home.services.cards.buildingLicense.title',
    descriptionKey: 'home.services.cards.buildingLicense.description',
    icon: '🏗️',
    serviceUrl: '/services#buildingLicenses',
  },
  {
    id: 2,
    titleKey: 'home.services.cards.environmentalServices.title',
    descriptionKey: 'home.services.cards.environmentalServices.description',
    icon: '🌱',
    serviceUrl: '/services#environmentalServices',
  },
  {
    id: 3,
    titleKey: 'home.services.cards.administrativeTransactions.title',
    descriptionKey: 'home.services.cards.administrativeTransactions.description',
    icon: '📅',
    serviceUrl: '/services#administrativeTransactions',
  },
  {
    id: 4,
    titleKey: 'home.services.cards.downloadForms.title',
    descriptionKey: 'home.services.cards.downloadForms.description',
    icon: '📄',
    serviceUrl: '/services#officialForms',
  },
  {
    id: 5,
    titleKey: 'home.services.cards.submitComplaint.title',
    descriptionKey: 'home.services.cards.submitComplaint.description',
    icon: '📢',
    serviceUrl: '/services#complaintsAndSuggestions',
  },
  {
    id: 6,
    titleKey: 'home.services.cards.additionalServices.title',
    descriptionKey: 'home.services.cards.additionalServices.description',
    icon: '⭐',
    serviceUrl: '/services#additionalServices',
  },
];

export default function HomeServicesSection({ t }: HomeServicesSectionProps) {
  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <HomeSectionHeader title={t('home.services.title')} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map(service => (
            <HomeServiceCard key={service.id} service={service} t={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
