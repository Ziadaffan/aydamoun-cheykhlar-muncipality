'use client';

import { useParams } from 'next/navigation';
import { CldImage } from 'next-cloudinary';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import { BackButton } from '@/packages/common/components/BackButton';
import useGetAssociationById from '@/packages/associations/hooks/useGetAssociationById';
import { formatDate } from '@/packages/common/utils/date.utils';
import { useMemo, useState } from 'react';

export default function AssociationPage() {
  const params = useParams();
  const id = params?.id as string;
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: association, isLoading, error } = useGetAssociationById(id);

  const shouldCollapseDescription = useMemo(() => {
    if (!association?.description) {
      return false;
    }

    return association.description.length > 700;
  }, [association?.description]);

  if (isLoading) {
    return <Spinner className="min-h-screen" />;
  }

  if (error || !association) {
    return <ErrorMessage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50 py-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white shadow-lg">
          <div className="relative h-64 w-full bg-gray-100 sm:h-80 lg:h-[430px]">
            <CldImage src={association.picaURL} alt={association.name} fill className="object-cover" />
          </div>

          <div className="p-6 md:p-8">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{association.name}</h1>

            <div className="mb-6 flex items-center gap-3 text-sm text-gray-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>تم النشر: {formatDate(association.createdAt)}</span>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <div className="relative">
                <p
                  className={`text-base leading-8 break-words whitespace-pre-line text-gray-700 [overflow-wrap:anywhere] md:text-lg ${
                    shouldCollapseDescription && !isExpanded ? 'line-clamp-8' : ''
                  }`}
                >
                  {association.description}
                </p>

                {shouldCollapseDescription && !isExpanded && (
                  <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-14 bg-gradient-to-t from-gray-50 to-transparent"></div>
                )}
              </div>

              {shouldCollapseDescription && (
                <button
                  type="button"
                  className="mt-3 cursor-pointer text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800"
                  onClick={() => setIsExpanded(prev => !prev)}
                >
                  {isExpanded ? 'عرض أقل' : 'عرض المزيد'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
