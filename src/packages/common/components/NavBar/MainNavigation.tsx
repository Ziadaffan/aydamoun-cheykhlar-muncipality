import { TFunction } from 'i18next';
import { useState } from 'react';
import Link from 'next/link';
import MobileMenuButton from './MobileMenuButton';
import MobileMenu from './MobileMenu';
import NavigationItems from './NavigationItems';
import { CldImage } from 'next-cloudinary';

type MainNavigationProps = {
  t: TFunction<'translation', undefined>;
};

export default function MainNavigation({ t }: MainNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-gradient-to-r from-green-200 to-blue-300 shadow-md">
      <div className="flex h-28 items-center justify-around px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <CldImage
              src="logo_smzpb2"
              alt="Municipality Logo"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden min-[1601px]:flex items-center">
            <NavigationItems t={t} />
          </div>

          {/* Mobile Button */}
          <MobileMenuButton
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
      </div>

      {/* Mobile menu */}
      <MobileMenu
        t={t}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
    </nav>
  );
}