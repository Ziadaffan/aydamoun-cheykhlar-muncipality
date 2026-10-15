'use client';

import { TFunction } from 'i18next';
import Link from 'next/link';
import { ChevronLeft, ClipboardList } from 'lucide-react';
import { ServiceSubmission } from '@prisma/client';
import { useGetUserSubmissions } from '@/packages/serviceSubmissions/hooks/useGetUserSubmissions';
import HomeSectionHeader from './HomeSectionHeader';

type Submission = ServiceSubmission & { service?: { name: string } };

type HomeLatestRequestProps = {
  t: TFunction<'translation', undefined>;
};

// Same colours and wording as the profile page's SubmissionCard.
const STATUS: Record<string, { key: string; className: string }> = {
  PENDING: { key: 'profile.submissions.status.pending', className: 'bg-yellow-100 text-yellow-800' },
  IN_PROGRESS: { key: 'profile.submissions.status.inProgress', className: 'bg-blue-100 text-blue-800' },
  COMPLETED: { key: 'profile.submissions.status.completed', className: 'bg-green-100 text-green-800' },
  REJECTED: { key: 'profile.submissions.status.rejected', className: 'bg-red-100 text-red-800' },
};

/** The signed-in resident's request whose status changed last, like the app's home screen. Mount only when signed in. */
export default function HomeLatestRequest({ t }: HomeLatestRequestProps) {
  const { data } = useGetUserSubmissions();
  const submissions = (data ?? []) as Submission[];
  if (!submissions.length) return null;

  const latest = submissions.reduce((a, b) => (new Date(b.updatedAt) > new Date(a.updatedAt) ? b : a));
  const status = STATUS[latest.status] ?? STATUS.REJECTED;

  return (
    <section className="px-4 pt-16">
      <div className="mx-auto max-w-7xl">
        <HomeSectionHeader
          title={t('profile.submissions.title')}
          action={{ label: t('home.viewAll'), href: '/profile', ariaLabel: t('home.requests.viewAllLabel') }}
        />
        <Link
          href="/profile"
          className="flex items-center gap-4 rounded-2xl border border-white/20 bg-white/80 p-5 shadow-xl backdrop-blur-sm transition-transform hover:-translate-y-1"
        >
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50">
            <ClipboardList className="h-6 w-6 text-blue-600" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-500">{t('home.requests.latest')}</p>
            <h3 className="line-clamp-2 font-bold text-gray-900">
              {latest.service?.name || t('profile.submissions.unknownService')}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
                {t(status.key)}
              </span>
              <span className="text-sm text-gray-500">
                {t('home.requests.updatedOn', { date: new Date(latest.updatedAt).toLocaleDateString('ar-LB') })}
              </span>
            </div>
          </div>
          <ChevronLeft className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
