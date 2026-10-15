import { TFunction } from 'i18next';
import Link from 'next/link';
import { Briefcase, CarTaxiFront, Users } from 'lucide-react';
import HomeSectionHeader from './HomeSectionHeader';

type HomeQuickLinksProps = {
  t: TFunction<'translation', undefined>;
};

// Same three shortcuts as the app's home screen.
const QUICK_LINKS = [
  { labelKey: 'navigation.main.emplois', icon: Briefcase, href: '/jobs' },
  { labelKey: 'navigation.main.taxiStops', icon: CarTaxiFront, href: '/taxi-stops' },
  { labelKey: 'navigation.main.associations', icon: Users, href: '/associations' },
];

export default function HomeQuickLinks({ t }: HomeQuickLinksProps) {
  return (
    <section className="px-4 pb-4">
      <div className="mx-auto max-w-7xl">
        <HomeSectionHeader title={t('home.quickLinks.title')} />
        <div className="grid grid-cols-3 gap-4 md:gap-6">
          {QUICK_LINKS.map(({ labelKey, icon: Icon, href }) => (
            <Link key={href} href={href} className="group relative block">
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-blue-400 to-green-400 opacity-10 blur-sm"></div>
              <div className="relative flex h-full flex-col items-center gap-3 rounded-2xl border border-white/20 bg-white/80 p-5 text-center shadow-xl backdrop-blur-sm transition-transform group-hover:-translate-y-1 md:p-8">
                <Icon className="h-7 w-7 text-blue-600 md:h-9 md:w-9" aria-hidden />
                <span className="text-sm font-bold text-gray-800 md:text-lg">{t(labelKey)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
