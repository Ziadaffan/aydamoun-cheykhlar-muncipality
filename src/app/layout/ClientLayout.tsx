"use client";

import BaseProvider from "@/app/providers/BaseProvider";
import NavBar from "@/packages/common/components/NavBar/NavBar";
import { useEffect, useState } from "react";
import i18n from "@/i18n";
import Spinner from "@/packages/common/components/Spinner";

type ClientLayoutProps = {
  children: React.ReactNode;
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        await i18n.loadNamespaces("translation");
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading translations:", error);
        setIsLoading(false);
      }
    };

    loadTranslations();
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <BaseProvider>
      <header>
        <NavBar />
      </header>
      <main>{children}</main>
    </BaseProvider>
  );
}
