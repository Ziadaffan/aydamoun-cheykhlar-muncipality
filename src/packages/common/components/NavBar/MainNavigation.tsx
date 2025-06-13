import Link from "next/link";
import { TFunction } from "i18next";

type MainNavigationProps = {
  t: TFunction<"translation", undefined>;
};

export default function MainNavigation({ t }: MainNavigationProps) {
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/contact" className="text-gray-700 hover:text-blue-800">
              {t("navigation.main.contact")}
            </Link>
            <Link
              href="/actualites"
              className="text-gray-700 hover:text-blue-800"
            >
              {t("navigation.main.news")}
            </Link>

            <Link
              href="/services"
              className="text-gray-700 hover:text-blue-800"
            >
              {t("navigation.main.services")}
            </Link>
            <Link href="/" className="text-gray-700 hover:text-blue-800">
              {t("navigation.main.home")}
            </Link>
          </div>

          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-800">
                {t("navigation.main.logo")}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
