'use client';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignupPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch('password');

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
    setSuccess('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'An error occurred during signup');
      } else {
        setSuccess('Account created successfully! You can now log in.');
        // Auto-login after successful signup
        setTimeout(async () => {
          const signInResult = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
          });

          if (signInResult?.error) {
            setError('Account created but login failed. Please try logging in manually.');
          } else {
            router.push('/');
          }
        }, 500);
      }
    } catch (error) {
      setError('An error occurred during signup');
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
        <h2 className="mb-8 text-center text-xl font-extrabold text-blue-700 md:text-2xl">إنشاء حساب جديد</h2>

        {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        {success && <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-600">{success}</div>}

        <div className="mb-5">
          <label className="mb-1 block text-right text-sm font-medium text-gray-700 md:text-base" htmlFor="name">
            الاسم الكامل
          </label>
          <input
            id="name"
            type="text"
            placeholder="الاسم الكامل"
            {...register('name', { required: 'الاسم مطلوب' })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right text-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 md:text-base"
          />
          {errors.name && <span className="text-sm text-red-500">{errors.name.message as string}</span>}
        </div>

        <div className="mb-5">
          <label className="mb-1 block text-right text-sm font-medium text-gray-700 md:text-base" htmlFor="email">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            type="email"
            placeholder="البريد الإلكتروني"
            {...register('email', {
              required: 'البريد الإلكتروني مطلوب',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'بريد إلكتروني غير صحيح',
              },
            })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right text-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 md:text-base"
          />
          {errors.email && <span className="text-sm text-red-500">{errors.email.message as string}</span>}
        </div>

        <div className="mb-5">
          <label className="mb-1 block text-right text-sm font-medium text-gray-700 md:text-base" htmlFor="password">
            كلمة المرور
          </label>
          <input
            id="password"
            type="password"
            placeholder="كلمة المرور"
            {...register('password', {
              required: 'كلمة المرور مطلوبة',
              minLength: {
                value: 6,
                message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
              },
            })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right text-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 md:text-base"
          />
          {errors.password && <span className="text-sm text-red-500">{errors.password.message as string}</span>}
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-right text-sm font-medium text-gray-700 md:text-base" htmlFor="confirmPassword">
            تأكيد كلمة المرور
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="تأكيد كلمة المرور"
            {...register('confirmPassword', {
              required: 'تأكيد كلمة المرور مطلوب',
              validate: value => value === password || 'كلمات المرور غير متطابقة',
            })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right text-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 md:text-base"
          />
          {errors.confirmPassword && <span className="text-sm text-red-500">{errors.confirmPassword.message as string}</span>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-blue-600 py-2 text-base font-bold text-white shadow transition hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-400 md:text-lg"
        >
          {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
        </button>

        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">لديك حساب بالفعل؟ </span>
          <a href="/auth/login" className="text-sm text-blue-600 hover:underline">
            تسجيل الدخول
          </a>
        </div>
      </form>
    </div>
  );
}
