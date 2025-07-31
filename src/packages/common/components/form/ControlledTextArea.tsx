import React from 'react';
import { Control, Controller, FieldError, RegisterOptions } from 'react-hook-form';

interface ControlledTextAreaProps {
  name: string;
  control: Control<any>;
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: FieldError;
  className?: string;
  rows?: number;
  minLength?: number;
  maxLength?: number;
  rules?: RegisterOptions;
}

export default function ControlledTextArea({
  name,
  control,
  label,
  placeholder,
  required = false,
  error,
  className = '',
  rows = 4,
  minLength,
  maxLength,
  rules,
}: ControlledTextAreaProps) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <textarea
            rows={rows}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            minLength={minLength}
            maxLength={maxLength}
            className={`w-full rounded-lg border px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        )}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
