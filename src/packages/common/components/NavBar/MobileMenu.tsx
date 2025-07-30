import { TFunction } from 'i18next';
import React, { useEffect } from 'react';
import Image from 'next/image';
import NavigationItems from './NavigationItems';

type MobileMenuProps = {
  t: TFunction<'translation', undefined>;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
};

export default function MobileMenu({ t, isMobileMenuOpen, setIsMobileMenuOpen }: MobileMenuProps) {
  // Empêcher le scroll du body quand le menu est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup quand le composant est démonté
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Menu mobile qui slide depuis la droite */}
      <div
        className={`fixed top-0 right-0 z-60 h-full w-80 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header du menu mobile */}
          <div className="flex items-center justify-between border-b border-gray-200 p-2">
            <div className="flex items-center">
              <Image src="/assets/images/logo.png" alt="Municipality Logo" width={64} height={64} className="object-contain" />
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Contenu du menu */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-6">
              <NavigationItems t={t} setIsMobileMenuOpen={setIsMobileMenuOpen} isMobile={true} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
