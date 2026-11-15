'use client';

import React from 'react';
import { Control, Controller, FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

interface ControlledTextAreaProps {
  id: string;
  label: string;
  placeholder?: string;
  rows?: number;
  control: Control<any>;
  name: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  /** Text direction of the value, e.g. 'ltr' for an English-version field on the Arabic admin. Defaults to the page's direction. */
  dir?: 'ltr' | 'rtl' | 'auto';
}

export default function ControlledTextArea({
  id,
  label,
  placeholder,
  rows = 3,
  control,
  name,
  error,
  className = '',
  disabled = false,
  required = false,
  dir,
}: ControlledTextAreaProps) {
  return (
    <div className="mb-5">
      <label className="mb-1 block text-start text-sm font-medium text-gray-700 md:text-base" htmlFor={id}>
        {label}
        {required && <span className="ms-1 text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <textarea
            id={id}
            rows={rows}
            placeholder={placeholder}
            disabled={disabled}
            dir={dir}
            {...field}
            className={`w-full rounded-lg border px-3 py-2 text-start text-sm transition focus:ring-2 focus:ring-blue-200 md:text-base ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              } ${disabled ? 'cursor-not-allowed bg-gray-100' : ''} ${className}`}
          />
        )}
      />
      {error && <span className="mt-1 block text-sm text-red-500">{error.message as string}</span>}
    </div>
  );
}
