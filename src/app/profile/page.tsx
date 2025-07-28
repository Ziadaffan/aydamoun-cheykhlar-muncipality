'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useGetUserSubmissions } from '@/packages/serviceSubmissions/hooks/useGetUserSubmissions';
import { useDeleteServiceSubmission } from '@/packages/serviceSubmissions/hooks/useDeleteServiceSubmission';
import { EditButton } from '@/packages/common/components/EditButton';
import { DeleteButton } from '@/packages/common/components/DeleteButton';
import { ServiceSubmission } from '@prisma/client';
import { useAuth } from '@/packages/common/hooks/useAuth';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<ServiceSubmission[]>([]);
  const { data: submissionsData, isLoading: submissionsLoading, error: submissionsError } = useGetUserSubmissions();
  const { mutate: deleteSubmission, isPending: isDeleting } = useDeleteServiceSubmission();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (submissionsData) {
      console.log(submissionsData);
      setSubmissions(submissionsData);
    }
  }, [submissionsData]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const handleEdit = (submissionId: string) => {
    // Pour l'instant, rediriger vers une page d'édition (à implémenter)
    router.push(`/profile/edit-submission/${submissionId}`);
  };

  const handleDelete = (submissionId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      setDeletingId(submissionId);
      deleteSubmission(submissionId, {
        onSuccess: () => {
          setDeletingId(null);
        },
        onError: () => {
          setDeletingId(null);
        },
      });
    }
  };

  if (isLoading) {
    return <Spinner className="min-h-screen" />;
  }

  if (!isAuthenticated) {
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
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'المستخدم'}</h1>
                <p className="text-gray-600">{user?.email}</p>
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
                <input type="text" value={user?.name || ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-right" readOnly />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                <input type="email" value={user?.email || ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-right" readOnly />
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

        {/* User Submissions */}
        <div className="mt-8 rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">طلباتي</h2>
          </div>

          <div className="px-6 py-4">
            {submissionsLoading && <Spinner className="min-h-[100px]" />}

            {submissionsError && <ErrorMessage />}

            {!submissionsLoading && !submissionsError && submissions && submissions.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-gray-600">لا توجد طلبات حتى الآن</p>
                <button
                  onClick={() => router.push('/services')}
                  className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  تقديم طلب جديد
                </button>
              </div>
            )}

            {!submissionsLoading && !submissionsError && submissions && submissions.length > 0 && (
              <div className="space-y-4">
                {submissions.map((submission: any) => (
                  <div key={submission.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{submission.service?.name || 'خدمة غير محددة'}</h3>
                        <p className="text-sm text-gray-600">
                          {submission.description && submission.description.length > 30
                            ? `${submission.description.substring(0, 30)}...`
                            : submission.description}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">تاريخ التقديم: {new Date(submission.createdAt).toLocaleDateString('ar-SA')}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              submission.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : submission.status === 'IN_PROGRESS'
                                  ? 'bg-blue-100 text-blue-800'
                                  : submission.status === 'COMPLETED'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {submission.status === 'PENDING'
                              ? 'قيد الانتظار'
                              : submission.status === 'IN_PROGRESS'
                                ? 'قيد المعالجة'
                                : submission.status === 'COMPLETED'
                                  ? 'مكتمل'
                                  : 'مرفوض'}
                          </span>
                        </div>

                        <div className="flex space-x-2 space-x-reverse">
                          <EditButton onClick={() => handleEdit(submission.id)} />
                          <DeleteButton onClick={() => handleDelete(submission.id)} isDeleting={deletingId === submission.id} className="mr-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
