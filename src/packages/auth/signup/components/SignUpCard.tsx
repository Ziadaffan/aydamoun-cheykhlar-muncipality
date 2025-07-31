'use client';

import { ReactNode } from 'react';

type SignUpCardProps = {
  children: ReactNode;
};

export default function SignUpCard({ children }: SignUpCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="mx-2 w-full max-w-xs rounded-2xl bg-white p-6 shadow-xl md:max-w-md md:p-10">
        {children}
      </div>
    </div>
  );
} 