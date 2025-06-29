import { TFunction } from 'i18next';
import React from 'react';

type AboutUsMunicipalityInfoSectionProps = {
  t: TFunction;
};

export default function AboutUsMunicipalityInfoSection({ t }: AboutUsMunicipalityInfoSectionProps) {
  return (
    <section className="border-b border-gray-300 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-800 md:text-4xl">{t('aboutUs.municipality.title')}</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg bg-gradient-to-r from-green-50 to-blue-50 p-8 shadow-lg">
              <h3 className="mb-4 text-2xl font-bold text-blue-600">{t('aboutUs.municipality.mission')}</h3>
              <p className="leading-relaxed text-gray-700">{t('aboutUs.municipality.missionText')}</p>
            </div>
            <div className="rounded-lg bg-gradient-to-r from-green-50 to-blue-50 p-8 shadow-lg">
              <h3 className="mb-4 text-2xl font-bold text-blue-600">{t('aboutUs.municipality.vision')}</h3>
              <p className="leading-relaxed text-gray-700">{t('aboutUs.municipality.visionText')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
