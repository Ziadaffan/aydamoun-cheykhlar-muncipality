'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import NavLink from './NavLink';

export default function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (!session) {
    return (
      <div className="flex items-center space-x-4 space-x-reverse">
        <NavLink href="/auth/login">تسجيل الدخول</NavLink>
        <NavLink href="/auth/signup">إنشاء حساب</NavLink>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 space-x-reverse rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-medium text-white">
          {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <span className="hidden text-gray-700 md:block">{session.user?.name || session.user?.email}</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 z-50 mt-2 w-48 rounded-md border bg-white py-1 shadow-lg">
          <div className="border-b px-4 py-2 text-sm text-gray-700">
            <div className="font-medium">{session.user?.name}</div>
            <div className="text-gray-500">{session.user?.email}</div>
          </div>

          <NavLink href="/profile" setIsMobileMenuOpen={() => setIsOpen(false)}>
            الملف الشخصي
          </NavLink>

          <button onClick={handleLogout} className="block w-full px-4 py-2 text-right text-sm text-gray-700 transition-colors hover:bg-gray-100">
            تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );
}
