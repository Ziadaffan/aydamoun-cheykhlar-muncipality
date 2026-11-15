import { useTranslation } from 'react-i18next';
import { formatDate } from '@/packages/common/utils/date.utils';

/** Formats a date and time in the site's language (Arabic unless the visitor chose English). */
export function useJobDate() {
  const { i18n } = useTranslation();
  return (date: Date | string) => formatDate(date, i18n.language);
}

export const isDeadlinePassed = (deadline: Date | null) => {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
};
