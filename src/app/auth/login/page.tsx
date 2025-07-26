'use client';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push('/');
      }
    };
    checkSession();
  }, [router]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/');
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <form onSubmit={handleSubmit(onSubmit)} className="mx-2 w-full max-w-xs rounded-2xl bg-white p-6 shadow-xl md:max-w-md md:p-10">
        {/* Logo ou icône */}
        <div className="mb-6 flex justify-center">
          <Image src="/assets/images/logo.png" alt="Logo" width={64} height={64} className="h-16 w-16 rounded-full shadow-md" priority />
        </div>
        <h2 className="mb-8 text-center text-xl font-extrabold text-blue-700 md:text-2xl">{t('auth.login.title')}</h2>

        {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        <div className="mb-5">
          <label className="mb-1 block text-right text-sm font-medium text-gray-700 md:text-base" htmlFor="email">
            {t('auth.login.email')}
          </label>
          <input
            id="email"
            type="email"
            placeholder={t('auth.login.email')}
            {...register('email', { required: t('auth.login.required') })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right text-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 md:text-base"
          />
          {errors.email && <span className="text-sm text-red-500">{errors.email.message as string}</span>}
        </div>
        <div className="mb-6">
          <label className="mb-1 block text-right text-sm font-medium text-gray-700 md:text-base" htmlFor="password">
            {t('auth.login.password')}
          </label>
          <input
            id="password"
            type="password"
            placeholder={t('auth.login.password')}
            {...register('password', { required: t('auth.login.required') })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right text-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 md:text-base"
          />
          {errors.password && <span className="text-sm text-red-500">{errors.password.message as string}</span>}
        </div>
        {/* Lien mot de passe oublié */}
        <div className="mb-6 text-left">
          <a href="#" className="text-xs text-blue-600 hover:underline md:text-sm">
            نسيت كلمة المرور؟
          </a>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-blue-600 py-2 text-base font-bold text-white shadow transition hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-400 md:text-lg"
        >
          {isLoading ? 'جاري تسجيل الدخول...' : t('auth.login.submit')}
        </button>

        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">ليس لديك حساب؟ </span>
          <a href="/auth/signup" className="text-sm text-blue-600 hover:underline">
            إنشاء حساب جديد
          </a>
        </div>
      </form>
    </div>
  );
}
