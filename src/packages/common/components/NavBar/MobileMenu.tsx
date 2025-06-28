import { TFunction } from 'i18next';
import React from 'react';
import NavigationItems from './NavigationItems';

type MobileMenuProps = {
  t: TFunction<'translation', undefined>;
  isMobileMenuOpen: boolean;
};

export default function MobileMenu({ t, isMobileMenuOpen }: MobileMenuProps) {
  return (
    <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:hidden`}>
      <div className="space-y-1 bg-white px-2 pt-2 pb-3 shadow-lg sm:px-3">
        <NavigationItems t={t} />
      </div>
    </div>
  );
}
