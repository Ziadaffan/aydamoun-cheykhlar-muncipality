import { TFunction } from 'i18next';
import React from 'react';
import { useRouter } from 'next/navigation';

type HomeHeaderSectionProps = {
  t: TFunction<'translation', undefined>;
};

export default function HomeHeaderSection({ t }: HomeHeaderSectionProps) {
  const router = useRouter();

  return (
    <div
      className="relative flex h-[500px] w-full items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("/assets/images/bg-2.jpg")',
      }}
    >
      <div className="relative z-10 px-4 text-center text-white">
        <h1 style={{ fontFamily: 'var(--font-baloo-bhaijaan-2), serif' }} className="mb-6 text-4xl leading-tight font-bold md:text-6xl">
          {t('home.hero.title')}
        </h1>
        <p className="mb-8 text-xl text-gray-100 md:text-2xl">{t('home.hero.subtitle')}</p>
        <button
          onClick={() => router.push('/services')}
          className="transform cursor-pointer rounded-lg bg-blue-400 px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-blue-500"
        >
          {t('home.hero.ctaButton')}
        </button>
      </div>
    </div>
  );
}
