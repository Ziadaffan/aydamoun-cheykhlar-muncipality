'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Which list item's modal is open, kept in the URL hash (`/jobs#<id>`), so a link to
 * one item (home, a shared URL, an old /jobs/<id> link) opens its modal on load.
 * Pass the loaded items; the hash is read once they arrive.
 */
export function useHashModal(items: ReadonlyArray<{ id: string }> | undefined) {
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id && items?.some(item => item.id === id)) {
      setOpenId(id);
      document.getElementById(id)?.scrollIntoView({ block: 'center' });
    }
  }, [items]);

  const open = useCallback((id: string) => {
    setOpenId(id);
    window.history.replaceState(window.history.state, '', `#${encodeURIComponent(id)}`);
  }, []);

  const close = useCallback(() => {
    setOpenId(null);
    window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
  }, []);

  return { openId, open, close };
}
