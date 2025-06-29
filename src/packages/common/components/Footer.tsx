import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto bg-gray-800 py-8 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 md:mb-0">
            <h3 className="text-center text-lg font-bold md:text-right">{t('footer.title')}</h3>
          </div>

          <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-6">
            <Link href="/privacy-policy" className="text-gray-300 transition-colors duration-200 hover:text-white">
              {t('footer.privacyPolicy')}
            </Link>
            <Link href="/terms-of-use" className="text-gray-300 transition-colors duration-200 hover:text-white">
              {t('footer.termsOfUse')}
            </Link>

            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 transition-colors duration-200 hover:text-blue-400"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-700 pt-6 text-center">
          <p className="text-sm text-gray-400">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
