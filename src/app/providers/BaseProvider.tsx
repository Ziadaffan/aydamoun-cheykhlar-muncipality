'use client';

import { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SessionProvider from './SessionProvider';
import { ToastContainer } from 'react-toastify';

export default function BaseProvider({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <SessionProvider>{children}</SessionProvider>
        <ToastContainer />
      </I18nextProvider>
    </QueryClientProvider>
  );
}
