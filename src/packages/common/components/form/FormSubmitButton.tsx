import React from 'react';
import { Loader2 } from 'lucide-react';

interface FormSubmitButtonProps {
  isSubmitting: boolean;
  isDirty?: boolean;
  isValid?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export default function FormSubmitButton({
  isSubmitting,
  isDirty = true,
  isValid = true,
  children = 'إرسال',
  className = '',
}: FormSubmitButtonProps) {
  const isDisabled = isSubmitting || !isDirty || !isValid;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base ${className}`}
    >
      {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
