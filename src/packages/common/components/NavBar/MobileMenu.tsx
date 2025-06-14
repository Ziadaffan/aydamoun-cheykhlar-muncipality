import { TFunction } from "i18next";
import React from "react";
import NavigationItems from "./NavigationItems";

type MobileMenuProps = {
  t: TFunction<"translation", undefined>;
  isMobileMenuOpen: boolean;
  isMobileMunicipalityOpen: boolean;
  setIsMobileMunicipalityOpen: (isOpen: boolean) => void;
  isMobileCouncilOpen: boolean;
  setIsMobileCouncilOpen: (isOpen: boolean) => void;
};

export default function MobileMenu({
  t,
  isMobileMenuOpen,
  isMobileMunicipalityOpen,
  setIsMobileMunicipalityOpen,
  isMobileCouncilOpen,
  setIsMobileCouncilOpen,
}: MobileMenuProps) {
  return (
    <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden`}>
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
        <NavigationItems
          t={t}
          isMobile={true}
          isMobileMunicipalityOpen={isMobileMunicipalityOpen}
          isMobileCouncilOpen={isMobileCouncilOpen}
          setIsMobileMunicipalityOpen={setIsMobileMunicipalityOpen}
          setIsMobileCouncilOpen={setIsMobileCouncilOpen}
        />
      </div>
    </div>
  );
}
