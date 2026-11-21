'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useUpdateProfile } from '@/packages/profile/hooks/useUpdateProfile';
import { useAuth } from '@/packages/common/hooks/useAuth';
import { profileUpdateSchema } from '@/packages/profile/validation/profile.validation';

// useUpdateProfile's error codes → messages.
const PROFILE_ERROR_KEYS: Record<string, string> = {
  USER_EXISTS: 'profile.form.messages.conflict',
  INVALID_PHONE: 'profile.form.messages.invalidPhone',
  EMAIL_OR_PHONE_REQUIRED: 'profile.form.messages.emailOrPhoneRequired',
  UNAUTHORIZED: 'common.sessionExpired',
};

export type ProfileFormData = {
  name: string;
  email: string;
  phone: string;
};

export function useProfilePage() {
  const router = useRouter();
  const { t } = useTranslation();

  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { mutate: updateProfile, isPending: isProfileUpdating } = useUpdateProfile();
  const { user, isAuthenticated, isLoading } = useAuth();

  const form = useForm<ProfileFormData>({
    resolver: yupResolver(profileUpdateSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
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
      onError: error => {
        setUpdateMessage({ type: 'error', text: t(PROFILE_ERROR_KEYS[error.message] ?? 'profile.form.messages.updateError') });
      },
      onSettled: () => {
        setTimeout(() => {
          setUpdateMessage(null);
        }, 3000);
      },
    });
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

    // Profile update
    isProfileUpdating,
    updateMessage,

    // Handlers
    handleChangePassword,
    handleEditProfile,
    closeMessage,
  };
}
