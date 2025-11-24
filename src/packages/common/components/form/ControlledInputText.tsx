'use client';

import React from 'react';
import { Control, Controller, FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

interface ControlledInputTextProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'datetime-local' | 'date';
  placeholder?: string;
  control: Control<any>;
  name: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function ControlledInputText({
  id,
  label,
  type = 'text',
  placeholder,
  control,
  name,
  error,
  className = '',
  disabled = false,
  required = false,
}: ControlledInputTextProps) {
  return (
    <div className="mb-5">
      <label className="mb-1 block text-right text-sm font-medium text-gray-700 md:text-base" htmlFor={id}>
        {label}
        {required && <span className="mr-1 text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            {...field}
            className={`w-full rounded-lg border px-3 py-2 text-right text-sm transition focus:ring-2 focus:ring-blue-200 md:text-base ${
              error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
            } ${disabled ? 'cursor-not-allowed bg-gray-100' : ''} ${className}`}
          />
        )}
      />
      {error && <span className="mt-1 block text-sm text-red-500">{error.message as string}</span>}
    </div>
  );
}
