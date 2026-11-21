'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/packages/common/hooks/useAuth';
import Button from '@/packages/common/components/Button';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import useGetTaxiStops from '../hooks/useGetTaxiStops';
import TaxiStopsHeader from './TaxiStopsHeader';
import TaxiStopCard from './TaxiStopCard';
import TaxiStopsEmptyState from './TaxiStopsEmptyState';

type TaxiStopItem = {
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

export default function TaxiStopsPage() {
  const { t } = useTranslation();
  const [taxiStops, setTaxiStops] = useState<TaxiStopItem[]>([]);
  const router = useRouter();
  const { role } = useAuth();

  const { data, isLoading, error } = useGetTaxiStops();

  useEffect(() => {
    if (data) {
      setTaxiStops(data);
    }
  }, [data]);

  if (isLoading) {
    return <Spinner className="min-h-screen" />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-mist to-sand py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <TaxiStopsHeader />

          {role === 'ADMIN' && (
            <div className="mb-8 flex justify-center">
              <Button variant="primary" size="lg" onClick={() => router.push('/taxi-stops/create')}>
                {t('taxiStops.add')}
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {taxiStops.map(taxiStop => (
              <TaxiStopCard key={taxiStop.id} taxiStop={taxiStop} />
            ))}
          </div>

          <TaxiStopsEmptyState taxiStops={taxiStops} />
        </div>
      </div>
    </div>
  );
}
