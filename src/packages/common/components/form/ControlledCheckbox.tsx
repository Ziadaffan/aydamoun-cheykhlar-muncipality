'use client';

import React from 'react';
import { Control, Controller, FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

interface ControlledCheckboxProps {
  id: string;
  label: string;
  control: Control<any>;
  name: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  className?: string;
  disabled?: boolean;
}

export default function ControlledCheckbox({ id, label, control, name, error, className = '', disabled = false }: ControlledCheckboxProps) {
  return (
    <div className="mb-5">
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ...field } }) => (
          <div className="flex items-center">
            <input
              id={id}
              type="checkbox"
              checked={value || false}
              onChange={onChange}
              disabled={disabled}
              {...field}
              className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-200 ${
                error ? 'border-red-300' : 'border-gray-300'
              } ${disabled ? 'cursor-not-allowed bg-gray-100' : ''} ${className}`}
            />
            <label htmlFor={id} className="mr-2 text-sm font-medium text-gray-700">
              {label}
            </label>
          </div>
        )}
      />
      {error && <span className="mt-1 block text-sm text-red-500">{error.message as string}</span>}
    </div>
  );
}
