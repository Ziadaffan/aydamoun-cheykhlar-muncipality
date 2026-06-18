'use client';

import { useTranslation } from 'react-i18next';
import Button from '@/packages/common/components/Button';

type ProfileActionsProps = {
  isProfileUpdating: boolean;
  isDirty: boolean;
  isValid: boolean;
  onEditProfile: () => void;
  onChangePassword: () => void;
};

export default function ProfileActions({ isProfileUpdating, isDirty, isValid, onEditProfile, onChangePassword }: ProfileActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-b-lg bg-gray-50 px-6 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-start">
        <Button
          loading={isProfileUpdating}
          variant="primary"
          size="md"
          className="w-full"
          onClick={onEditProfile}
          disabled={isProfileUpdating || !isDirty || !isValid}
        >
          {t('profile.actions.editProfile')}
        </Button>
        <Button variant="warning" size="md" className="w-full" onClick={onChangePassword} disabled={isProfileUpdating}>
          {t('profile.actions.changePassword')}
        </Button>
      </div>
    </div>
  );
}
