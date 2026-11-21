'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

/** The profile shows account info only; requests live on their own page. */
export default function MySubmissionsLinkCard() {
  const { t } = useTranslation();

  return (
    <Link
      href="/submissions"
      className="group mt-8 flex items-center justify-between gap-4 rounded-lg bg-white px-6 py-5 shadow transition hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      <div className="flex items-center gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700" aria-hidden="true">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </span>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t('profile.submissions.title')}</h2>
          <p className="text-sm text-gray-600">{t('profile.submissions.profileLink.description')}</p>
        </div>
      </div>
      <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-blue-700 group-hover:underline">
        {t('profile.submissions.profileLink.cta')}
        <svg className="h-4 w-4 rtl:-scale-x-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}
