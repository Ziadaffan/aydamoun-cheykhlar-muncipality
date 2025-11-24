import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { getSession } from 'next-auth/react';
import Image from 'next/image';
import ControlledInputText from '@/packages/common/components/form/ControlledInputText';
import Button from '@/packages/common/components/Button';
import Banner from '@/packages/common/components/Banner';
import useLogin from '@/packages/auth/hooks/useLogin';
import { loginSchema, LoginFormData } from '@/packages/auth/validation/auth.validation';
import { CldImage } from 'next-cloudinary';

export default function LogInPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { mutate } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session?.user && session.expires) {
        const expirationTime = new Date(session.expires).getTime();
        const currentTime = Date.now();

        // Vérifier si la session est encore valide
        if (currentTime < expirationTime) {
          router.push('/');
        }
      }
    };
    checkSession();
  }, [router]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setMessage(null);
    mutate(data, {
      onSuccess: () => {
        setMessage({ type: 'success', text: t('auth.login.messages.loginSuccess') });
        setTimeout(() => router.push('/'), 1000);
      },
      onError: error => {
        let errorMessage = t('auth.login.messages.loginError');

        if (error.message === 'INVALID_CREDENTIALS') {
          errorMessage = t('auth.login.messages.invalidCredentials');
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
          <CldImage src="logo_smzpb2" alt="Municipality Logo" width={80} height={80} className="object-contain" priority />
        </div>
        <h2 className="mb-8 text-center text-xl font-extrabold text-blue-700 md:text-2xl">{t('auth.login.title')}</h2>

        {message && <Banner type={message.type} message={message.text} onClose={() => setMessage(null)} />}

        <ControlledInputText
          id="email"
          label={t('auth.login.email')}
          type="email"
          placeholder={t('auth.login.emailPlaceholder')}
          control={control}
          name="email"
          error={errors.email}
          required
        />

        <ControlledInputText
          id="password"
          label={t('auth.login.password')}
          type="password"
          placeholder={t('auth.login.passwordPlaceholder')}
          control={control}
          name="password"
          error={errors.password}
          required
        />

        {/* Lien mot de passe oublié */}
        <div className="mb-6 text-left">
          <a href="#" className="text-xs text-blue-600 hover:underline md:text-sm">
            {t('auth.login.forgotPassword')}
          </a>
        </div>

        <Button type="submit" variant="primary" size="lg" loading={isLoading} disabled={isLoading || !isValid} className="w-full">
          {t('auth.login.submit')}
        </Button>

        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">{t('auth.login.noAccount')} </span>
          <a href="/auth/signup" className="text-sm text-blue-600 hover:underline">
            {t('auth.login.createAccount')}
          </a>
        </div>
      </form>
    </div>
  );
}
