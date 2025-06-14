import { TFunction } from "i18next";
import React from "react";
import NavLink from "./NavLink";
import DropdownMenu from "./DropdownMenu";
import { DropdownItem } from "./DropdownMenu";

type MobileMenuProps = {
  t: TFunction<"translation", undefined>;
  isMobileMenuOpen: boolean;
  isMobileMunicipalityOpen: boolean;
  setIsMobileMunicipalityOpen: (isMobileMunicipalityOpen: boolean) => void;
  isMobileCouncilOpen: boolean;
  setIsMobileCouncilOpen: (isMobileCouncilOpen: boolean) => void;
  municipalityItems: DropdownItem[];
  councilItems: DropdownItem[];
};

export default function MobileMenu({
  t,
  isMobileMenuOpen,
  isMobileMunicipalityOpen,
  setIsMobileMunicipalityOpen,
  isMobileCouncilOpen,
  setIsMobileCouncilOpen,
  municipalityItems,
  councilItems,
}: MobileMenuProps) {
  return (
    <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden`}>
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
        <DropdownMenu
          isOpen={isMobileMunicipalityOpen}
          label={t("navigation.main.municipality.name")}
          items={municipalityItems}
          onToggle={() =>
            setIsMobileMunicipalityOpen(!isMobileMunicipalityOpen)
          }
          isMobile
        />

        <NavLink href="/president-news">
          {t("navigation.main.presidentNews")}
        </NavLink>

        <NavLink href="/advertisements">
          {t("navigation.main.advertisements")}
        </NavLink>

        <DropdownMenu
          isOpen={isMobileCouncilOpen}
          label={t("navigation.main.council.name")}
          items={councilItems}
          onToggle={() => setIsMobileCouncilOpen(!isMobileCouncilOpen)}
          isMobile
        />

        <NavLink href="/development-projects">
          {t("navigation.main.developmentProjects")}
        </NavLink>
      </div>
    </div>
  );
}
