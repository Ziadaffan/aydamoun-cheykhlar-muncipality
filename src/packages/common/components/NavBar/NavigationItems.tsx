import { TFunction } from 'i18next';
import NavLink from './NavLink';

type NavigationItemsProps = {
  t: TFunction<'translation', undefined>;
  setIsMobileMenuOpen?: (isOpen: boolean) => void;
};

export default function NavigationItems({ t, setIsMobileMenuOpen }: NavigationItemsProps) {
  return (
    <>
      <NavLink href="/" setIsMobileMenuOpen={setIsMobileMenuOpen}>
        {t('navigation.main.home')}
      </NavLink>

      <NavLink href="/about-us" setIsMobileMenuOpen={setIsMobileMenuOpen}>
        {t('navigation.main.aboutUs')}
      </NavLink>

      <NavLink href="/services" setIsMobileMenuOpen={setIsMobileMenuOpen}>
        {t('navigation.main.services')}
      </NavLink>

      <NavLink href="/news" setIsMobileMenuOpen={setIsMobileMenuOpen}>
        {t('navigation.main.news')}
      </NavLink>

      <NavLink href="/documents" setIsMobileMenuOpen={setIsMobileMenuOpen}>
        {t('navigation.main.documents')}
      </NavLink>

      <NavLink href="/guide" setIsMobileMenuOpen={setIsMobileMenuOpen}>
        {t('navigation.main.guide')}
      </NavLink>

      <NavLink href="/contact-us" setIsMobileMenuOpen={setIsMobileMenuOpen}>
        {t('navigation.main.contactUs')}
      </NavLink>
    </>
  );
}
