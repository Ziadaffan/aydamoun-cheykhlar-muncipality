'use client';

import { useTranslation } from 'react-i18next';
import { Eye, Landmark, Target, type LucideIcon } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import { VILLAGE_STORY_IMAGE } from '@/packages/home/slides';
import HistoryTimeline from './HistoryTimeline';

function ValueCard({ icon: Icon, title, body, tone }: { icon: LucideIcon; title: string; body: string; tone: string }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
      <span className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${tone}`} aria-hidden="true">
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <h2 className="mb-2 text-xl font-bold text-gray-800">{title}</h2>
        <p className="leading-relaxed text-gray-700">{body}</p>
      </div>
    </div>
  );
}

/** The village's story, like the app's history screen: hero, intro, mission/vision, then the timeline. */
export default function HistoryPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-r from-mist to-sand py-8 md:py-12">
      <div className="mx-auto max-w-4xl space-y-10 px-4">
        <header
          className="relative flex min-h-64 items-end overflow-hidden rounded-3xl shadow-xl md:min-h-80"
        >
          <CldImage src={VILLAGE_STORY_IMAGE} alt="" fill priority sizes="(max-width: 896px) 100vw, 896px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" aria-hidden="true" />
          <div className="relative p-6 text-on-image md:p-10">
            <Landmark className="mb-3 h-8 w-8" aria-hidden />
            <h1 className="mb-2 text-3xl font-bold md:text-5xl">{t('history.title')}</h1>
            <p className="mb-2 max-w-2xl text-lg leading-relaxed text-on-image md:text-xl">{t('history.subtitle')}</p>
            <p className="text-sm text-on-image/90 md:text-base">{t('history.tagline')}</p>
          </div>
        </header>

        <section className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-sm md:p-8">
          <h2 className="mb-4 text-2xl font-bold text-blue-600">{t('aboutUs.municipality.villageTitle')}</h2>
          <p className="text-lg leading-relaxed text-gray-700">{t('aboutUs.municipality.villageDescription')}</p>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <ValueCard icon={Target} title={t('aboutUs.municipality.message')} body={t('aboutUs.municipality.messageText')} tone="bg-blue-100 text-blue-700" />
          <ValueCard icon={Eye} title={t('aboutUs.municipality.vision')} body={t('aboutUs.municipality.visionText')} tone="bg-green-100 text-green-700" />
        </div>

        <HistoryTimeline />
      </div>
    </div>
  );
}
