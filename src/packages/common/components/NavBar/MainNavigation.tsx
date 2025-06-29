import { TFunction } from 'i18next';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import MobileMenuButoon from './MobileMenuButoon';
import MobileMenu from './MobileMenu';
import NavigationItems from './NavigationItems';

type MainNavigationProps = {
  t: TFunction<'translation', undefined>;
};

export default function MainNavigation({ t }: MainNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white bg-gradient-to-r from-green-200 to-blue-300 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex flex-shrink-0 items-center">
              <Image src="/assets/images/logo.png" alt="Municipality Logo" width={80} height={80} className="object-contain" priority />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 lg:flex">
            <NavigationItems t={t} />
          </div>

          <MobileMenuButoon isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu t={t} isMobileMenuOpen={isMobileMenuOpen} />
    </nav>
  );
}
