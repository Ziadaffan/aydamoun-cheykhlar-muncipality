import { TFunction } from "i18next";
import NavLink from "./NavLink";

type NavigationItemsProps = {
  t: TFunction<"translation", undefined>;
};

export default function NavigationItems({ t }: NavigationItemsProps) {
  return (
    <>
      <NavLink href="/">{t("navigation.main.home")}</NavLink>

      <NavLink href="/about-us">{t("navigation.main.aboutUs")}</NavLink>

      <NavLink href="/services">{t("navigation.main.services")}</NavLink>

      <NavLink href="/news">{t("navigation.main.news")}</NavLink>

      <NavLink href="/documents">{t("navigation.main.documents")}</NavLink>

      <NavLink href="/guide">{t("navigation.main.guide")}</NavLink>

      <NavLink href="/contact-us">{t("navigation.main.contactUs")}</NavLink>
    </>
  );
}
