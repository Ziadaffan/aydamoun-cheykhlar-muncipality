'use client';

import React, { useState } from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface ControlledTagsInputProps {
  id: string;
  label: string;
  placeholder?: string;
  control: Control<any>;
  name: string;
  error?: FieldError;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function ControlledTagsInput({
  id,
  label,
  placeholder,
  control,
  name,
  error,
  className = '',
  disabled = false,
  required = false,
}: ControlledTagsInputProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent, tags: string[], onChange: (tags: string[]) => void) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue.trim(), tags, onChange);
    }
  };

  const handleAddTag = (tags: string[], onChange: (tags: string[]) => void) => {
    if (inputValue.trim()) {
      addTag(inputValue.trim(), tags, onChange);
    }
  };

  const addTag = (tag: string, tags: string[], onChange: (tags: string[]) => void) => {
    if (tag && !tags.includes(tag) && tags.length < 10) {
      onChange([...tags, tag]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string, tags: string[], onChange: (tags: string[]) => void) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="mb-5">
      <label className="mb-1 block text-start text-sm font-medium text-gray-700 md:text-base" htmlFor={id}>
        {label}
        {required && <span className="ms-1 text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value = [] } }) => (
          <div className="space-y-2">
            <div className="flex min-h-[40px] flex-wrap gap-2 rounded-lg border border-gray-300 p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
              {value.map((tag: string, index: number) => (
                <span key={index} className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-sm text-blue-800">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag, value, onChange)}
                    className="text-blue-600 hover:text-blue-800 focus:outline-none"
                    disabled={disabled}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                id={id}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => handleKeyDown(e, value, onChange)}
                onBlur={() => {
                  if (inputValue.trim()) {
                    addTag(inputValue.trim(), value, onChange);
                  }
                }}
                placeholder={value.length === 0 ? placeholder : ''}
                disabled={disabled}
                className={`min-w-[120px] flex-1 text-start text-sm outline-none md:text-base ${disabled ? 'cursor-not-allowed bg-gray-100' : ''}`}
              />
              {/* Bouton d'ajout pour mobile */}
              {inputValue.trim() && (
                <button
                  type="button"
                  onClick={() => handleAddTag(value, onChange)}
                  disabled={disabled || value.length >= 10}
                  className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {t('common.tags.add')}
                </button>
              )}
            </div>
            <div className="text-start text-xs text-gray-500">
              <span className="block sm:inline">{t('common.tags.count', { count: value.length, max: 10 })}</span>
              <span className="hidden sm:inline"> - </span>
              <span className="block sm:inline">{t('common.tags.hint')}</span>
              <span className="block sm:hidden">{t('common.tags.hintMobile')}</span>
            </div>
          </div>
        )}
      />
      {error && <span className="mt-1 block text-sm text-red-500">{error.message as string}</span>}
    </div>
  );
}
