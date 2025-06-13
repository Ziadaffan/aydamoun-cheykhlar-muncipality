import Link from "next/link";
import { TFunction } from "i18next";

type TopNavigationProps = {
  t: TFunction<"translation", undefined>;
};

export default function TopNavigation({ t }: TopNavigationProps) {
  return (
    <nav className="py-2 bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="flex justify-center max-w-7xl mx-auto px-4">
        <div className="flex justify-end items-center space-x-6">
          <Link
            href="/accessibilite"
            className="text-sm text-gray-600 hover:text-blue-800"
          >
            {t("navigation.utility.accessibility")}
          </Link>
          <Link
            href="/mentions-legales"
            className="text-sm text-gray-600 hover:text-blue-800"
          >
            {t("navigation.utility.legal")}
          </Link>
          <Link
            href="/plan-du-site"
            className="text-sm text-gray-600 hover:text-blue-800"
          >
            {t("navigation.utility.sitemap")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
