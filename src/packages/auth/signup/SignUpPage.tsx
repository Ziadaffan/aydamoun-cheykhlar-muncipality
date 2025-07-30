import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { getSession } from 'next-auth/react';
import Image from 'next/image';
import ControlledInputText from '@/packages/common/components/ControlledInputText';
import Button from '@/packages/common/components/Button';
import Banner from '@/packages/common/components/Banner';
import useSignUp from '@/packages/auth/hooks/useSignUp';
import { signupSchema, SignupFormData } from '@/packages/common/utils/validationSchemas';

export default function SignUpPage() {
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

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push('/');
      }
    };
    checkSession();
  }, [router]);

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
          setTimeout(() => router.push('/'), 1000);
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <form onSubmit={handleSubmit(onSubmit)} className="mx-2 w-full max-w-xs rounded-2xl bg-white p-6 shadow-xl md:max-w-md md:p-10">
        <div className="mb-6 flex justify-center">
          <Image src="/assets/images/logo.png" alt="Logo" width={64} height={64} className="h-16 w-16 rounded-full shadow-md" priority />
        </div>
        <h2 className="mb-8 text-center text-xl font-extrabold text-blue-700 md:text-2xl">{t('auth.signup.title')}</h2>

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
