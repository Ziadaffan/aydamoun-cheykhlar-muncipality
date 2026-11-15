import * as yup from 'yup';
import { validationMessages } from '@/packages/common/validation/common.validation';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

/** An optional image file (same limits as the server: JPEG/PNG/GIF/WebP, 5 MB). */
export const optionalImageSchema = () =>
  yup
    .mixed<File>()
    .nullable()
    .test('file-type', validationMessages.unsupportedFileType, value => !value || (value instanceof File && ALLOWED_TYPES.includes(value.type)))
    .test('file-size', validationMessages.imageTooLarge, value => !value || (value instanceof File && value.size <= MAX_SIZE))
    .default(null);

/** The message for a failed admin save: the API's code when the page knows it, else a generic one. */
export function adminErrorKey(error: unknown, known: Record<string, string> = {}): string {
  const code = (error as { code?: string })?.code;
  if (code && known[code]) return known[code];
  if (code === 'INVALID_IMAGE') return 'admin.common.messages.invalidImage';
  return 'admin.common.messages.saveError';
}
