import Link from "next/link";
import { TFunction } from "i18next";
import Image from "next/image";
import { useState } from "react";

type MainNavigationProps = {
  t: TFunction<"translation", undefined>;
};

export default function MainNavigation({ t }: MainNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/assets/images/logo.png"
                alt="Municipality Logo"
                width={85}
                height={85}
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/actualites"
              className="text-gray-700 hover:text-blue-800 font-medium transition-colors duration-200 relative group"
            >
              {t("navigation.main.news")}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-800 transition-all duration-200 group-hover:w-full"></span>
            </Link>

            <Link
              href="/services"
              className="text-gray-700 hover:text-blue-800 font-medium transition-colors duration-200 relative group"
            >
              {t("navigation.main.services")}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-800 transition-all duration-200 group-hover:w-full"></span>
            </Link>

            <Link
              href="/contact"
              className="text-gray-700 hover:text-blue-800 font-medium transition-colors duration-200 relative group"
            >
              {t("navigation.main.contact")}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-800 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-800"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <Link
            href="/actualites"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-gray-50 transition-colors duration-200"
          >
            {t("navigation.main.news")}
          </Link>
          <Link
            href="/services"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-gray-50 transition-colors duration-200"
          >
            {t("navigation.main.services")}
          </Link>
          <Link
            href="/contact"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-gray-50 transition-colors duration-200"
          >
            {t("navigation.main.contact")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
