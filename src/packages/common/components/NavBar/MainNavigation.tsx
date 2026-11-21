'use client';

import { TFunction } from 'i18next';
import { useCallback, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { CldImage } from 'next-cloudinary';
import { useAuth } from '../../hooks/useAuth';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';
import NavDropdown from './NavDropdown';
import NavLink from './NavLink';
import ThemeSwitcher from './ThemeSwitcher';
import { ACCOUNT_ITEMS, ADMIN_ITEMS, MORE_ITEMS, PRIMARY_ITEMS, anyActive } from './navItems';

type MainNavigationProps = {
  t: TFunction<'translation', undefined>;
};

/**
 * Desktop (lg+): logo · Home, News, Services, Announcements, More ▾ · Admin ▾, language, theme, account.
 * Smaller screens: logo and a menu button that opens the drawer.
 */
export default function MainNavigation({ t }: MainNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const pathname = usePathname();
  const { role, isAuthenticated, user } = useAuth();
  const isAdmin = role === 'ADMIN';
  const initial = (user?.name?.trim()?.[0] ?? user?.email?.[0] ?? '?').toUpperCase();

  return (
    <nav className="sticky top-0 z-40 w-full bg-gradient-to-r from-nav-start to-nav-end shadow-md" aria-label={t('navigation.main.menu')}>
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label={t('navigation.main.home')}>
          <CldImage src="logo_smzpb2" alt="" width={64} height={64} className="object-contain" priority />
        </Link>

        {/* Desktop */}
        <div className="hidden flex-1 items-center gap-1 lg:flex">
          {PRIMARY_ITEMS.map(item => (
            <NavLink key={item.href} href={item.href}>
              {t(item.labelKey)}
            </NavLink>
          ))}
          <NavDropdown label={t('navigation.main.more')} active={anyActive(pathname, MORE_ITEMS)}>
            {close =>
              MORE_ITEMS.map(item => (
                <NavLink key={item.href} href={item.href} variant="menu" onNavigate={close}>
                  {t(item.labelKey)}
                </NavLink>
              ))
            }
          </NavDropdown>
        </div>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          {isAdmin && (
            <NavDropdown label={t('navigation.main.admin')} active={anyActive(pathname, ADMIN_ITEMS)} align="end">
              {close =>
                ADMIN_ITEMS.map(item => (
                  <NavLink key={item.href} href={item.href} variant="menu" onNavigate={close}>
                    {t(item.labelKey)}
                  </NavLink>
                ))
              }
            </NavDropdown>
          )}

          <LanguageSwitcher />
          <ThemeSwitcher />

          {isAuthenticated ? (
            <NavDropdown
              align="end"
              ariaLabel={t('navigation.main.account')}
              active={anyActive(pathname, ACCOUNT_ITEMS)}
              label={
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-800 text-sm font-bold text-white" aria-hidden="true">
                  {initial}
                </span>
              }
            >
              {close => (
                <>
                  {(user?.name || user?.email) && (
                    <div className="mb-1 border-b border-gray-100 px-3 pt-1 pb-2">
                      <div className="truncate font-semibold text-gray-900">{user?.name}</div>
                      {user?.email && <div className="truncate text-sm text-gray-500">{user.email}</div>}
                    </div>
                  )}
                  {ACCOUNT_ITEMS.map(item => (
                    <NavLink key={item.href} href={item.href} variant="menu" onNavigate={close}>
                      {t(item.labelKey)}
                    </NavLink>
                  ))}
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-start text-[15px] text-red-700 transition-colors hover:bg-red-50"
                  >
                    {t('navigation.main.logout')}
                  </button>
                </>
              )}
            </NavDropdown>
          ) : (
            <>
              <NavLink href="/auth/login">{t('navigation.main.login')}</NavLink>
              <Link
                href="/auth/signup"
                className="rounded-full bg-blue-800 px-4 py-2 text-[15px] font-semibold whitespace-nowrap text-white shadow-sm transition-colors hover:bg-blue-900"
              >
                {t('navigation.main.signup')}
              </Link>
            </>
          )}
        </div>

        {/* Smaller screens */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-expanded={isMobileMenuOpen}
          aria-label={t('navigation.main.openMenu')}
          className="ms-auto inline-flex cursor-pointer items-center justify-center rounded-full p-2 text-gray-800 hover:bg-white/50 lg:hidden"
        >
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <MobileMenu t={t} isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </nav>
  );
}
