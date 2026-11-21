import { TFunction } from 'i18next';
import React from 'react';
import HistoryTeaserCard from '@/packages/history/components/HistoryTeaserCard';
import PageHeader from '@/packages/common/components/PageHeader';

type AboutUsMunicipalityInfoSectionProps = {
  t: TFunction;
};

export default function AboutUsMunicipalityInfoSection({ t }: AboutUsMunicipalityInfoSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-gray-300 pt-12 pb-20">
      <div className="relative container mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          <PageHeader title={t('aboutUs.municipality.title')} subtitle={t('aboutUs.municipality.subtitle')} className="md:mb-16" />

          <div className="space-y-12">
            {/* Village Description Card */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-4xl">
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-blue-400 to-sky-400 opacity-10 blur-sm"></div>
                <div className="relative rounded-2xl border border-white/20 bg-white/80 p-10 shadow-xl backdrop-blur-sm">
                  <h3 className="mb-6 text-3xl font-bold text-blue-600">{t('aboutUs.municipality.villageTitle')}</h3>
                  <p className="text-lg leading-relaxed font-medium text-gray-700">{t('aboutUs.municipality.villageDescription')}</p>
                </div>
              </div>
            </div>

            {/* The full story and timeline live on /history */}
            <div className="mx-auto w-full max-w-4xl">
              <HistoryTeaserCard title={t('aboutUs.history.cta')} body={t('aboutUs.history.body')} />
            </div>

            {/* Message and Vision Cards */}
            <div className="grid gap-8 md:grid-cols-2">
              <div className="relative">
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-blue-400 to-sky-400 opacity-10 blur-sm"></div>
                <div className="relative h-full rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
                  <h3 className="mb-6 text-3xl font-bold text-blue-600">{t('aboutUs.municipality.message')}</h3>
                  <p className="leading-relaxed font-medium text-gray-700">{t('aboutUs.municipality.messageText')}</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-blue-400 to-sky-400 opacity-10 blur-sm"></div>
                <div className="relative h-full rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
                  <h3 className="mb-6 text-3xl font-bold text-blue-600">{t('aboutUs.municipality.vision')}</h3>
                  <p className="leading-relaxed font-medium text-gray-700">{t('aboutUs.municipality.visionText')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
