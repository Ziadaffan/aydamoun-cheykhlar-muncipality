import { useTranslation } from 'react-i18next';
import MainNavigation from './MainNavigation';

export default function NavBar() {
  const { t } = useTranslation();

  return (
    <div>
      <MainNavigation t={t} />
    </div>
  );
}
