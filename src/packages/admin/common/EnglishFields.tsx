'use client';

import type { ReactNode } from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

/**
 * The optional English version of an admin form's texts, grouped under one heading.
 * Empty English fields mean the Arabic text is shown to English visitors.
 */
export function EnglishSection({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  return (
    <fieldset className="mb-6 rounded-xl border border-dashed border-gray-300 p-4">
      <legend className="px-2 text-sm font-semibold text-gray-700 md:text-base">{t('admin.common.english.section')}</legend>
      <p className="mb-4 text-sm text-gray-500">{t('admin.common.english.hint')}</p>
      {children}
    </fieldset>
  );
}

type EnglishInputProps = {
  id: string;
  name: string;
  control: Control<any>;
  /** The Arabic field's label; shown as «<label> بالإنجليزية». */
  label: string;
  error?: FieldError;
  /** A textarea with this many rows; a one-line input when absent. */
  rows?: number;
};

/** A left-to-right text input (or textarea) for the English value of a field. */
export function EnglishInput({ id, name, control, label, error, rows }: EnglishInputProps) {
  const { t } = useTranslation();
  const className = `w-full rounded-lg border px-3 py-2 text-left text-sm transition focus:ring-2 focus:ring-blue-200 md:text-base ${
    error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
  }`;

  return (
    <div className="mb-5">
      <label className="mb-1 block text-start text-sm font-medium text-gray-700 md:text-base" htmlFor={id}>
        {t('admin.common.english.label', { label })}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          rows ? (
            <textarea id={id} dir="ltr" lang="en" rows={rows} {...field} value={field.value ?? ''} className={className} />
          ) : (
            <input id={id} type="text" dir="ltr" lang="en" {...field} value={field.value ?? ''} className={className} />
          )
        }
      />
      {error && <span className="mt-1 block text-sm text-red-500">{error.message as string}</span>}
    </div>
  );
}
