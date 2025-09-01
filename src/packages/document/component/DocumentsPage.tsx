'use client';

import { useEffect, useState } from 'react';
import { useGetDocuments } from '../hooks/useGetDocuments';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import Spinner from '@/packages/common/components/Spinner';
import { Document } from '@prisma/client';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/packages/common/hooks/useAuth';
import DocumentsHeader from '@/packages/document/component/DocumentsHeader';
import DocumentsGrid from '@/packages/document/component/DocumentsGrid';
import DocumentsEmptyState from './DocumentsEmptyState';

export default function DocumentsPage() {
  const { t } = useTranslation();

  const [documents, setDocuments] = useState<Document[] | null>(null);

  const { data: documentsData, isLoading, error } = useGetDocuments();
  const { role } = useAuth();

  useEffect(() => {
    if (documentsData) {
      setDocuments(documentsData);
    }
  }, [documentsData]);

  if (isLoading) {
    return <Spinner className="min-h-screen" />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50 py-20">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <DocumentsHeader t={t} role={role} />

          {/* Documents Grid */}
          {documents && documents.length > 0 ? <DocumentsGrid documents={documents} t={t} role={role} /> : <DocumentsEmptyState t={t} />}
        </div>
      </div>
    </div>
  );
}
