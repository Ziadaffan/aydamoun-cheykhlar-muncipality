import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getSession } from 'next-auth/react';
import Image from 'next/image';
import ControlledInputText from '@/packages/common/components/ControlledInputText';
import Button from '@/packages/common/components/Button';
import useSignUp, { SignUpData } from '../hooks/useSignUp';
import { notify } from '@/packages/common/notify';

export default function SignUpPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpData>();

  const password = watch('password');

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push('/');
      }
    };
    checkSession();
  }, [router]);

  const onSubmit = async (data: SignUpData) => {
    setIsLoading(true);
    mutate(data as SignUpData, {
      onSuccess: async () => {
        notify(t('auth.signup.messages.accountCreated'), 'success');
        const signInResult = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        if (signInResult?.error) {
          notify(t('auth.signup.messages.loginAfterSignupError'), 'error');
        } else {
          router.push('/');
        }
      },
      onError: error => {
        notify(error.message || t('auth.signup.messages.signupError'), 'error');
        setIsLoading(false);
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <form onSubmit={handleSubmit(onSubmit)} className="mx-2 w-full max-w-xs rounded-2xl bg-white p-6 shadow-xl md:max-w-md md:p-10">
        <div className="mb-6 flex justify-center">
          <Image src="/assets/images/logo.png" alt="Logo" width={64} height={64} className="h-16 w-16 rounded-full shadow-md" priority />
        </div>
        <h2 className="mb-8 text-center text-xl font-extrabold text-blue-700 md:text-2xl">{t('auth.signup.title')}</h2>

        <ControlledInputText
          id="name"
          label={t('auth.signup.fullName')}
          type="text"
          placeholder={t('auth.signup.fullNamePlaceholder')}
          register={register('name', { required: t('auth.signup.validation.nameRequired') })}
          error={errors.name}
          required
        />

        <ControlledInputText
          id="email"
          label={t('auth.signup.email')}
          type="email"
          placeholder={t('auth.signup.emailPlaceholder')}
          register={register('email', {
            required: t('auth.signup.validation.emailRequired'),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t('auth.signup.validation.emailInvalid'),
            },
          })}
          error={errors.email}
          required
        />

        <ControlledInputText
          id="password"
          label={t('auth.signup.password')}
          type="password"
          placeholder={t('auth.signup.passwordPlaceholder')}
          register={register('password', {
            required: t('auth.signup.validation.passwordRequired'),
            minLength: {
              value: 6,
              message: t('auth.signup.validation.passwordMinLength'),
            },
          })}
          error={errors.password}
          required
        />

        <ControlledInputText
          id="confirmPassword"
          label={t('auth.signup.confirmPassword')}
          type="password"
          placeholder={t('auth.signup.confirmPasswordPlaceholder')}
          register={register('confirmPassword', {
            required: t('auth.signup.validation.confirmPasswordRequired'),
            validate: value => value === password || t('auth.signup.validation.passwordsNotMatch'),
          })}
          error={errors.confirmPassword}
          required
        />

        <Button type="submit" variant="primary" size="lg" loading={isLoading} disabled={isLoading} className="w-full">
          {t('auth.signup.submit')}
        </Button>

        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">{t('auth.signup.alreadyHaveAccount')} </span>
          <a href="/auth/login" className="text-sm text-blue-600 hover:underline">
            {t('auth.signup.loginLink')}
          </a>
        </div>
      </form>
    </div>
  );
}
