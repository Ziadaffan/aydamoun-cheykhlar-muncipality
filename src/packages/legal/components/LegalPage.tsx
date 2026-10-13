'use client';

import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { BackButton } from '@/packages/common/components/BackButton';

type LegalSection = {
  heading: string;
  body: string[];
};

type LegalPageProps = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
  footer?: ReactNode;
};

/** Shared shell for the privacy policy and terms of use. */
export default function LegalPage({ title, lastUpdated, intro, sections, footer }: LegalPageProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton />
        </div>

        <article className="rounded-lg bg-white p-6 shadow sm:p-10">
          <h1 className="mb-2 text-3xl font-extrabold text-gray-900">{title}</h1>
          <p className="mb-8 text-sm text-gray-500">
            {t('legal.lastUpdated')} {lastUpdated}
          </p>

          <p className="mb-8 leading-relaxed text-gray-700">{intro}</p>

          <div className="space-y-8">
            {sections.map(section => (
              <section key={section.heading}>
                <h2 className="mb-3 border-b pb-2 text-xl font-bold text-gray-800">{section.heading}</h2>
                {/* t(..., { returnObjects: true }) hands back the key as a string if the
                    namespace isn't loaded yet, so don't assume we got an array. */}
                {(Array.isArray(section.body) ? section.body : []).map((paragraph, index) => (
                  <p key={index} className="mb-3 leading-relaxed text-gray-700">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          {footer}
        </article>
      </div>
    </div>
  );
}
