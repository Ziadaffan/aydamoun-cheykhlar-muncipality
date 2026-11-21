'use client';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/packages/common/hooks/useAuth';
import { useHashModal } from '@/packages/common/hooks/useHashModal';
import Button from '@/packages/common/components/Button';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import useGetAssociations from '../hooks/useGetAssociations';
import AssociationsHeader from './AssociationsHeader';
import AssociationCard from './AssociationCard';
import AssociationsEmptyState from './AssociationsEmptyState';

export default function AssociationsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { role } = useAuth();

  const { data, isLoading, error } = useGetAssociations();
  const associations = data ?? [];
  // /associations#<id> (shared links, old /associations/<id> links) opens that association.
  const { openId, open, close } = useHashModal(data);

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
          <AssociationsHeader />

          {role === 'ADMIN' && (
            <div className="mb-8 flex justify-center">
              <Button variant="primary" size="lg" onClick={() => router.push('/associations/create')}>
                {t('associations.add')}
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {associations.map(association => (
              <AssociationCard
                key={association.id}
                association={association}
                open={openId === association.id}
                onOpen={() => open(association.id)}
                onClose={close}
              />
            ))}
          </div>

          <AssociationsEmptyState associations={associations} />
        </div>
      </div>
    </div>
  );
}
