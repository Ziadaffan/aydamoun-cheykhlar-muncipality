'use client';

import { useTranslation } from 'react-i18next';

export default function SignUpFooter() {
  const { t } = useTranslation();

  return (
    <div className="mt-4 text-center">
      <span className="text-sm text-gray-600">{t('auth.signup.alreadyHaveAccount')} </span>
      <a href="/auth/login" className="text-sm text-blue-600 hover:underline">
        {t('auth.signup.loginLink')}
      </a>
    </div>
  );
}
