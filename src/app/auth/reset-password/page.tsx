'use client';

import { Suspense } from 'react';
import ResetPasswordPage from '@/packages/auth/reset-password/ResetPasswordPage';
import Spinner from '@/packages/common/components/Spinner';

// useSearchParams() needs a Suspense boundary for static rendering.
export default function Page() {
  return (
    <Suspense fallback={<Spinner className="min-h-screen" />}>
      <ResetPasswordPage />
    </Suspense>
  );
}
