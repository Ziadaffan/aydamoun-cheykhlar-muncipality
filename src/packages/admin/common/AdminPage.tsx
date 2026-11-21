'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import { BackButton } from '@/packages/common/components/BackButton';
import { useAuth } from '@/packages/common/hooks/useAuth';

type AdminPageProps = {
  title: string;
  description?: string;
  /** e.g. the "add" button of a list page. */
  action?: { label: string; href: string };
  showBack?: boolean;
  /** Width of the content: lists are wide, forms narrow. */
  width?: 'wide' | 'narrow';
  isLoading?: boolean;
  error?: unknown;
  children: ReactNode;
};

/** Frame of the admin pages: admin check (the middleware already blocks others), header, loading and error states. */
export default function AdminPage({ title, description, action, showBack = false, width = 'wide', isLoading, error, children }: AdminPageProps) {
  const { t } = useTranslation();
  const { role, isLoading: authLoading } = useAuth();
  // Opened directly, "back" leads to the section's list: /admin/<section>/<id>/edit → /admin/<section>.
  const sectionHref = (usePathname() ?? '/admin').split('/').slice(0, 3).join('/');

  if (authLoading || isLoading) return <Spinner className="min-h-screen" />;
  if (role !== 'ADMIN') return <ErrorMessage message={t('admin.serviceSubmissions.unauthorized')} />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className={`mx-auto px-4 sm:px-6 ${width === 'wide' ? 'max-w-7xl' : 'max-w-4xl'}`}>
        {showBack && (
          <div className="mb-6">
            <BackButton fallbackHref={sectionHref} />
          </div>
        )}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {description && <p className="mt-2 text-gray-600">{description}</p>}
          </div>
          {action && (
            <Link
              href={action.href}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 font-bold text-white shadow transition hover:bg-blue-700"
            >
              {action.label}
            </Link>
          )}
        </div>
        {error ? <ErrorMessage /> : children}
      </div>
    </div>
  );
}
