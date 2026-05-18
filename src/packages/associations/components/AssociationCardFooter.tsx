'use client';

import Button from '@/packages/common/components/Button';
import { useRouter } from 'next/navigation';
import { useDeleteAssociation } from '../hooks/useDeleteAssociation';

type AssociationCardFooterProps = {
  association: {
    id: string;
  };
};

export default function AssociationCardFooter({ association }: AssociationCardFooterProps) {
  const router = useRouter();
  const { mutate: deleteAssociation, isPending } = useDeleteAssociation();

  const handleDelete = () => {
    if (confirm('هل أنت متأكد من حذف هذه المؤسسة؟')) {
      deleteAssociation(association.id);
    }
  };

  return (
    <div className="mt-auto px-5 pb-5">
      <div className="flex items-center gap-2">
        <Button variant="warning" size="md" className="flex-1" onClick={() => router.push(`/associations/${association.id}/edit`)}>
          تعديل
        </Button>
        <Button variant="danger" size="md" className="flex-1" onClick={handleDelete} loading={isPending}>
          حذف
        </Button>
      </div>
    </div>
  );
}
