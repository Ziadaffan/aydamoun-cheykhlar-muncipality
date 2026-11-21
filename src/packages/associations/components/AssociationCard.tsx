'use client';

import { useTranslation } from 'react-i18next';
import { CalendarDays } from 'lucide-react';
import { useAuth } from '@/packages/common/hooks/useAuth';
import Button from '@/packages/common/components/Button';
import Modal from '@/packages/common/components/Modal';
import StoredImage from '@/packages/common/components/StoredImage';
import { formatDate } from '@/packages/common/utils/date.utils';
import { useLocalized } from '@/lib/localized';
import AssociationCardFooter from './AssociationCardFooter';
import type { AssociationItem } from '../types';

type AssociationCardProps = {
  association: AssociationItem;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

/** An association in the list; "View details" opens everything about it in a modal (no page of its own). */
export default function AssociationCard({ association, open, onOpen, onClose }: AssociationCardProps) {
  const { t, i18n } = useTranslation();
  const { role } = useAuth();
  const loc = useLocalized();
  const name = loc(association.name, association.nameEn);
  const description = loc(association.description, association.descriptionEn);
  const isAdmin = role === 'ADMIN';

  return (
    <article
      id={association.id}
      className="group flex h-full scroll-mt-24 flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <button type="button" onClick={onOpen} className="relative block aspect-[16/10] w-full flex-shrink-0 cursor-pointer overflow-hidden bg-gray-100" tabIndex={-1} aria-hidden="true">
        <StoredImage
          src={association.picaURL}
          alt=""
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </button>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-3 line-clamp-2 text-xl font-bold break-words text-gray-900 transition-colors [overflow-wrap:anywhere] group-hover:text-blue-600">
          {name}
        </h3>
        <p className="mb-4 line-clamp-3 leading-relaxed break-words text-gray-600 [overflow-wrap:anywhere]">{description}</p>

        <div className="flex-1" />

        <div className="space-y-2">
          <Button variant="primary" size="md" onClick={onOpen} className="w-full">
            {t('associations.viewDetails')}
          </Button>
          {isAdmin && <AssociationCardFooter association={association} />}
        </div>
      </div>

      <Modal open={open} onClose={onClose} title={name} size="lg" footer={isAdmin && <AssociationCardFooter association={association} />}>
        <div className="space-y-5">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-100">
            <StoredImage src={association.picaURL} alt={name} sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
          </div>
          {association.createdAt && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CalendarDays className="h-4 w-4" aria-hidden />
              <span>{t('associations.publishedAt', { date: formatDate(association.createdAt, i18n.language) })}</span>
            </div>
          )}
          <p className="text-base leading-8 break-words whitespace-pre-line text-gray-700 [overflow-wrap:anywhere] md:text-lg">{description}</p>
        </div>
      </Modal>
    </article>
  );
}
