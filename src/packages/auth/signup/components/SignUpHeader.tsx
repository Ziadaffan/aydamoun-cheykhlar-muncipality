'use client';

import { useTranslation } from 'react-i18next';
import { CldImage } from 'next-cloudinary';

export default function SignUpHeader() {
  const { t } = useTranslation();

  return (
    <>
      <div className="mb-6 flex justify-center">
        <CldImage src="logo_smzpb2" alt="Municipality Logo" width={80} height={80} className="object-contain" priority />
      </div>
      <h2 className="mb-8 text-center text-xl font-extrabold text-blue-700 md:text-2xl">{t('auth.signup.title')}</h2>
    </>
  );
}
