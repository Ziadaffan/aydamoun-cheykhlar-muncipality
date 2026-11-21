'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ServiceType } from '@prisma/client';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import { useAuth } from '@/packages/common/hooks/useAuth';
import { dateLocale } from '@/packages/common/utils/date.utils';
import { getServiceCategoryMeta } from '@/packages/services/utils/service.utils';
import { useGetUserSubmissions } from '@/packages/serviceSubmissions/hooks/useGetUserSubmissions';
import { useDeleteServiceSubmission } from '@/packages/serviceSubmissions/hooks/useDeleteServiceSubmission';
import MySubmissionCard, { STATUS_LABEL_KEYS } from './MySubmissionCard';
import EmptyState from '@/packages/common/components/EmptyState';
import { Inbox, SearchX } from 'lucide-react';
import {
  ALL_CATEGORIES,
  CATEGORY_ORDER,
  MySubmission,
  SORTERS,
  SORT_KEYS,
  STATUSES,
  SortKey,
  StatusFilter,
  matchesQuery,
  submissionCategory,
} from '../utils/filterSubmissions';

const fieldClass =
  'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-start text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none';

/**
 * "My requests", like the app's submissions screen: every request the user has sent, with search
 * (service, number, description), status chips with counts, a category filter and sorting.
 */
export default function MySubmissionsPage() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data, isLoading, error } = useGetUserSubmissions();
  const { mutate: deleteSubmission } = useDeleteServiceSubmission();

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const [category, setCategory] = useState<string>(ALL_CATEGORIES);
  const [sort, setSort] = useState<SortKey>('newest');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const numberFormat = useMemo(() => new Intl.NumberFormat(dateLocale(i18n.language)), [i18n.language]);
  const n = (value: number) => numberFormat.format(value);

  const all = useMemo<MySubmission[]>(() => (Array.isArray(data) ? data : []), [data]);

  // Search and category first; the status chips count what is left.
  const { narrowed, counts, categories } = useMemo(() => {
    const narrowed = all.filter(s => (category === ALL_CATEGORIES || submissionCategory(s) === category) && matchesQuery(s, query));
    const counts: Record<StatusFilter, number> = { ALL: narrowed.length, PENDING: 0, IN_PROGRESS: 0, COMPLETED: 0, REJECTED: 0 };
    for (const s of narrowed) counts[s.status] += 1;
    const present = new Set(all.map(submissionCategory));
    const categories = CATEGORY_ORDER.filter(type => present.has(type));
    return { narrowed, counts, categories };
  }, [all, query, category]);

  const visible = useMemo(
    () => narrowed.filter(s => status === 'ALL' || s.status === status).sort(SORTERS[sort]),
    [narrowed, status, sort]
  );

  const filtering = query.trim() !== '' || status !== 'ALL' || category !== ALL_CATEGORIES;

  const clearFilters = () => {
    setQuery('');
    setStatus('ALL');
    setCategory(ALL_CATEGORIES);
  };

  const handleDelete = (submissionId: string) => {
    if (!confirm(t('profile.submissions.deleteConfirmation'))) return;
    setDeletingId(submissionId);
    deleteSubmission(submissionId, { onSettled: () => setDeletingId(null) });
  };

  const categoryLabel = (type: ServiceType) => t(`services.${getServiceCategoryMeta(type).categoryKey}.title`);

  if (authLoading || (isAuthenticated && isLoading)) {
    return <Spinner className="min-h-screen" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const newRequestLink = (
    <Link
      href="/services"
      className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-bold text-white shadow transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
    >
      {t('profile.submissions.newRequest')}
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('profile.submissions.title')}</h1>
            <p className="mt-2 text-gray-600">{t('profile.submissions.subtitle')}</p>
          </div>
          {all.length > 0 && newRequestLink}
        </header>

        {error ? (
          <ErrorMessage />
        ) : all.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={t('profile.submissions.noSubmissions')}
            description={t('profile.submissions.emptyBody')}
            action={newRequestLink}
          />
        ) : (
          <>
            <section className="mb-6 space-y-4 rounded-lg bg-white p-4 shadow sm:p-6" aria-label={t('profile.submissions.searchLabel')}>
              <div>
                <label htmlFor="mySubmissionsSearch" className="mb-1 block text-sm font-medium text-gray-700">
                  {t('profile.submissions.searchLabel')}
                </label>
                <input
                  id="mySubmissionsSearch"
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={t('profile.submissions.searchPlaceholder')}
                  className={fieldClass}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              <fieldset>
                <legend className="mb-2 text-sm font-medium text-gray-700">{t('profile.submissions.filters.status')}</legend>
                <div className="flex flex-wrap gap-2">
                  {(['ALL', ...STATUSES] as StatusFilter[]).map(key => {
                    const selected = status === key;
                    const label = key === 'ALL' ? t('profile.submissions.filters.all') : t(STATUS_LABEL_KEYS[key]);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setStatus(key)}
                        aria-pressed={selected}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                          selected ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{label}</span>
                        <span className={`rounded-full px-1.5 text-xs ${selected ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-600'}`}>
                          {n(counts[key])}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="grid gap-4 sm:grid-cols-2">
                {categories.length > 1 && (
                  <div>
                    <label htmlFor="mySubmissionsCategory" className="mb-1 block text-sm font-medium text-gray-700">
                      {t('profile.submissions.filters.category')}
                    </label>
                    <select id="mySubmissionsCategory" value={category} onChange={e => setCategory(e.target.value)} className={fieldClass}>
                      <option value={ALL_CATEGORIES}>{t('profile.submissions.filters.allCategories')}</option>
                      {categories.map(type => (
                        <option key={type} value={type}>
                          {categoryLabel(type)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label htmlFor="mySubmissionsSort" className="mb-1 block text-sm font-medium text-gray-700">
                    {t('profile.submissions.sort.label')}
                  </label>
                  <select id="mySubmissionsSort" value={sort} onChange={e => setSort(e.target.value as SortKey)} className={fieldClass}>
                    {SORT_KEYS.map(key => (
                      <option key={key} value={key}>
                        {t(`profile.submissions.sort.${key}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
                <p className="text-sm text-gray-600" role="status" aria-live="polite">
                  {filtering
                    ? t('profile.submissions.showing', { shown: n(visible.length), total: n(all.length) })
                    : t('profile.submissions.totalCount', { total: n(all.length) })}
                </p>
                {filtering && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="cursor-pointer text-sm font-medium text-blue-700 hover:underline focus:underline focus:outline-none"
                  >
                    {t('profile.submissions.clearFilters')}
                  </button>
                )}
              </div>
            </section>

            {visible.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title={t('profile.submissions.noMatch')}
                action={
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="cursor-pointer rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {t('profile.submissions.clearFilters')}
                  </button>
                }
              />
            ) : (
              <>
                {counts.PENDING > 0 && <p className="mb-3 text-xs text-gray-500">{t('profile.submissions.editHint')}</p>}
                <ul className="space-y-4">
                  {visible.map(submission => (
                    <li key={submission.id}>
                      <MySubmissionCard submission={submission} isDeleting={deletingId === submission.id} onDelete={handleDelete} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
