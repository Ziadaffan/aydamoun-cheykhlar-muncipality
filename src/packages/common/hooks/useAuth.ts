'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const { data: session, status, update } = useSession();
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  useEffect(() => {
    if (session?.expires) {
      const expirationTime = new Date(session.expires).getTime();
      const currentTime = Date.now();

      if (currentTime >= expirationTime) {
        setIsSessionExpired(true);
      } else {
        setIsSessionExpired(false);
        // Mettre à jour la session si elle expire dans moins de 5 minutes
        const timeUntilExpiry = expirationTime - currentTime;
        if (timeUntilExpiry < 5 * 60 * 1000) {
          update();
        }
      }
    }
  }, [session?.expires, update]);

  return {
    user: session?.user,
    userId: session?.user?.id,
    isAuthenticated: !!session?.user?.id && !isSessionExpired,
    isLoading: status === 'loading',
    role: session?.user?.role,
    isSessionExpired,
    session,
  };
};
