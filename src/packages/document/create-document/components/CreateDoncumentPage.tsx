'use client';

import React from 'react';

import CreateDocumentForm from '@/packages/document/create-document/components/CreateDocumentForm';
import CreateDocumentHeader from '@/packages/document/create-document/components/CreateDocumentHeader';

export default function CreateDocumentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50 py-10">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-2xl p-4">
          <CreateDocumentHeader />
          <CreateDocumentForm />
        </div>
      </div>
    </div>
  );
}
