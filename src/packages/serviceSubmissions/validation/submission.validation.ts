import { NextRequest } from 'next/server';
import { BadRequestError } from '@/packages/common/errors';
import { isValidPhone, normalizePhone } from '@/packages/common/utils/phone.utils';

/**
 * Server-side checks for service requests sent by the website and the mobile app.
 * The clients' own forms are stricter (website and app share the same rules); these
 * only keep bad data out, and stay lenient enough for app versions already installed
 * (e.g. a request without a description). Codes: INVALID_PHONE, INVALID_EMAIL and
 * INVALID_SUBMISSION (missing or too long field, malformed additionalInfo).
 */

export type SubmissionInput = {
  fullName: string;
  phone: string;
  email: string | null;
  address: string;
  description: string | null;
  additionalInfo: Record<string, AdditionalInfoValue>;
};

type AdditionalInfoValue = string | number | boolean | null;

const LIMITS = { fullName: 100, email: 254, address: 200, description: 1000, infoValue: 1000, infoKey: 64, infoKeys: 30 };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const invalid = (message: string) => new BadRequestError(message, 'INVALID_SUBMISSION');

/** The JSON body as an object; a malformed body is a 400 instead of a 500. */
export async function readJsonObject(req: NextRequest): Promise<Record<string, unknown>> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw invalid('Invalid body');
  }
  if (!isPlainObject(body)) throw invalid('Invalid body');
  return body;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredText(body: Record<string, unknown>, field: 'fullName' | 'address', max: number): string {
  const value = body[field];
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text) throw invalid(`${field} is required`);
  if (text.length > max) throw invalid(`${field} is too long`);
  return text;
}

function optionalText(value: unknown, field: string, max: number): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') throw invalid(`${field} must be text`);
  const text = value.trim();
  if (text.length > max) throw invalid(`${field} is too long`);
  return text || null;
}

function phoneOf(value: unknown): string {
  const phone = normalizePhone(typeof value === 'string' || typeof value === 'number' ? value : '');
  if (!phone) throw invalid('phone is required');
  if (!isValidPhone(phone)) throw new BadRequestError('Invalid phone number', 'INVALID_PHONE');
  return phone;
}

function emailOf(value: unknown): string | null {
  const email = optionalText(value, 'email', LIMITS.email);
  if (email && !EMAIL.test(email)) throw new BadRequestError('Invalid email', 'INVALID_EMAIL');
  return email;
}

/** Flat map of the category's extra fields (text, numbers, yes/no); empty values are dropped. */
function additionalInfoOf(value: unknown): Record<string, AdditionalInfoValue> {
  if (value === undefined || value === null) return {};
  if (!isPlainObject(value)) throw invalid('additionalInfo must be an object');
  const entries = Object.entries(value);
  if (entries.length > LIMITS.infoKeys) throw invalid('additionalInfo has too many fields');

  const out: Record<string, AdditionalInfoValue> = {};
  for (const [key, raw] of entries) {
    if (key.length > LIMITS.infoKey) throw invalid('additionalInfo field name is too long');
    if (raw === undefined || raw === null) continue;
    if (typeof raw === 'string') {
      const text = raw.trim();
      if (text.length > LIMITS.infoValue) throw invalid(`additionalInfo.${key} is too long`);
      if (text) out[key] = text;
    } else if (typeof raw === 'number') {
      if (!Number.isFinite(raw)) throw invalid(`additionalInfo.${key} is not a number`);
      out[key] = raw;
    } else if (typeof raw === 'boolean') {
      out[key] = raw;
    } else {
      throw invalid(`additionalInfo.${key} has an unsupported value`);
    }
  }
  return out;
}

/** A new request: name, phone and address are required; extra body fields are ignored. */
export function parseSubmissionInput(body: Record<string, unknown>): SubmissionInput {
  return {
    fullName: requiredText(body, 'fullName', LIMITS.fullName),
    phone: phoneOf(body.phone),
    email: emailOf(body.email),
    address: requiredText(body, 'address', LIMITS.address),
    description: optionalText(body.description, 'description', LIMITS.description),
    additionalInfo: additionalInfoOf(body.additionalInfo),
  };
}

/**
 * An edit: only the fields present in the body change (the admin status update sends
 * none of them), with the same rules as a new request.
 */
export function parseSubmissionUpdate(body: Record<string, unknown>): Partial<SubmissionInput> {
  const out: Partial<SubmissionInput> = {};
  if (body.fullName !== undefined) out.fullName = requiredText(body, 'fullName', LIMITS.fullName);
  if (body.phone !== undefined) out.phone = phoneOf(body.phone);
  if (body.email !== undefined) out.email = emailOf(body.email);
  if (body.address !== undefined) out.address = requiredText(body, 'address', LIMITS.address);
  if (body.description !== undefined) out.description = optionalText(body.description, 'description', LIMITS.description);
  if (body.additionalInfo !== undefined) out.additionalInfo = additionalInfoOf(body.additionalInfo);
  return out;
}
