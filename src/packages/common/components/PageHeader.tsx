import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  /** One warm sentence under the title. */
  subtitle?: string;
  /** Optional extra line or actions under the subtitle. */
  children?: ReactNode;
  className?: string;
};

/** The one header for every public list page: big title, a friendly sentence under it. */
export default function PageHeader({ title, subtitle, children, className = '' }: PageHeaderProps) {
  return (
    <header className={`mb-10 text-center md:mb-12 ${className}`}>
      <h1 className="mb-4 text-4xl font-bold text-gray-800 md:text-5xl">{title}</h1>
      {subtitle && <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl">{subtitle}</p>}
      {children}
    </header>
  );
}
