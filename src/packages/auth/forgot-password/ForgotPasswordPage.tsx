'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { CldImage } from 'next-cloudinary';
import ControlledInputText from '@/packages/common/components/form/ControlledInputText';
import Button from '@/packages/common/components/Button';
import Banner from '@/packages/common/components/Banner';
import SignUpCard from '@/packages/auth/signup/components/SignUpCard';
import useForgotPassword from '@/packages/auth/hooks/useForgotPassword';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/packages/auth/validation/auth.validation';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const { mutate, isPending } = useForgotPassword();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [sent, setSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    setMessage(null);
    mutate(data, {
      onSuccess: () => {
        setSent(true);
        setMessage({ type: 'success', text: t('auth.forgotPassword.messages.sent') });
      },
      onError: () => setMessage({ type: 'error', text: t('auth.forgotPassword.messages.error') }),
    });
  };

  return (
    <SignUpCard>
      <div className="mb-6 flex justify-center">
        <CldImage src="logo_smzpb2" alt="Municipality Logo" width={80} height={80} className="object-contain" priority />
      </div>
      <h2 className="mb-8 text-center text-xl font-extrabold text-blue-700 md:text-2xl">{t('auth.forgotPassword.title')}</h2>
      <p className="-mt-6 mb-8 text-center text-sm text-gray-600">{t('auth.forgotPassword.helper')}</p>

      {message && <Banner type={message.type} message={message.text} onClose={() => setMessage(null)} />}

      {!sent && (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <ControlledInputText
            id="email"
            label={t('auth.forgotPassword.email')}
            type="email"
            placeholder={t('auth.forgotPassword.emailPlaceholder')}
            control={control}
            name="email"
            error={errors.email}
            required
          />

          <Button type="submit" variant="primary" size="lg" loading={isPending} disabled={isPending} className="mt-2 w-full">
            {t('auth.forgotPassword.submit')}
          </Button>
        </form>
      )}

      <p className="mt-6 rounded-lg bg-blue-50 p-3 text-center text-xs text-blue-800">{t('auth.forgotPassword.phoneOnlyHint')}</p>

      <div className="mt-4 text-center">
        <a href="/auth/login" className="text-sm text-blue-600 hover:underline">
          {t('auth.forgotPassword.backToLogin')}
        </a>
      </div>
    </SignUpCard>
  );
}
