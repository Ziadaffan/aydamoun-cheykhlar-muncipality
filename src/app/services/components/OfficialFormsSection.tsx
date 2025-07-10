import { TFunction } from 'i18next';
import React from 'react';

type OfficialFormsSectionProps = {
  t: TFunction<'translation', undefined>;
};

export default function OfficialFormsSection({ t }: OfficialFormsSectionProps) {
  const forms = t('services.officialForms.forms', { returnObjects: true }) as Array<{
    id: number;
    title: string;
    downloadText: string;
  }>;

  return (
    <section className="bg-gradient-to-r from-gray-50 to-blue-50 py-16">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 text-6xl">📄</div>
            <h2 className="text-3xl font-bold text-gray-800 md:text-4xl">{t('services.officialForms.title')}</h2>
            <p className="mt-4 text-lg text-gray-600">قم بتحميل النماذج الرسمية المطلوبة للخدمات البلدية</p>
          </div>

          {/* Forms Grid */}
          <div className="flex flex-wrap justify-center gap-6">
            {forms.map(form => (
              <div key={form.id} className="group relative h-55 w-100">
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-blue-400 to-blue-600 opacity-10 blur-sm"></div>
                <div className="relative flex h-full flex-col rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-600">#{form.id}</div>
                    <div className="text-4xl">📄</div>
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-gray-800">{form.title}</h3>

                  <div className="mt-6">
                    <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 px-4 py-2 font-semibold text-white hover:opacity-80">
                      <span>⬇️</span>
                      <span>{form.downloadText}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
