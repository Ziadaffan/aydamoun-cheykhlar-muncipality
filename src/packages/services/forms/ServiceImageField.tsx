'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Control, Controller } from 'react-hook-form';
import { Camera, RefreshCw, Trash2 } from 'lucide-react';
import ServiceImageThumbnail from '@/packages/services/components/ServiceImageThumbnail';
import { isServiceImageValue } from '@/packages/services/utils/serviceFields';
import {
  downscaleServiceImage,
  ServiceImageUploadFailure,
  uploadServiceImage,
  type ServiceImageUploadError,
} from '@/packages/services/utils/serviceImageUpload';

type ServiceImageFieldProps = {
  id: string;
  name: string;
  control: Control<any>;
  label: string;
  required: boolean;
  error?: { message?: string };
  /** Told when an upload starts and ends, so the form waits for it before sending. */
  onUploadingChange?: (uploading: boolean) => void;
};

/**
 * An 'image' field: the chosen photo is shrunk and uploaded at once, and the field's
 * value becomes the public id the server answered with.
 */
export default function ServiceImageField({ id, name, control, label, required, error, onUploadingChange }: ServiceImageFieldProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<ServiceImageUploadError | null>(null);
  const uploading = progress !== null;

  const onUploadingChangeRef = useRef(onUploadingChange);
  useEffect(() => {
    onUploadingChangeRef.current = onUploadingChange;
  }, [onUploadingChange]);
  // Leaving the page mid-upload must not keep the form waiting.
  useEffect(() => () => onUploadingChangeRef.current?.(false), []);

  const pick = () => inputRef.current?.click();

  return (
    <div className="mb-5">
      <span className="mb-1 block text-start text-sm font-medium text-gray-700 md:text-base" id={`${id}-label`}>
        {label}
        {required && <span className="me-1 text-red-500">*</span>}
      </span>
      <Controller
        name={name}
        control={control}
        render={({ field: input }) => {
          const value = isServiceImageValue(input.value) ? input.value : null;

          const upload = async (file: File) => {
            setUploadError(null);
            setProgress(0);
            onUploadingChange?.(true);
            try {
              const image = await uploadServiceImage(await downscaleServiceImage(file), setProgress);
              input.onChange(image);
            } catch (failure) {
              setUploadError(failure instanceof ServiceImageUploadFailure ? failure.reason : 'failed');
            } finally {
              setProgress(null);
              onUploadingChange?.(false);
              input.onBlur();
            }
          };

          return (
            <div aria-labelledby={`${id}-label`} role="group">
              <input
                ref={inputRef}
                id={id}
                type="file"
                // Phones offer the camera next to the gallery for image/*; `capture` would drop the gallery.
                accept="image/*"
                className="hidden"
                onChange={event => {
                  const file = event.target.files?.[0];
                  // Cleared so choosing the same photo again still fires onChange.
                  event.target.value = '';
                  if (file) void upload(file);
                }}
              />

              {uploading ? (
                <div
                  className="flex h-40 w-full flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-6"
                  aria-live="polite"
                >
                  <span className="text-sm text-gray-700">{t('services.form.photo.uploading')}</span>
                  <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full bg-blue-600 transition-[width]" style={{ width: `${Math.round((progress ?? 0) * 100)}%` }} />
                  </div>
                </div>
              ) : value ? (
                <div className="space-y-3">
                  <ServiceImageThumbnail src={value} label={label} />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      ref={input.ref}
                      onClick={pick}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50"
                    >
                      <RefreshCw className="h-4 w-4" aria-hidden />
                      {t('services.form.photo.replace')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadError(null);
                        input.onChange('');
                        input.onBlur();
                      }}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                      {t('services.form.photo.remove')}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  ref={input.ref}
                  onClick={pick}
                  className={`flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-gray-600 transition hover:bg-gray-50 ${
                    error?.message ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <Camera className="h-8 w-8" aria-hidden />
                  <span className="text-sm">{t('services.form.photo.choose')}</span>
                </button>
              )}
            </div>
          );
        }}
      />
      {uploadError && <span className="mt-1 block text-sm text-red-500">{t(`services.form.photo.errors.${uploadError}`)}</span>}
      {!uploadError && error?.message && <span className="mt-1 block text-sm text-red-500">{error.message}</span>}
    </div>
  );
}
