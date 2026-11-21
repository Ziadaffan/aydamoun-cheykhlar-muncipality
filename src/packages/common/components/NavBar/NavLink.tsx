'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { isActive } from './navItems';

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  /** 'bar': a top-level link in the desktop bar; 'menu': a row in a dropdown or the mobile drawer. */
  variant?: 'bar' | 'menu';
  onNavigate?: () => void;
};

export default function NavLink({ href, children, variant = 'bar', onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const active = isActive(pathname, href);

  const classes =
    variant === 'bar'
      ? `rounded-full px-3 py-2 text-[15px] font-semibold whitespace-nowrap transition-colors duration-150 ${
          active ? 'bg-white/80 text-blue-900 shadow-sm' : 'text-gray-800 hover:bg-white/50 hover:text-blue-900'
        }`
      : `flex w-full items-center rounded-lg px-3 py-2.5 text-start text-[15px] transition-colors duration-150 ${
          active ? 'bg-blue-50 font-semibold text-blue-900' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-900'
        }`;

  return (
    <Link href={href} onClick={onNavigate} aria-current={active ? 'page' : undefined} className={classes}>
      {children}
    </Link>
  );
}
