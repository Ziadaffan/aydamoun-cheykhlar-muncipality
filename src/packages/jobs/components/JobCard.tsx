'use client';

import { Jobs } from '@prisma/client';
import { useTranslation } from 'react-i18next';
import { Briefcase, Building2, CalendarClock, MapPin, Phone } from 'lucide-react';
import Button from '@/packages/common/components/Button';
import Modal from '@/packages/common/components/Modal';
import JobCardDetails from '@/packages/jobs/components/JobCardDetails';
import JobCardFooter from '@/packages/jobs/components/JobCardFooter';
import { isDeadlinePassed, useJobDate } from '@/packages/jobs/utils/jobs.utils';
import { useAuth } from '@/packages/common/hooks/useAuth';
import { useLocalized } from '@/lib/localized';

export interface JobCardProps {
  job: Jobs;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

/** A job in the list; "View details" opens everything about it in a modal (jobs have no page of their own). */
export default function JobCard({ job, open, onOpen, onClose }: JobCardProps) {
  const { t } = useTranslation();
  const { role } = useAuth();
  const loc = useLocalized();
  const formatDate = useJobDate();
  const isAdmin = role === 'ADMIN';
  const title = loc(job.title, job.titleEn);
  const description = job.description ? loc(job.description, job.descriptionEn) : null;
  const deadlinePassed = isDeadlinePassed(job.deadline);

  return (
    <article
      id={job.id}
      className="group flex h-full scroll-mt-24 flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Fixed header band, the same height on every job card. */}
      <div className="relative flex h-28 flex-shrink-0 items-center justify-center bg-blue-100 text-blue-700" aria-hidden="true">
        <Briefcase className="h-12 w-12 opacity-80" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-xl font-bold break-words text-gray-900 transition-colors [overflow-wrap:anywhere] group-hover:text-blue-600">
            {title}
          </h3>
          {!job.active && (
            <span className="inline-flex flex-shrink-0 items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
              {t('jobs.inactive')}
            </span>
          )}
        </div>

        <ul className="mb-4 space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <Building2 className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden />
            <span className="sr-only">{t('jobs.provider')}:</span>
            <span className="line-clamp-1">{loc(job.provider, job.providerEn)}</span>
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden />
            <span className="sr-only">{t('jobs.location')}:</span>
            <span className="line-clamp-1">{loc(job.location, job.locationEn)}</span>
          </li>
          {job.deadline && (
            <li className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden />
              <span>{t('jobs.deadline')}:</span>
              <span className={`line-clamp-1 ${deadlinePassed ? 'font-medium text-red-600' : ''}`}>{formatDate(job.deadline)}</span>
            </li>
          )}
        </ul>

        {description && <p className="mb-4 line-clamp-3 leading-relaxed break-words text-gray-600 [overflow-wrap:anywhere]">{description}</p>}

        <div className="flex-1" />

        <div className="space-y-2">
          <Button variant="primary" size="md" onClick={onOpen} className="w-full">
            {t('jobs.viewDetails')}
          </Button>
          {isAdmin && <JobCardFooter job={job} />}
        </div>
      </div>

      <Modal
        open={open}
        onClose={onClose}
        title={title}
        size="lg"
        footer={
          (job.phone || isAdmin) && (
            <div className="flex flex-col gap-2 sm:flex-row">
              {job.phone && (
                <a
                  href={`tel:${job.phone.replace(/[^\d+]/g, '')}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-bold text-white shadow transition hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  {t('jobs.call')} <span dir="ltr">{job.phone}</span>
                </a>
              )}
              {isAdmin && (
                <div className="flex-1">
                  <JobCardFooter job={job} />
                </div>
              )}
            </div>
          )
        }
      >
        <div className="space-y-6">
          {!job.active && (
            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">{t('jobs.inactive')}</span>
          )}
          <JobCardDetails job={job} showDescription={false} />
          {description && (
            <section>
              <h3 className="mb-2 text-base font-semibold text-gray-900">{t('jobs.aboutRole')}</h3>
              <p className="leading-8 break-words whitespace-pre-line text-gray-700 [overflow-wrap:anywhere]">{description}</p>
            </section>
          )}
        </div>
      </Modal>
    </article>
  );
}
