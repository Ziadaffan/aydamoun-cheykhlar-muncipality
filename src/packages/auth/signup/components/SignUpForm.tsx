'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ControlledInputText from '@/packages/common/components/form/ControlledInputText';
import Button from '@/packages/common/components/Button';
import Banner from '@/packages/common/components/Banner';
import useSignUp from '@/packages/auth/hooks/useSignUp';
import { signupSchema, SignupFormData } from '@/packages/auth/validation/auth.validation';

// useSignUp's error codes → messages.
const ERROR_KEYS: Record<string, string> = {
  USER_EXISTS: 'auth.signup.messages.userExists',
  WEAK_PASSWORD: 'auth.signup.messages.weakPassword',
  INVALID_PHONE: 'auth.signup.messages.invalidPhone',
  EMAIL_OR_PHONE_REQUIRED: 'auth.signup.messages.emailOrPhoneRequired',
};

type SignUpFormProps = {
  onSuccess?: () => void;
};

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { mutate } = useSignUp();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema) as any,
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setMessage(null);
    mutate(data, {
      onSuccess: async () => {
        setMessage({ type: 'success', text: t('auth.signup.messages.accountCreated') });
        const signInResult = await signIn('credentials', {
          identifier: (data.email?.trim() ? data.email : data.phone) || '',
          password: data.password,
          redirect: false,
        });
        if (signInResult?.error) {
          setMessage({ type: 'error', text: t('auth.signup.messages.loginAfterSignupError') });
        } else {
          if (onSuccess) {
            setTimeout(() => onSuccess(), 1000);
          } else {
            setTimeout(() => router.push('/'), 1000);
          }
        }
      },
      onError: error => {
        const errorKey = ERROR_KEYS[error.message] ?? 'auth.signup.messages.signupError';
        setMessage({ type: 'error', text: t(errorKey) });
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {message && <Banner type={message.type} message={message.text} onClose={() => setMessage(null)} />}

      <ControlledInputText
        id="name"
        label={t('auth.signup.fullName')}
        type="text"
        placeholder={t('auth.signup.fullNamePlaceholder')}
        control={control}
        name="name"
        error={errors.name}
        required
      />

      <ControlledInputText
        id="email"
        label={t('auth.signup.email')}
        type="email"
        placeholder={t('auth.signup.emailPlaceholder')}
        control={control}
        name="email"
        error={errors.email}
      />

      <ControlledInputText
        id="phone"
        label={t('auth.signup.phone')}
        type="text"
        placeholder={t('auth.signup.phonePlaceholder')}
        control={control}
        name="phone"
        error={errors.phone}
      />

      <ControlledInputText
        id="password"
        label={t('auth.signup.password')}
        type="password"
        placeholder={t('auth.signup.passwordPlaceholder')}
        control={control}
        name="password"
        error={errors.password}
        required
      />

      <ControlledInputText
        id="confirmPassword"
        label={t('auth.signup.confirmPassword')}
        type="password"
        placeholder={t('auth.signup.confirmPasswordPlaceholder')}
        control={control}
        name="confirmPassword"
        error={errors.confirmPassword}
        required
      />

      <Button type="submit" variant="primary" size="lg" loading={isLoading} disabled={isLoading} className="w-full">
        {t('auth.signup.submit')}
      </Button>

      {/* Same consent line as the app's signup screen. */}
      <p className="-mt-2 text-center text-xs leading-relaxed text-gray-600">
        {t('auth.signup.consent.prefix')}{' '}
        <a href="/terms-of-use" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
          {t('auth.signup.consent.terms')}
        </a>{' '}
        {t('auth.signup.consent.and')}
        <a href="/privacy-policy" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
          {t('auth.signup.consent.privacy')}
        </a>
      </p>
    </form>
  );
}
