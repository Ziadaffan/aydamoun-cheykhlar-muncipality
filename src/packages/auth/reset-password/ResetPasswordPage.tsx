'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { CldImage } from 'next-cloudinary';
import ControlledInputText from '@/packages/common/components/form/ControlledInputText';
import Button from '@/packages/common/components/Button';
import Banner from '@/packages/common/components/Banner';
import SignUpCard from '@/packages/auth/signup/components/SignUpCard';
import useResetPassword from '@/packages/auth/hooks/useResetPassword';
import { resetPasswordSchema, ResetPasswordFormData } from '@/packages/auth/validation/auth.validation';

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') ?? '';
  const { mutate, isPending } = useResetPassword();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [done, setDone] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    setMessage(null);
    mutate(
      { token, password: data.password },
      {
        onSuccess: () => {
          setDone(true);
          setMessage({ type: 'success', text: t('auth.resetPassword.messages.success') });
          setTimeout(() => router.push('/auth/login'), 1500);
        },
        onError: error => {
          const errorKey =
            error.message === 'INVALID_TOKEN'
              ? 'auth.resetPassword.messages.invalidToken'
              : error.message === 'WEAK_PASSWORD'
                ? 'auth.resetPassword.messages.weakPassword'
                : 'auth.resetPassword.messages.error';
          setMessage({ type: 'error', text: t(errorKey) });
        },
      }
    );
  };

  return (
    <SignUpCard>
      <div className="mb-6 flex justify-center">
        <CldImage src="logo_smzpb2" alt="Municipality Logo" width={80} height={80} className="object-contain" priority />
      </div>
      <h2 className="mb-8 text-center text-xl font-extrabold text-blue-700 md:text-2xl">{t('auth.resetPassword.title')}</h2>
      <p className="-mt-6 mb-8 text-center text-sm text-gray-600">{t('auth.resetPassword.helper')}</p>

      {message && <Banner type={message.type} message={message.text} onClose={() => setMessage(null)} />}

      {!token ? (
        <Banner type="error" message={t('auth.resetPassword.messages.missingToken')} />
      ) : (
        !done && (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <ControlledInputText
              id="password"
              label={t('auth.resetPassword.password')}
              type="password"
              placeholder={t('auth.resetPassword.passwordPlaceholder')}
              control={control}
              name="password"
              error={errors.password}
              required
            />
            <ControlledInputText
              id="confirmPassword"
              label={t('auth.resetPassword.confirmPassword')}
              type="password"
              placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
              control={control}
              name="confirmPassword"
              error={errors.confirmPassword}
              required
            />

            <Button type="submit" variant="primary" size="lg" loading={isPending} disabled={isPending} className="mt-2 w-full">
              {t('auth.resetPassword.submit')}
            </Button>
          </form>
        )
      )}

      <div className="mt-4 text-center">
        <a href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
          {t('auth.resetPassword.requestNewLink')}
        </a>
      </div>
    </SignUpCard>
  );
}
