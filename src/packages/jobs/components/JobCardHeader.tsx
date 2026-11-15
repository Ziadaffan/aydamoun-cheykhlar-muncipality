import Link from 'next/link';
import { Jobs } from '@prisma/client';
import { useTranslation } from 'react-i18next';
import { useLocalized } from '@/lib/localized';

interface JobCardHeaderProps {
  job: Jobs;
  /** 'h1' on the job's own page: the title is the page heading there, not a link. */
  as?: 'h1' | 'h3';
}

export default function JobCardHeader({ job, as = 'h3' }: JobCardHeaderProps) {
  const { t } = useTranslation();
  const loc = useLocalized();
  const title = loc(job.title, job.titleEn);

  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {as === 'h1' ? (
            <h1 className="text-2xl leading-9 font-bold text-gray-900">{title}</h1>
          ) : (
            <h3 className="line-clamp-1 text-lg leading-6 font-medium text-gray-900">
              <Link href={`/jobs/${job.id}`} className="hover:text-blue-700 hover:underline">
                {title}
              </Link>
            </h3>
          )}
        </div>
        {!job.active && (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            {t('jobs.inactive')}
          </span>
        )}
      </div>
    </div>
  );
}
