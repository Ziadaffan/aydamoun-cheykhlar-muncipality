import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/packages/common/hooks/useAuth';
import { useUpdatePassword } from '@/packages/profile/hooks/useUpdatePassword';
import ControlledInputText from '@/packages/common/components/ControlledInputText';
import Button from '@/packages/common/components/Button';
import Banner from '@/packages/common/components/Banner';
import Spinner from '@/packages/common/components/Spinner';
import { BackButton } from '@/packages/common/components/BackBotton';
import { yupResolver } from '@hookform/resolvers/yup';
import { passwordChangeSchema } from '@/packages/common/utils/validationSchemas';

export type ChangePasswordFormData = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePasswordPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isLoading } = useAuth();
  const { mutate: updatePassword, isPending: isPasswordUpdating } = useUpdatePassword();

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(passwordChangeSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleChangePassword = (data: ChangePasswordFormData) => {
    if (data.oldPassword === data.newPassword) {
      setMessage({ type: 'error', text: t('profile.changePassword.errors.samePassword') });
      return;
    }

    if (data.oldPassword === '' || data.newPassword === '' || data.confirmPassword === '') {
      setMessage({ type: 'error', text: t('profile.changePassword.errors.passwordRequired') });
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      setMessage({ type: 'error', text: t('profile.changePassword.errors.passwordMismatch') });
      return;
    }

    updatePassword(
      {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          setMessage({ type: 'success', text: t('profile.changePassword.messages.success') });
          reset();
          setTimeout(() => {
            router.back();
          }, 1000);
        },
        onError: () => {
          setMessage({ type: 'error', text: t('profile.changePassword.messages.error') });
        },
        onSettled: () => {
          setTimeout(() => {
            setMessage(null);
          }, 3000);
        },
      }
    );
  };

  const handleBack = () => {
    router.push('/profile');
  };

  if (isLoading) {
    return <Spinner className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="rounded-lg bg-white shadow">
          {/* Header */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">{t('profile.changePassword.title')}</h1>
              <p className="mt-2 text-sm text-gray-600">{t('profile.changePassword.description')}</p>
            </div>
          </div>

          {/* Form */}
          <div className="px-6 py-8">
            {message && <Banner type={message.type} message={message.text} onClose={() => setMessage(null)} />}

            <form onSubmit={handleSubmit(handleChangePassword)} className="space-y-6">
              <ControlledInputText
                id="oldPassword"
                label={t('profile.changePassword.oldPassword')}
                type="password"
                placeholder={t('profile.changePassword.oldPasswordPlaceholder')}
                control={control}
                name="oldPassword"
                error={errors.oldPassword}
                required
              />

              <ControlledInputText
                id="newPassword"
                label={t('profile.changePassword.newPassword')}
                type="password"
                placeholder={t('profile.changePassword.newPasswordPlaceholder')}
                control={control}
                name="newPassword"
                error={errors.newPassword}
                required
              />

              <ControlledInputText
                id="confirmPassword"
                label={t('profile.changePassword.confirmPassword')}
                type="password"
                placeholder={t('profile.changePassword.confirmPasswordPlaceholder')}
                control={control}
                name="confirmPassword"
                error={errors.confirmPassword}
                required
              />

              {/* Actions */}
              <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                <Button type="button" variant="secondary" size="md" className="w-full sm:flex-1" onClick={handleBack} disabled={isPasswordUpdating}>
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full sm:flex-1"
                  loading={isPasswordUpdating}
                  disabled={isPasswordUpdating}
                >
                  {t('profile.changePassword.updateButton')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
