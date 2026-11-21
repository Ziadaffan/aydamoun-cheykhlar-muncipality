'use client';

import { useTranslation } from 'react-i18next';
import Button from '@/packages/common/components/Button';
import { useRouter } from 'next/navigation';
import { useDeleteTaxiStop } from '../hooks/useDeleteTaxiStop';

type TaxiStopCardFooterProps = {
  taxiStop: {
    id: string;
  };
};

export default function TaxiStopCardFooter({ taxiStop }: TaxiStopCardFooterProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate: deleteTaxiStop, isPending } = useDeleteTaxiStop();

  const handleDelete = () => {
    if (confirm(t('taxiStops.actions.confirmDelete'))) {
      deleteTaxiStop(taxiStop.id);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <Button variant="warning" size="md" className="flex-1" onClick={() => router.push(`/taxi-stops/${taxiStop.id}/edit`)}>
          {t('taxiStops.actions.edit')}
        </Button>
        <Button variant="danger" size="md" className="flex-1" onClick={handleDelete} loading={isPending}>
          {t('taxiStops.actions.delete')}
        </Button>
      </div>
    </div>
  );
}
