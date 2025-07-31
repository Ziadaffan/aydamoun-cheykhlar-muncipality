import React from 'react';
import { Control, Controller, FieldError, RegisterOptions } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface ControlledSelectProps {
  name: string;
  control: Control<any>;
  label: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  error?: FieldError;
  className?: string;
  rules?: RegisterOptions;
}

export default function ControlledSelect({
  name,
  control,
  label,
  options,
  placeholder,
  required = false,
  error,
  className = '',
  rules,
}: ControlledSelectProps) {
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
          <select
            value={value || ''}
            onChange={onChange}
            className={`w-full rounded-lg border px-4 py-2.5 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">{placeholder || 'اختر...'}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
