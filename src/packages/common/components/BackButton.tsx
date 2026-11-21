'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { hasInAppHistory } from '@/packages/common/hooks/useInAppHistory';

type BackButtonProps = {
  /** Where to go when the page was opened directly (shared link, new tab): the section's list, else home. */
  fallbackHref?: string;
  /** Visible text; "Back" by default. */
  label?: string;
};

/**
 * Goes back to where the visitor came from when that is a page of this site,
 * otherwise to `fallbackHref`. The arrow points to the reading start (left in LTR, right in RTL).
 */
export const BackButton = ({ fallbackHref = '/', label }: BackButtonProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const goBack = () => {
    if (hasInAppHistory()) router.back();
    else router.push(fallbackHref);
  };

  return (
    <button
      type="button"
      onClick={goBack}
      className="flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2 text-gray-700 shadow-md transition-all hover:bg-gray-50 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
    >
      <svg className="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span>{label ?? t('common.back')}</span>
    </button>
  );
};
