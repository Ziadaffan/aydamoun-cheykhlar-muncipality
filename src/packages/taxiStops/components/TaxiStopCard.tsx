'use client';

import { useTranslation } from 'react-i18next';
import { CarTaxiFront, Clock, MapPin, Phone } from 'lucide-react';
import { useAuth } from '@/packages/common/hooks/useAuth';
import TaxiStopCardFooter from './TaxiStopCardFooter';
import { useLocalized } from '@/lib/localized';

type TaxiStopCardProps = {
  taxiStop: {
    id: string;
    name: string;
    fromLocation: string;
    toLocation: string;
    hour: string;
    phone: string;
    nameEn?: string | null;
    fromLocationEn?: string | null;
    toLocationEn?: string | null;
  };
};

export default function TaxiStopCard({ taxiStop }: TaxiStopCardProps) {
  const { t } = useTranslation();
  const { role } = useAuth();
  const loc = useLocalized();
  const isAdmin = role === 'ADMIN';

  return (
    <article
      id={taxiStop.id}
      className="group flex h-full scroll-mt-24 flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Fixed band, the same height on every taxi-stop card. */}
      <div className="flex h-28 flex-shrink-0 items-center justify-center bg-amber-100 text-amber-700" aria-hidden="true">
        <CarTaxiFront className="h-12 w-12 opacity-80" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-4 line-clamp-2 text-xl font-bold break-words text-gray-900 [overflow-wrap:anywhere]">{loc(taxiStop.name, taxiStop.nameEn)}</h3>

        <ul className="mb-4 space-y-2 text-sm text-gray-700 md:text-base">
          <li className="flex items-start gap-2">
            <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden />
            <span className="line-clamp-2">
              <span className="font-semibold">{t('taxiStops.card.from')}</span> {loc(taxiStop.fromLocation, taxiStop.fromLocationEn)}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden />
            <span className="line-clamp-2">
              <span className="font-semibold">{t('taxiStops.card.to')}</span> {loc(taxiStop.toLocation, taxiStop.toLocationEn)}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Clock className="mt-1 h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden />
            <span>
              <span className="font-semibold">{t('taxiStops.card.hour')}</span> {taxiStop.hour}
            </span>
          </li>
        </ul>

        <div className="mt-auto space-y-2">
          {taxiStop.phone && (
            <a
              href={`tel:${taxiStop.phone.replace(/[^\d+]/g, '')}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-bold text-white shadow transition hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
            >
              <Phone className="h-4 w-4" aria-hidden />
              <span className="sr-only">{t('taxiStops.card.phone')}</span>
              <span dir="ltr">{taxiStop.phone}</span>
            </a>
          )}
          {isAdmin && <TaxiStopCardFooter taxiStop={taxiStop} />}
        </div>
      </div>
    </article>
  );
}
