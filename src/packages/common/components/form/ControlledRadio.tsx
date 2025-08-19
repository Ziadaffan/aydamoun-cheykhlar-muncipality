import React from 'react';
import { Control, Controller, FieldError, RegisterOptions } from 'react-hook-form';

interface ControlledRadioProps {
  name: string;
  control: Control<any>;
  label: string;
  options: string[];
  required?: boolean;
  error?: FieldError;
  className?: string;
  rules?: RegisterOptions;
}

export default function ControlledRadio({ name, control, label, options, required = false, error, className = '', rules }: ControlledRadioProps) {
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
          <div className="space-y-2">
            {options.map(option => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  value={option}
                  checked={value === option}
                  onChange={onChange}
                  className="mr-2 ml-2 h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
