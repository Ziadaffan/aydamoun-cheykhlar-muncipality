'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Set once the visitor has moved between pages inside the site (client-side navigation).
// A page opened from a shared link, a bookmark or a fresh tab has nothing of ours to go back to.
let navigatedInApp = false;

/** True when `router.back()` would land on another page of this site. */
export const hasInAppHistory = (): boolean => navigatedInApp;

/** Mount once near the root: records client-side navigations for `hasInAppHistory`. */
export function useTrackInAppHistory() {
  const pathname = usePathname();
  const first = useRef<string | null>(null);

  useEffect(() => {
    if (first.current === null) {
      first.current = pathname;
      return;
    }
    navigatedInApp = true;
  }, [pathname]);
}
