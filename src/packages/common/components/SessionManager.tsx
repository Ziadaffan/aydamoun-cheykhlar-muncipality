'use client';

import { useAuth } from '../hooks/useAuth';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function SessionManager() {
  const { isSessionExpired, session } = useAuth();

  useEffect(() => {
    if (isSessionExpired && session) {
      // Déconnecter automatiquement l'utilisateur si la session a expiré
      signOut({
        callbackUrl: '/auth/login',
        redirect: true,
      });
    }
  }, [isSessionExpired, session]);

  // Ce composant ne rend rien, il gère juste la logique de session
  return null;
}
