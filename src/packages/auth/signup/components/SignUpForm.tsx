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
    resolver: yupResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
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
          email: data.email,
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
        let errorMessage = t('auth.signup.messages.signupError');

        if (error.message === 'USER_EXISTS') {
          errorMessage = t('auth.signup.messages.userExists');
        } else if (error.message && error.message !== 'Something went wrong') {
          errorMessage = error.message;
        }

        setMessage({ type: 'error', text: errorMessage });
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
        required
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
    </form>
  );
}
