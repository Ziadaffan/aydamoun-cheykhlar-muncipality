import React from 'react';

interface DeleteButtonProps {
  onClick: () => void;
  isDeleting?: boolean;
  title?: string;
  className?: string;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick, isDeleting = false, title, className = '' }) => {
  const defaultTitle = isDeleting ? 'جاري الحذف...' : 'حذف';

  return (
    <button
      onClick={onClick}
      disabled={isDeleting}
      className={`rounded-md bg-red-100 p-2 text-red-600 transition-colors hover:bg-red-200 disabled:opacity-50 ${className}`}
      title={title || defaultTitle}
    >
      {isDeleting ? (
        <svg className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      )}
    </button>
  );
};
