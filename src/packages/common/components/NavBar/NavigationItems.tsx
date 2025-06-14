import { TFunction } from "i18next";
import NavLink from "./NavLink";
import DropdownMenu from "./DropdownMenu";
import { DropdownItem } from "./DropdownMenu";

type NavigationItemsProps = {
  t: TFunction<"translation", undefined>;
  isMobile?: boolean;
  isMobileMunicipalityOpen?: boolean;
  isMobileCouncilOpen?: boolean;
  setIsMobileMunicipalityOpen?: (isOpen: boolean) => void;
  setIsMobileCouncilOpen?: (isOpen: boolean) => void;
};

export default function NavigationItems({
  t,
  isMobile = false,
  isMobileMunicipalityOpen = false,
  isMobileCouncilOpen = false,
  setIsMobileMunicipalityOpen,
  setIsMobileCouncilOpen,
}: NavigationItemsProps) {
  const municipalityItems: DropdownItem[] = [
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

  const councilItems: DropdownItem[] = [
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
    <>
      <NavLink href="/">
        {t("navigation.main.home")}
      </NavLink>

      <DropdownMenu
        isOpen={isMobile ? isMobileMunicipalityOpen : false}
        label={t("navigation.main.municipality.name")}
        items={municipalityItems}
        onToggle={() => setIsMobileMunicipalityOpen?.(!isMobileMunicipalityOpen)}
        isMobile={isMobile}
      />

      <NavLink href="/president-news">
        {t("navigation.main.presidentNews")}
      </NavLink>

      <NavLink href="/advertisements">
        {t("navigation.main.advertisements")}
      </NavLink>

      <DropdownMenu
        isOpen={isMobile ? isMobileCouncilOpen : false}
        label={t("navigation.main.council.name")}
        items={councilItems}
        onToggle={() => setIsMobileCouncilOpen?.(!isMobileCouncilOpen)}
        isMobile={isMobile}
      />

      <NavLink href="/development-projects">
        {t("navigation.main.developmentProjects")}
      </NavLink>
    </>
  );
} 