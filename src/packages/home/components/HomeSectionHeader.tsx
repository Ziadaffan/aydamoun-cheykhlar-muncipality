import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

type HomeSectionHeaderProps = {
  title: string;
  /** Optional "view all" link shown opposite the title. */
  action?: { label: string; href: string; ariaLabel?: string };
};

export default function HomeSectionHeader({ title, action }: HomeSectionHeaderProps) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h2 className="mb-3 text-3xl font-bold text-gray-800 md:text-4xl">{title}</h2>
        <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
      </div>
      {action && (
        <Link
          href={action.href}
          aria-label={action.ariaLabel}
          className="flex items-center gap-1 font-bold text-blue-600 transition-colors hover:text-blue-800"
        >
          {action.label}
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
