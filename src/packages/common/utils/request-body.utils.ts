import { NextRequest } from 'next/server';
import { BadRequestError } from '@/packages/common/errors';

/**
 * Body of an admin create/update request, sent either as JSON or as multipart form
 * data (the website's admin forms, so an image file can come along).
 *
 * - `data`: the plain fields. Form values are strings; JSON keeps its types.
 * - `imageFile`: a non-empty file in the `image` form field.
 * - `imageRef`: JSON only, an image given as a Cloudinary public id or https URL (`image` or `imageUrl`).
 * - `removeImage`: the admin cleared the image (`removeImage=true`, or JSON `image: null`).
 */
export type AdminBody = {
  data: Record<string, unknown>;
  imageFile?: File;
  imageRef?: string;
  removeImage: boolean;
};

export async function readAdminBody(request: NextRequest, code: string): Promise<AdminBody> {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const data: Record<string, unknown> = {};
    let imageFile: File | undefined;
    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        data[key] = value;
      } else if (key === 'image' && value.size > 0) {
        imageFile = value;
      }
    });
    return { data, imageFile, removeImage: data.removeImage === 'true' };
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError('Invalid body', code);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new BadRequestError('Invalid body', code);
  }
  const data = body as Record<string, unknown>;
  const ref = typeof data.image === 'string' ? data.image : typeof data.imageUrl === 'string' ? data.imageUrl : undefined;
  return {
    data,
    imageRef: ref?.trim() ? ref.trim().slice(0, 500) : undefined,
    removeImage: data.image === null || data.imageUrl === null || data.removeImage === true || ref?.trim() === '',
  };
}

/**
 * Field readers for hand-written server validation. Each throws a 400 with `code`
 * and a short English message (never shown to residents).
 */
export function fieldReaders(body: Record<string, unknown>, code: string) {
  const fail = (message: string) => new BadRequestError(message, code);

  const text = (key: string, max: number): string | undefined => {
    const value = body[key];
    if (value === undefined) return undefined;
    if (value === null) return '';
    if (typeof value !== 'string' && typeof value !== 'number') throw fail(`${key} must be text`);
    const trimmed = String(value).trim();
    if (trimmed.length > max) throw fail(`${key} is too long`);
    return trimmed;
  };

  return {
    /** Required text; on a partial update it may be absent but never empty. */
    requiredText(key: string, max: number, partial = false): string | undefined {
      const value = text(key, max);
      if (value === undefined && partial) return undefined;
      if (!value) throw fail(`${key} is required`);
      return value;
    },
    /** Optional text: '' or null becomes null, absent stays undefined. */
    optionalText(key: string, max: number): string | null | undefined {
      const value = text(key, max);
      if (value === undefined) return undefined;
      return value || null;
    },
    int(key: string, { min = -100000, max = 100000 } = {}): number | undefined {
      const value = body[key];
      if (value === undefined || value === null || value === '') return undefined;
      const n = typeof value === 'number' ? value : Number(String(value).trim());
      if (!Number.isInteger(n) || n < min || n > max) throw fail(`${key} must be an integer`);
      return n;
    },
    bool(key: string): boolean | undefined {
      const value = body[key];
      if (value === undefined || value === null || value === '') return undefined;
      if (typeof value === 'boolean') return value;
      if (value === 'true' || value === '1') return true;
      if (value === 'false' || value === '0') return false;
      throw fail(`${key} must be a boolean`);
    },
    /** A date (ISO string); '' or null clears it (null), absent stays undefined. */
    date(key: string): Date | null | undefined {
      const value = body[key];
      if (value === undefined) return undefined;
      if (value === null || value === '') return null;
      if (typeof value !== 'string' && typeof value !== 'number') throw fail(`${key} must be a date`);
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) throw fail(`${key} must be a date`);
      return d;
    },
    oneOf<T extends string>(key: string, values: readonly T[], partial = false): T | undefined {
      const value = body[key];
      if ((value === undefined || value === '') && partial) return undefined;
      if (typeof value !== 'string' || !values.includes(value as T)) throw fail(`${key} is invalid`);
      return value as T;
    },
  };
}

/** Drops undefined values so a partial update only touches the fields that were sent. */
export function definedOnly<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as Partial<T>;
}
