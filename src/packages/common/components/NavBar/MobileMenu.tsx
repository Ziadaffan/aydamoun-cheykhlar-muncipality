'use client';

import { TFunction } from 'i18next';
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useAuth } from '../../hooks/useAuth';
import LanguageSwitcher from './LanguageSwitcher';
import NavLink from './NavLink';
import ThemeSwitcher from './ThemeSwitcher';
import { ACCOUNT_ITEMS, ADMIN_ITEMS, MORE_ITEMS, NavItem, PRIMARY_ITEMS } from './navItems';

type MobileMenuProps = {
  t: TFunction<'translation', undefined>;
  isOpen: boolean;
  onClose: () => void;
};

function Section({ title, items, t, onClose }: { title?: string; items: NavItem[]; t: MobileMenuProps['t']; onClose: () => void }) {
  return (
    <div className="py-2">
      {title && <div className="px-3 pb-1 text-xs font-bold tracking-wide text-gray-400 uppercase">{title}</div>}
      {items.map(item => (
        <NavLink key={item.href} href={item.href} variant="menu" onNavigate={onClose}>
          {t(item.labelKey)}
        </NavLink>
      ))}
    </div>
  );
}

/** Drawer from the reading start (right in Arabic, left in English), grouped like the desktop menus. */
export default function MobileMenu({ t, isOpen, onClose }: MobileMenuProps) {
  const { role, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);
  const isAdmin = role === 'ADMIN';

  // Navigating (incl. browser back) closes the drawer.
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  return (
    <div className="lg:hidden">
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('navigation.main.menu')}
        aria-hidden={!isOpen}
        className={`fixed top-0 start-0 z-60 flex h-full w-80 max-w-[85vw] flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'invisible rtl:translate-x-full ltr:-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
          <Link href="/" onClick={onClose} aria-label={t('navigation.main.home')}>
            <Image src="/assets/images/logo.png" alt="" width={52} height={52} className="object-contain" />
          </Link>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t('navigation.main.closeMenu')}
            className="cursor-pointer rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 divide-y divide-gray-100 overflow-y-auto px-3 py-2">
          <Section items={PRIMARY_ITEMS} t={t} onClose={onClose} />
          <Section title={t('navigation.main.more')} items={MORE_ITEMS} t={t} onClose={onClose} />
          {isAdmin && <Section title={t('navigation.main.admin')} items={ADMIN_ITEMS} t={t} onClose={onClose} />}

          <div className="py-2">
            <div className="px-3 pb-1 text-xs font-bold tracking-wide text-gray-400 uppercase">{t('navigation.main.account')}</div>
            {isAuthenticated ? (
              <>
                {ACCOUNT_ITEMS.map(item => (
                  <NavLink key={item.href} href={item.href} variant="menu" onNavigate={onClose}>
                    {t(item.labelKey)}
                  </NavLink>
                ))}
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-start text-[15px] text-red-700 hover:bg-red-50"
                >
                  {t('navigation.main.logout')}
                </button>
              </>
            ) : (
              <>
                <NavLink href="/auth/login" variant="menu" onNavigate={onClose}>
                  {t('navigation.main.login')}
                </NavLink>
                <NavLink href="/auth/signup" variant="menu" onNavigate={onClose}>
                  {t('navigation.main.signup')}
                </NavLink>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3 px-3 py-4">
            <LanguageSwitcher isMobile onChange={onClose} />
            <ThemeSwitcher isMobile />
          </div>
        </div>
      </div>
    </div>
  );
}
