'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white shadow">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-8">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{session.user?.name || 'المستخدم'}</h1>
                <p className="text-gray-600">{session.user?.email}</p>
                <p className="text-sm text-gray-500">عضو منذ {new Date().toLocaleDateString('ar-SA')}</p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="px-6 py-8">
            <h2 className="mb-6 text-lg font-semibold text-gray-900">معلومات الحساب</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">الاسم</label>
                <input
                  type="text"
                  value={session.user?.name || ''}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-right"
                  readOnly
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={session.user?.email || ''}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-right"
                  readOnly
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">نوع الحساب</label>
                <input
                  type="text"
                  value={session.user?.role === 'ADMIN' ? 'مدير' : 'مستخدم'}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-right"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-b-lg bg-gray-50 px-6 py-4">
            <div className="flex justify-end space-x-4 space-x-reverse">
              <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                تعديل الملف الشخصي
              </button>
              <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                تغيير كلمة المرور
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
