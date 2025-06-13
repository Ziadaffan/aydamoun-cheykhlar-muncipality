import { useTranslation } from "react-i18next";
import TopNavigation from "./TopNavigation";
import MainNavigation from "./MainNavigation";

export default function NavBar() {
  const { t } = useTranslation();

  return (
    <div>
      <TopNavigation t={t} />
      <MainNavigation t={t} />
    </div>
  );
}
