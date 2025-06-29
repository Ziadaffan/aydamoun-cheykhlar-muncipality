import { TFunction } from 'i18next';
import React from 'react';
import Image from 'next/image';
import { Council } from '@prisma/client';

export type CouncilMember = {
  id: number;
  name: string;
  position: string;
  image: string;
  phone?: string | null;
};

const president: CouncilMember = {
  id: 1,
  name: 'السيد كمال نور الدين مقصود',
  position: 'رئيس البلدية',
  image: '/assets/images/kamal-profile.jpg',
};

type AboutUsPresidentSectionProps = {
  t: TFunction;
};

export default function AboutUsPresidentSection({ t }: AboutUsPresidentSectionProps) {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-800 md:text-4xl">{t('aboutUs.president.title')}</h2>

          <div className="flex flex-col items-center gap-12 lg:flex-row">
            <div className="flex-shrink-0">
              <div className="relative h-96 w-96 overflow-hidden rounded-full border-8 border-blue-600 shadow-2xl">
                <Image src={president.image} alt={t('aboutUs.president.name')} className="h-full w-full object-cover" width={384} height={384} />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-blue-900/20 to-transparent"></div>
              </div>
            </div>

            <div className="flex-1 text-center lg:text-right">
              <h3 className="mb-6 text-4xl font-bold text-gray-800">{president.name}</h3>
              <p className="mb-6 text-2xl font-semibold text-blue-600">{president.position}</p>
              <p className="text-lg leading-relaxed text-gray-600">{t('aboutUs.president.description')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
