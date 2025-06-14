import Link from "next/link";
import React from "react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  additionalClasses?: string;
}

export default function NavLink({
  href,
  children,
  additionalClasses,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`${additionalClasses} relative block px-4 py-2 text-sm text-gray-700 hover:text-blue-800 transition-colors duration-150 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-blue-800 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left`}
    >
      {children}
    </Link>
  );
}
