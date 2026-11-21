import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** Optional call to action under the text (a link or button). */
  action?: ReactNode;
};

/** The one "nothing here" look for every list on the site (the jobs page's design). */
export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="py-12 text-center">
      <Icon className="mx-auto mb-4 h-24 w-24 text-gray-400" strokeWidth={1} aria-hidden="true" />
      <h3 className="mb-2 text-lg font-medium text-gray-900">{title}</h3>
      {description && <p className="mx-auto max-w-md text-gray-500">{description}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
