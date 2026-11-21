'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect, useId, useRef, useState } from 'react';

type NavDropdownProps = {
  /** The button's content (text, or an avatar for the account menu). */
  label: React.ReactNode;
  /** Spoken name when the label isn't plain text. */
  ariaLabel?: string;
  /** Highlights the button while one of its pages is open. */
  active?: boolean;
  /** Which edge the panel lines up with: 'start' under the button's start, 'end' for menus at the bar's end. */
  align?: 'start' | 'end';
  children: (close: () => void) => React.ReactNode;
};

/** Click-to-open menu: closes on outside click, Escape and navigation. */
export default function NavDropdown({ label, ariaLabel, active = false, align = 'start', children }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="relative" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={ariaLabel}
        onClick={() => setOpen(value => !value)}
        className={`inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-2 text-[15px] font-semibold whitespace-nowrap transition-colors duration-150 ${
          active || open ? 'bg-white/80 text-blue-900 shadow-sm' : 'text-gray-800 hover:bg-white/50 hover:text-blue-900'
        }`}
      >
        {label}
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div
          id={panelId}
          className={`absolute top-full z-50 mt-2 w-60 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl ${
            align === 'end' ? 'end-0' : 'start-0'
          }`}
        >
          {children(close)}
        </div>
      )}
    </div>
  );
}
