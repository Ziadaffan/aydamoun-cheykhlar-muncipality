import { TFunction } from 'i18next';
import NavLink from './NavLink';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from 'next-auth/react';

type NavigationItemsProps = {
  t: TFunction<'translation', undefined>;
  setIsMobileMenuOpen?: (isOpen: boolean) => void;
  isMobile?: boolean;
};

export default function NavigationItems({ t, setIsMobileMenuOpen, isMobile = false }: NavigationItemsProps) {
  const { role, isAuthenticated } = useAuth();

  const isAdmin = role === 'ADMIN';

  const handleLogout = async () => {
    await signOut();
  };

  const containerClasses = isMobile ? 'flex flex-col space-y-4' : 'flex flex-nowrap items-center space-x-4 overflow-x-auto';

  const linkClasses = isMobile
    ? 'block w-full px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-gray-50 rounded-md transition-colors duration-200'
    : '';

  return (
    <div className={containerClasses}>
      <NavLink href="/" setIsMobileMenuOpen={setIsMobileMenuOpen} additionalClasses={linkClasses}>
        {t('navigation.main.home')}
      </NavLink>

      <NavLink href="/about-us" setIsMobileMenuOpen={setIsMobileMenuOpen} additionalClasses={linkClasses}>
        {t('navigation.main.aboutUs')}
      </NavLink>

      <NavLink href="/services" setIsMobileMenuOpen={setIsMobileMenuOpen} additionalClasses={linkClasses}>
        {t('navigation.main.services')}
      </NavLink>

      <NavLink href="/news" setIsMobileMenuOpen={setIsMobileMenuOpen} additionalClasses={linkClasses}>
        {t('navigation.main.news')}
      </NavLink>

      <NavLink href="/documents" setIsMobileMenuOpen={setIsMobileMenuOpen} additionalClasses={linkClasses}>
        {t('navigation.main.documents')}
      </NavLink>

      <NavLink href="/jobs" setIsMobileMenuOpen={setIsMobileMenuOpen} additionalClasses={linkClasses}>
        {t('navigation.main.emplois')}
      </NavLink>

      {isAuthenticated && (
        <>
          <NavLink href="/profile" setIsMobileMenuOpen={setIsMobileMenuOpen} additionalClasses={linkClasses}>
            {t('navigation.main.profile')}
          </NavLink>
          <button
            onClick={handleLogout}
            className={
              isMobile
                ? 'block w-full rounded-md px-4 py-3 text-right text-base font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 hover:text-blue-800'
                : "text-md relative inline-block cursor-pointer px-4 py-2 text-lg font-medium whitespace-nowrap text-gray-700 transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-blue-800 after:transition-transform after:duration-300 after:content-[''] hover:text-blue-800 hover:after:origin-bottom-left hover:after:scale-x-100"
            }
          >
            {t('navigation.main.logout')}
          </button>
        </>
      )}

      {!isAuthenticated && (
        <>
          <NavLink href="/auth/login" setIsMobileMenuOpen={setIsMobileMenuOpen} additionalClasses={linkClasses}>
            {t('navigation.main.login')}
          </NavLink>
          <NavLink href="/auth/signup" setIsMobileMenuOpen={setIsMobileMenuOpen} additionalClasses={linkClasses}>
            {t('navigation.main.signup')}
          </NavLink>
        </>
      )}
    </div>
  );
}
