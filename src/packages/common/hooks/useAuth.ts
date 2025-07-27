'use client';
import { useSession } from 'next-auth/react';

export const useAuth = () => {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    userId: session?.user?.id,
    isAuthenticated: !!session?.user?.id,
    isLoading: status === 'loading',
    role: session?.user?.role,
  };
};
