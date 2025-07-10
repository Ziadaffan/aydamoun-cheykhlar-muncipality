import Link from 'next/link';
import React from 'react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  additionalClasses?: string;
  setIsMobileMenuOpen?: (isOpen: boolean) => void;
}

export default function NavLink({ href, children, additionalClasses, setIsMobileMenuOpen }: NavLinkProps) {
  const handleClick = () => {
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`${additionalClasses} relative block px-4 py-2 text-sm text-gray-700 transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-blue-800 after:transition-transform after:duration-300 after:content-[''] hover:text-blue-800 hover:after:origin-bottom-left hover:after:scale-x-100`}
    >
      {children}
    </Link>
  );
}
