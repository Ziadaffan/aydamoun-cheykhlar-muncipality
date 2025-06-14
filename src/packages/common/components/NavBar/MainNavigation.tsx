import Link from "next/link";
import { TFunction } from "i18next";
import Image from "next/image";
import { useState } from "react";
import NavLink from "./NavLink";
import DropdownMenu from "./DropdownMenu";
import MobileMenuButoon from "./MobileMenuButoon";
import MobileMenu from "./MobileMenu";

type MainNavigationProps = {
  t: TFunction<"translation", undefined>;
};

export default function MainNavigation({ t }: MainNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMunicipalityOpen, setIsMobileMunicipalityOpen] = useState(false);
  const [isMobileCouncilOpen, setIsMobileCouncilOpen] = useState(false);

  const municipalityItems = [
    {
      href: "/municipality/mission",
      label: t("navigation.main.municipality.mission")
    },
    {
      href: "/municipality/purchases",
      label: t("navigation.main.municipality.purchases")
    },
    {
      href: "/municipality/official-transactions",
      label: t("navigation.main.municipality.officialTransactions")
    }
  ];

  const councilItems = [
    {
      href: "/council/members",
      label: t("navigation.main.council.actualMembers")
    },
    {
      href: "/council/membersCv",
      label: t("navigation.main.council.cvMunicipalCouncilMembers")
    },
    {
      href: "/council/previous",
      label: t("navigation.main.council.previousCouncils")
    }
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 bg-gradient-to-r from-blue-200 to-blue-300 border-t-2 border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/assets/images/logo.png"
                alt="Municipality Logo"
                width={85}
                height={85}
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <DropdownMenu
              isOpen={false}
              label={t("navigation.main.municipality.name")}
              items={municipalityItems}
              onToggle={() => {}}
            />

            <NavLink href="/president-news">
              {t("navigation.main.presidentNews")}
            </NavLink>

            <NavLink href="/advertisements">
              {t("navigation.main.advertisements")}
            </NavLink>

            <DropdownMenu
              isOpen={false}
              label={t("navigation.main.council.name")}
              items={councilItems}
              onToggle={() => {}}
            />

            <NavLink href="/development-projects">
              {t("navigation.main.developmentProjects")}
            </NavLink>
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
        municipalityItems={municipalityItems}
        councilItems={councilItems} 
      />
    </nav>
  );
}
