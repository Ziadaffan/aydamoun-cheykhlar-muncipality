'use client';

import { useTranslation } from 'react-i18next';
import { Control, FieldErrors } from 'react-hook-form';
import ControlledInputText from '@/packages/common/components/form/ControlledInputText';
import Banner from '@/packages/common/components/Banner';

type ProfileFormData = {
  name: string;
  email: string;
};

type ProfileFormSectionProps = {
  control: Control<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  updateMessage: { type: 'success' | 'error'; text: string } | null;
  onCloseMessage: () => void;
};

export default function ProfileFormSection({ control, errors, updateMessage, onCloseMessage }: ProfileFormSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="px-6 py-8">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">{t('profile.accountInfo.title')}</h2>

      {updateMessage && <Banner type={updateMessage.type} message={updateMessage.text} onClose={onCloseMessage} />}

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
  );
}
