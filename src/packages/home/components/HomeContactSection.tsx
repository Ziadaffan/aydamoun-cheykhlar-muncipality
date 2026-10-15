'use client';

import MapCard from '@/packages/common/components/MapCard';

interface ContactInfo {
  id: number;
  icon: string;
  titleKey: string;
  valueKey: string;
  /** Link for the value. Linked values (phone, email) are shown left-to-right so they keep their order in RTL. */
  href?: (value: string) => string;
}

const contactInfo: ContactInfo[] = [
  {
    id: 1,
    icon: '🕒',
    titleKey: 'home.contact.info.timing.title',
    valueKey: 'home.contact.info.timing.value',
  },
  {
    id: 2,
    icon: '📞',
    titleKey: 'home.contact.info.phone.title',
    valueKey: 'home.contact.info.phone.value',
    href: value => `tel:${value.replace(/[^\d+]/g, '')}`,
  },
  {
    id: 3,
    icon: '✉️',
    titleKey: 'home.contact.info.email.title',
    valueKey: 'home.contact.info.email.value',
    href: value => `mailto:${value}`,
  },
];

interface HomeContactSectionProps {
  t: (key: string) => string;
}

export default function HomeContactSection({ t }: HomeContactSectionProps) {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="relative container mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-gray-800 md:text-5xl lg:text-6xl">{t('home.contact.title')}</h2>
            <div className="mx-auto h-1.5 w-32 rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              {contactInfo.map(info => (
                <div key={info.id} className="relative">
                  <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-blue-400 to-green-400 opacity-10 blur-sm"></div>
                  <div className="relative rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{info.icon}</div>
                      <div className="flex-1">
                        <h3 className="mb-2 text-lg font-semibold text-gray-800">{t(info.titleKey)}</h3>
                        <p className="leading-relaxed text-gray-700">
                          {info.href ? (
                            <a href={info.href(t(info.valueKey))} dir="ltr" className="text-blue-700 hover:underline">
                              {t(info.valueKey)}
                            </a>
                          ) : (
                            t(info.valueKey)
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-blue-400 to-green-400 opacity-10 blur-sm"></div>
              <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/80 shadow-xl backdrop-blur-sm">
                <div className="absolute -top-3 left-6 z-10 h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
                <MapCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
