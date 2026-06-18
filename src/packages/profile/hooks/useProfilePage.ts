'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { ServiceSubmission } from '@prisma/client';
import { useGetUserSubmissions } from '@/packages/serviceSubmissions/hooks/useGetUserSubmissions';
import { useDeleteServiceSubmission } from '@/packages/serviceSubmissions/hooks/useDeleteServiceSubmission';
import { useUpdateProfile } from '@/packages/profile/hooks/useUpdateProfile';
import { useAuth } from '@/packages/common/hooks/useAuth';
import { profileUpdateSchema } from '@/packages/profile/validation/profile.validation';

export type ProfileFormData = {
  name: string;
  email: string;
};

export function useProfilePage() {
  const router = useRouter();
  const { t } = useTranslation();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<ServiceSubmission[]>([]);
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { mutate: deleteSubmission, isPending: isDeleting } = useDeleteServiceSubmission();
  const { data: submissionsData, isLoading: submissionsLoading, error: submissionsError } = useGetUserSubmissions();
  const { mutate: updateProfile, isPending: isProfileUpdating } = useUpdateProfile();
  const { user, isAuthenticated, isLoading } = useAuth();

  const form = useForm<ProfileFormData>({
    resolver: yupResolver(profileUpdateSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  useEffect(() => {
    if (submissionsData) {
      setSubmissions(submissionsData);
    }
  }, [submissionsData]);

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user, form]);

  const handleChangePassword = () => {
    router.push('/profile/change-password');
  };

  const handleEditProfile = (data: ProfileFormData) => {
    updateProfile(data, {
      onSuccess: () => {
        setUpdateMessage({ type: 'success', text: t('profile.form.messages.updateSuccess') });
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

  const closeMessage = () => {
    setUpdateMessage(null);
  };

  return {
    // Form
    form,

    // User data
    user,
    isAuthenticated,
    isLoading,

    // Submissions
    submissions,
    submissionsLoading,
    submissionsError,
    deletingId,

    // Profile update
    isProfileUpdating,
    updateMessage,

    // Handlers
    handleChangePassword,
    handleEditProfile,
    handleEditSubmission,
    handleDeleteSubmission,
    closeMessage,
  };
}
