'use client';

import BaseProvider from '@/app/providers/BaseProvider';
import NavBar from '@/packages/common/components/NavBar/NavBar';
import { useEffect, useState } from 'react';
import i18n from '@/i18n';
import Spinner from '@/packages/common/components/Spinner';
import Footer from '@/packages/common/components/Footer';

type ClientLayoutProps = {
  children: React.ReactNode;
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        await i18n.loadNamespaces('translation');
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading translations:', error);
        setIsLoading(false);
      }
    };

    loadTranslations();
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return <Spinner className="min-h-screen" />;
  }

  return (
    <BaseProvider>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50">
          <NavBar />
        </header>
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </BaseProvider>
  );
}
