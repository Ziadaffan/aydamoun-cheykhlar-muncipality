'use client';

import { useTranslation } from 'react-i18next';
import Image from 'next/image';

export default function SignUpHeader() {
  const { t } = useTranslation();

  return (
    <>
      <div className="mb-6 flex justify-center">
        <Image src="/assets/images/logo.png" alt="Logo" width={64} height={64} className="h-16 w-16 rounded-full shadow-md" priority />
      </div>
      <h2 className="mb-8 text-center text-xl font-extrabold text-blue-700 md:text-2xl">{t('auth.signup.title')}</h2>
    </>
  );
}
