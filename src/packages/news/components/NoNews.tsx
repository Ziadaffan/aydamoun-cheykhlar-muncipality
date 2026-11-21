import { TFunction } from 'i18next';
import { Newspaper } from 'lucide-react';
import EmptyState from '@/packages/common/components/EmptyState';

type NoNewsProps = {
  t: TFunction;
};

export default function NoNews({ t }: NoNewsProps) {
  return <EmptyState icon={Newspaper} title={t('news.page.noNews')} description={t('news.page.noNewsInCategory')} />;
}
