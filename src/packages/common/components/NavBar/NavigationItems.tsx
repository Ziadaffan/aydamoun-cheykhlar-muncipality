import { TFunction } from 'i18next';
import NavLink from './NavLink';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from 'next-auth/react';

type NavigationItemsProps = {
  t: TFunction<'translation', undefined>;
  setIsMobileMenuOpen?: (isOpen: boolean) => void;
};

export default function NavigationItems({ t, setIsMobileMenuOpen }: NavigationItemsProps) {
  const { role, isAuthenticated } = useAuth();
  console.log(isAuthenticated);

  const isAdmin = role === 'ADMIN';

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex flex-nowrap items-center space-x-4 overflow-x-auto">
      <NavLink href="/" setIsMobileMenuOpen={setIsMobileMenuOpen}>
        {t('navigation.main.home')}
      </NavLink>

      <NavLink href="/about-us" setIsMobileMenuOpen={setIsMobileMenuOpen}>
        {t('navigation.main.aboutUs')}
      </NavLink>

      {isAuthenticated && (
        <NavLink href="/services" setIsMobileMenuOpen={setIsMobileMenuOpen}>
          {t('navigation.main.services')}
        </NavLink>
      )}
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
      {isAuthenticated && (
        <>
          <NavLink href="/profile" setIsMobileMenuOpen={setIsMobileMenuOpen}>
            {t('navigation.main.profile')}
          </NavLink>
          <button
            onClick={handleLogout}
            className="relative inline-block cursor-pointer px-4 py-2 text-sm whitespace-nowrap text-gray-700 transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-blue-800 after:transition-transform after:duration-300 after:content-[''] hover:text-blue-800 hover:after:origin-bottom-left hover:after:scale-x-100"
          >
            {t('navigation.main.logout')}
          </button>
        </>
      )}

      {!isAuthenticated && (
        <>
          <NavLink href="/auth/login" setIsMobileMenuOpen={setIsMobileMenuOpen}>
            {t('navigation.main.login')}
          </NavLink>
          <NavLink href="/auth/signup" setIsMobileMenuOpen={setIsMobileMenuOpen}>
            {t('navigation.main.signup')}
          </NavLink>
        </>
      )}
    </div>
  );
}
