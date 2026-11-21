'use client';

import { TFunction } from 'i18next';
import React, { useState } from 'react';
import { Council } from '@prisma/client';
import { useLocalized } from '@/lib/localized';
import StoredImage from '@/packages/common/components/StoredImage';
import CouncilMemberModal from './CouncilMemberModal';

type AboutUsPresidentSectionProps = {
  t: TFunction;
  president: Council;
};

export default function AboutUsPresidentSection({ t, president }: AboutUsPresidentSectionProps) {
  const loc = useLocalized();
  const [open, setOpen] = useState(false);

  return (
    <section className="relative overflow-hidden border-b border-gray-300 py-20">
      <div className="relative container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-800 md:text-5xl lg:text-6xl">{t('aboutUs.president.title')}</h2>
            <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-sky-500"></div>
          </div>

          <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-20">
            <div className="flex flex-shrink-0 flex-col items-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-600 to-sky-600 opacity-30 blur-lg"></div>
                <div className="relative h-80 w-80 overflow-hidden rounded-full border-8 border-white shadow-2xl ring-4 ring-blue-100">
                  {president.image && (
                    <StoredImage
                      src={president.image}
                      alt={loc(president.name, president.nameEn)}
                      sizes="320px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
              </div>

              <div className="mt-8 w-full max-w-sm">
                <div className="relative rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                  <p className="text-center leading-relaxed font-medium text-gray-700">
                    {t('aboutUs.president.message')}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 text-center lg:text-start">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-5xl font-bold text-transparent">
                    {loc(president.name, president.nameEn)}
                  </h3>
                  <div className="inline-block rounded-full bg-gradient-to-r from-blue-600 to-sky-600 px-6 py-2 text-xl font-semibold text-white shadow-lg">
                    {t(`aboutUs.positions.${president.position}`)}
                  </div>
                  {(president.role || president.major) && (
                    <div className="mt-4 space-y-1">
                      {president.role && <p className="text-xl font-semibold text-gray-800">{loc(president.role, president.roleEn)}</p>}
                      {president.major && <p className="text-lg text-gray-600">{loc(president.major, president.majorEn)}</p>}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-white/20 bg-white/60 p-8 shadow-lg backdrop-blur-sm">
                  <p className="text-lg leading-relaxed font-medium text-gray-700">{t('aboutUs.president.description')}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  aria-haspopup="dialog"
                  className="cursor-pointer rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {t('aboutUs.member.viewDetails')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CouncilMemberModal t={t} member={president} open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
