import Link from 'next/link';
import { TFunction } from 'i18next';

type TopNavigationProps = {
  t: TFunction<'translation', undefined>;
};

export default function TopNavigation({ t }: TopNavigationProps) {
  return (
    <nav className="bg-gradient-to-r from-blue-200 to-blue-300 py-2">
      <div className="mx-auto flex max-w-7xl justify-center px-4">
        <div className="flex items-center justify-end space-x-6">
          <Link href="/accessibilite" className="text-sm text-gray-600 hover:text-blue-800">
            {t('navigation.top.transactionInquiry')}
          </Link>
          <Link href="/mentions-legales" className="text-sm text-gray-600 hover:text-blue-800">
            {t('navigation.top.complaintInquiry')}
          </Link>
          <Link href="/plan-du-site" className="text-sm text-gray-600 hover:text-blue-800">
            {t('navigation.top.searchForDecisions')}
          </Link>
        </div>
      </div>
    </nav>
  );
}
