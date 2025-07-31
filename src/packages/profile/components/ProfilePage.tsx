'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import Spinner from '@/packages/common/components/Spinner';
import { useProfilePage } from '../hooks/useProfilePage';
import ProfileHeader from './ProfileHeader';
import ProfileFormSection from './ProfileFormSection';
import ProfileActions from './ProfileActions';
import SubmissionsSection from './SubmissionsSection';

export default function ProfilePage() {
  const {
    form,
    user,
    isAuthenticated,
    isLoading,
    submissions,
    submissionsLoading,
    submissionsError,
    deletingId,
    isProfileUpdating,
    updateMessage,
    handleChangePassword,
    handleEditProfile,
    handleEditSubmission,
    handleDeleteSubmission,
    closeMessage,
  } = useProfilePage();

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = form;

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
          <ProfileHeader user={user} />

          <ProfileFormSection control={control} errors={errors} updateMessage={updateMessage} onCloseMessage={closeMessage} />

          <ProfileActions
            isProfileUpdating={isProfileUpdating}
            isDirty={isDirty}
            onEditProfile={handleSubmit(handleEditProfile)}
            onChangePassword={handleChangePassword}
          />
        </div>

        <SubmissionsSection
          submissions={submissions}
          isLoading={submissionsLoading}
          error={submissionsError}
          deletingId={deletingId}
          onEditSubmission={handleEditSubmission}
          onDeleteSubmission={handleDeleteSubmission}
        />
      </div>
    </div>
  );
}
