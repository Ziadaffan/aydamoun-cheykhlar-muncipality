"use client";

import BaseProvider from "@/app/providers/BaseProvider";
import NavBar from "@/packages/common/components/NavBar/NavBar";
import { useEffect, useState } from "react";

type ClientLayoutProps = {
  children: React.ReactNode;
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
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
