import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function AuthBanner() {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-6 py-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-1 items-center">
              <div className="mr-3 text-blue-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="mr-1 text-lg font-medium text-blue-800">{t('services.authRequired.message')}</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-800 transition-colors duration-200 hover:bg-blue-100"
              >
                {t('services.authRequired.loginButton')}
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700"
              >
                {t('services.authRequired.signupButton')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
