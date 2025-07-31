import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getSession } from 'next-auth/react';
import SignUpForm from './components/SignUpForm';
import SignUpHeader from './components/SignUpHeader';
import SignUpFooter from './components/SignUpFooter';
import SignUpCard from './components/SignUpCard';

export default function SignUpPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push('/');
      }
    };
    checkSession();
  }, [router]);

  const handleSuccess = () => {
    router.push('/');
  };

  return (
    <SignUpCard>
      <SignUpHeader />
      <SignUpForm onSuccess={handleSuccess} />
      <SignUpFooter />
    </SignUpCard>
  );
}
