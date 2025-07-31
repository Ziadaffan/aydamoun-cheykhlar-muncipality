import { useRouter } from 'next/navigation';
import { useAuth } from '@/packages/common/hooks/useAuth';
import Spinner from '@/packages/common/components/Spinner';
import { BackButton } from '@/packages/common/components/BackBotton';
import ChangePasswordForm from './ChangePasswordForm';
import ChangePasswordHeader from './ChangePasswordHeader';
import ChangePasswordCard from './ChangePasswordCard';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { isLoading } = useAuth();

  const handleBack = () => {
    router.push('/profile');
  };

  const handleSuccess = () => {
    router.back();
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

        <ChangePasswordCard>
          <ChangePasswordHeader />
          <ChangePasswordForm onCancel={handleBack} onSuccess={handleSuccess} />
        </ChangePasswordCard>
      </div>
    </div>
  );
}
