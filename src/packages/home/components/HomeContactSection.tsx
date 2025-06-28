'use client';

import MapCard from '@/packages/common/components/MapCard';

interface ContactInfo {
  id: number;
  icon: string;
  titleKey: string;
  valueKey: string;
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
  },
  {
    id: 3,
    icon: '✉️',
    titleKey: 'home.contact.info.email.title',
    valueKey: 'home.contact.info.email.value',
  },
];

interface HomeContactSectionProps {
  t: (key: string) => string;
}

export default function HomeContactSection({ t }: HomeContactSectionProps) {
  return (
    <div className="bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
            {t('home.contact.title')}
          </h2>
          <p className="text-xl text-gray-600">{t('home.contact.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            {contactInfo.map(info => (
              <div key={info.id} className="flex items-start space-x-4 rounded-lg bg-gray-100 p-6">
                <div className="text-3xl">{info.icon}</div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">{t(info.titleKey)}</h3>
                  <p className="leading-relaxed text-gray-600">{t(info.valueKey)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-lg bg-gray-200 shadow-lg">
            <MapCard />
          </div>
        </div>
      </div>
    </div>
  );
}
