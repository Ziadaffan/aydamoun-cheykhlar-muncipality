'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGetUserSubmissions } from '@/packages/serviceSubmissions/hooks/useGetUserSubmissions';
import { useDeleteServiceSubmission } from '@/packages/serviceSubmissions/hooks/useDeleteServiceSubmission';
import { EditButton } from '@/packages/common/components/EditButton';
import { DeleteButton } from '@/packages/common/components/DeleteButton';
import { ServiceSubmission } from '@prisma/client';
import { useAuth } from '@/packages/common/hooks/useAuth';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import { useForm } from 'react-hook-form';
import ControlledInputText from '@/packages/common/components/ControlledInputText';
import Button from '@/packages/common/components/Button';
import { useTranslation } from 'react-i18next';
import { useUpdateProfile } from '@/packages/profile/hooks/useUpdateProfile';
import Banner from '@/packages/common/components/Banner';
import { yupResolver } from '@hookform/resolvers/yup';
import { profileUpdateSchema } from '@/packages/common/utils/validationSchemas';

export type ProfileFormData = {
  name: string;
  email: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useTranslation();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<ServiceSubmission[]>([]);
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { mutate: deleteSubmission, isPending: isDeleting } = useDeleteServiceSubmission();
  const { data: submissionsData, isLoading: submissionsLoading, error: submissionsError } = useGetUserSubmissions();
  const { mutate: updateProfile, isPending: isProfileUpdating } = useUpdateProfile();
  const { user, isAuthenticated, isLoading } = useAuth();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileUpdateSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  useEffect(() => {
    if (submissionsData) {
      setSubmissions(submissionsData);
    }
  }, [submissionsData]);

  const handleChangePassword = () => {
    router.push('/profile/change-password');
  };

  const handleEditProfile = (data: ProfileFormData) => {
    updateProfile(data, {
      onSuccess: () => {
        setUpdateMessage({ type: 'success', text: t('profile.form.messages.updateSuccess') });
        reset({
          name: data.name,
          email: data.email,
        });
      },
      onError: () => {
        setUpdateMessage({ type: 'error', text: t('profile.form.messages.updateError') });
      },
      onSettled: () => {
        setTimeout(() => {
          setUpdateMessage(null);
        }, 3000);
      },
    });
  };

  const handleEditSubmission = (submissionId: string) => {
    router.push(`/profile/edit-submission/${submissionId}`);
  };

  const handleDeleteSubmission = (submissionId: string) => {
    if (confirm(t('profile.submissions.deleteConfirmation'))) {
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
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-10 sm:px-10 sm:py-12">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-10 sm:space-x-reverse">
              {/* Avatar */}
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-3xl font-bold text-white shadow-lg ring-4 ring-blue-100">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>

              {/* User info */}
              <div className="text-center sm:text-right">
                <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900">{user?.name}</h1>
                <div className="space-y-1">
                  <p className="font-medium text-gray-700">{user?.email}</p>
                  <p className="text-sm text-gray-500">
                    {t('profile.header.memberSince')} {new Date().toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="px-6 py-8">
            <h2 className="mb-6 text-lg font-semibold text-gray-900">{t('profile.accountInfo.title')}</h2>
            {updateMessage && <Banner type={updateMessage.type} message={updateMessage.text} onClose={() => setUpdateMessage(null)} />}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <ControlledInputText
                id="name"
                label={t('profile.accountInfo.name')}
                type="text"
                placeholder={t('profile.accountInfo.name')}
                control={control}
                name="name"
                error={errors.name}
                required
              />
              <ControlledInputText
                id="email"
                label={t('profile.accountInfo.email')}
                type="email"
                placeholder={t('profile.accountInfo.email')}
                control={control}
                name="email"
                error={errors.email}
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-b-lg bg-gray-50 px-6 py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-start">
              <Button
                loading={isProfileUpdating}
                variant="primary"
                size="md"
                className="w-full"
                onClick={handleSubmit(handleEditProfile)}
                disabled={isProfileUpdating}
              >
                {t('profile.actions.editProfile')}
              </Button>
              <Button variant="warning" size="md" className="w-full" onClick={handleChangePassword} disabled={isProfileUpdating}>
                {t('profile.actions.changePassword')}
              </Button>
            </div>
          </div>
        </div>

        {/* User Submissions */}
        <div className="mt-8 rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('profile.submissions.title')}</h2>
          </div>

          <div className="px-6 py-4">
            {submissionsLoading && <Spinner className="min-h-[100px]" />}

            {submissionsError && <ErrorMessage />}

            {!submissionsLoading && !submissionsError && submissions && submissions.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-gray-600">{t('profile.submissions.noSubmissions')}</p>
                <button
                  onClick={() => router.push('/services')}
                  className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  {t('profile.submissions.newRequest')}
                </button>
              </div>
            )}

            {!submissionsLoading && !submissionsError && submissions && submissions.length > 0 && (
              <div className="space-y-4">
                {submissions.map((submission: any) => (
                  <div key={submission.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{submission.service?.name || t('profile.submissions.unknownService')}</h3>
                        <p className="text-sm text-gray-600">
                          {submission.description && submission.description.length > 30
                            ? `${submission.description.substring(0, 30)}...`
                            : submission.description}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {t('profile.submissions.submissionDate')}: {new Date(submission.createdAt).toLocaleDateString('ar-SA')}
                        </p>
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
                              ? t('profile.submissions.status.pending')
                              : submission.status === 'IN_PROGRESS'
                                ? t('profile.submissions.status.inProgress')
                                : submission.status === 'COMPLETED'
                                  ? t('profile.submissions.status.completed')
                                  : t('profile.submissions.status.rejected')}
                          </span>
                        </div>

                        <div className="flex space-x-2 space-x-reverse">
                          <EditButton onClick={() => handleEditSubmission(submission.id)} />
                          <DeleteButton
                            onClick={() => handleDeleteSubmission(submission.id)}
                            isDeleting={deletingId === submission.id}
                            className="mr-2"
                          />
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
