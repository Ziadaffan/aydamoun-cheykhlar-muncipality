'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/packages/common/hooks/useAuth';
import Button from '@/packages/common/components/Button';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import useGetAssociations from '../hooks/useGetAssociations';
import AssociationsHeader from './AssociationsHeader';
import AssociationCard from './AssociationCard';
import AssociationsEmptyState from './AssociationsEmptyState';

export default function AssociationsPage() {
  const [associations, setAssociations] = useState<
    {
      id: string;
      name: string;
      description: string;
      picaURL: string;
    }[]
  >([]);
  const router = useRouter();
  const { role } = useAuth();

  const { data, isLoading, error } = useGetAssociations();

  useEffect(() => {
    if (data) {
      setAssociations(data);
    }
  }, [data]);

  if (isLoading) {
    return <Spinner className="min-h-screen" />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50 py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <AssociationsHeader />

          {role === 'ADMIN' && (
            <div className="mb-8 flex justify-center">
              <Button variant="primary" size="lg" onClick={() => router.push('/associations/create')}>
                إضافة مؤسسة جديدة
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {associations.map(association => (
              <AssociationCard key={association.id} association={association} />
            ))}
          </div>

          <AssociationsEmptyState associations={associations} />
        </div>
      </div>
    </div>
  );
}
