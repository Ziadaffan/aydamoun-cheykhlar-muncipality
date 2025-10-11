import { TFunction } from 'i18next';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import MobileMenuButoon from './MobileMenuButoon';
import MobileMenu from './MobileMenu';
import NavigationItems from './NavigationItems';
import { CldImage } from 'next-cloudinary';

type MainNavigationProps = {
  t: TFunction<'translation', undefined>;
};

export default function MainNavigation({ t }: MainNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white bg-gradient-to-r from-green-200 to-blue-300 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-23 justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex flex-shrink-0 items-center">
              <CldImage src="logo_smzpb2" alt="Municipality Logo" width={80} height={80} className="object-contain" priority />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center lg:flex">
            <NavigationItems t={t} />
          </div>

          <MobileMenuButoon isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu t={t} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
    </nav>
  );
}
