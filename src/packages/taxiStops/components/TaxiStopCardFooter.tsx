'use client';

import Button from '@/packages/common/components/Button';
import { useRouter } from 'next/navigation';
import { useDeleteTaxiStop } from '../hooks/useDeleteTaxiStop';

type TaxiStopCardFooterProps = {
  taxiStop: {
    id: string;
  };
};

export default function TaxiStopCardFooter({ taxiStop }: TaxiStopCardFooterProps) {
  const router = useRouter();
  const { mutate: deleteTaxiStop, isPending } = useDeleteTaxiStop();

  const handleDelete = () => {
    if (confirm('هل أنت متأكد من حذف موقف التاكسي هذا؟')) {
      deleteTaxiStop(taxiStop.id);
    }
  };

  return (
    <div className="mt-auto px-5 pb-5">
      <div className="flex items-center gap-2">
        <Button variant="warning" size="md" className="flex-1" onClick={() => router.push(`/taxi-stops/${taxiStop.id}/edit`)}>
          تعديل
        </Button>
        <Button variant="danger" size="md" className="flex-1" onClick={handleDelete} loading={isPending}>
          حذف
        </Button>
      </div>
    </div>
  );
}
