'use client';

import { useAuth } from '@/packages/common/hooks/useAuth';
import TaxiStopCardFooter from './TaxiStopCardFooter';

type TaxiStopCardProps = {
  taxiStop: {
    id: string;
    name: string;
    fromLocation: string;
    toLocation: string;
    hour: string;
    phone: string;
  };
};

export default function TaxiStopCard({ taxiStop }: TaxiStopCardProps) {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  return (
    <article className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <h3 className="mb-4 text-xl font-bold break-words text-gray-900 [overflow-wrap:anywhere]">{taxiStop.name}</h3>

      <div className="space-y-2 text-sm text-gray-700 md:text-base">
        <p>
          <span className="font-semibold">من:</span> {taxiStop.fromLocation}
        </p>
        <p>
          <span className="font-semibold">إلى:</span> {taxiStop.toLocation}
        </p>
        <p>
          <span className="font-semibold">الساعة:</span> {taxiStop.hour}
        </p>
        <p>
          <span className="font-semibold">رقم الهاتف:</span> {taxiStop.phone}
        </p>
      </div>

      {isAdmin && <TaxiStopCardFooter taxiStop={taxiStop} />}
    </article>
  );
}
