import { TFunction } from "i18next";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import MobileMenuButoon from "./MobileMenuButoon";
import MobileMenu from "./MobileMenu";
import NavigationItems from "./NavigationItems";

type MainNavigationProps = {
  t: TFunction<"translation", undefined>;
};

export default function MainNavigation({ t }: MainNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMunicipalityOpen, setIsMobileMunicipalityOpen] = useState(false);
  const [isMobileCouncilOpen, setIsMobileCouncilOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 bg-gradient-to-r from-blue-200 to-blue-300 border-t-2 border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/assets/images/logo.png"
                alt="Municipality Logo"
                width={80}
                height={80}
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationItems t={t} />
          </div>

          <MobileMenuButoon isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu
        t={t}
        isMobileMenuOpen={isMobileMenuOpen}
        isMobileMunicipalityOpen={isMobileMunicipalityOpen}
        setIsMobileMunicipalityOpen={setIsMobileMunicipalityOpen}
        isMobileCouncilOpen={isMobileCouncilOpen}
        setIsMobileCouncilOpen={setIsMobileCouncilOpen}
      />
    </nav>
  );
}
