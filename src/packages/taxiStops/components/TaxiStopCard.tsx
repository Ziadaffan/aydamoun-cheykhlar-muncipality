'use client';

import { useTranslation } from 'react-i18next';
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
    <article className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <h3 className="mb-4 text-xl font-bold break-words text-gray-900 [overflow-wrap:anywhere]">{loc(taxiStop.name, taxiStop.nameEn)}</h3>

      <div className="space-y-2 text-sm text-gray-700 md:text-base">
        <p>
          <span className="font-semibold">{t('taxiStops.card.from')}</span> {loc(taxiStop.fromLocation, taxiStop.fromLocationEn)}
        </p>
        <p>
          <span className="font-semibold">{t('taxiStops.card.to')}</span> {loc(taxiStop.toLocation, taxiStop.toLocationEn)}
        </p>
        <p>
          <span className="font-semibold">{t('taxiStops.card.hour')}</span> {taxiStop.hour}
        </p>
        <p>
          <span className="font-semibold">{t('taxiStops.card.phone')}</span> <span dir="ltr">{taxiStop.phone}</span>
        </p>
      </div>

      {isAdmin && <TaxiStopCardFooter taxiStop={taxiStop} />}
    </article>
  );
}
