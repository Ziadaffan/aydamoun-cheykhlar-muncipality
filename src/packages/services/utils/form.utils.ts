import { isServiceImageValue, serviceFieldLabel, serviceFieldOptionLabel, type ServiceField } from './serviceFields';

// The request form's extra fields now come from the service itself (resolved by
// resolveServiceFields in ./serviceFields). This file keeps the display helpers.

// Field names and option values sent by app versions before 1.2, which had their own
// fields. Requests made with them are still in the database: show them in the site language.
export const LEGACY_FIELD_LABELS: Record<string, string> = {
  lotNumber: 'رقم القطعة',
  buildingType: 'نوع البناء',
  surfaceM2: 'المساحة (م²)',
  issueType: 'نوع المشكلة',
  documentType: 'نوع الوثيقة',
  purpose: 'الغرض',
  formType: 'نوع النموذج',
  reason: 'السبب',
  subject: 'الموضوع',
  type: 'النوع',
  body: 'التفاصيل',
};

const LEGACY_FIELD_LABELS_EN: Record<string, string> = {
  lotNumber: 'Lot number',
  buildingType: 'Building type',
  surfaceM2: 'Area (m²)',
  issueType: 'Issue type',
  documentType: 'Document type',
  purpose: 'Purpose',
  formType: 'Form type',
  reason: 'Reason',
  subject: 'Subject',
  type: 'Type',
  body: 'Details',
};

// Option values of the older app's pickers (it stored English codes).
const LEGACY_SELECT_FIELDS = new Set(['buildingType', 'issueType', 'documentType', 'formType', 'type']);

export const LEGACY_OPTION_LABELS: Record<string, string> = {
  residential: 'سكني',
  commercial: 'تجاري',
  industrial: 'صناعي',
  other: 'أخرى',
  pollution: 'تلوث',
  waste: 'نفايات',
  birth_certificate: 'شهادة الميلاد',
  marriage_certificate: 'عقد الزواج',
  residency_proof: 'إثبات الإقامة',
  complaint: 'شكوى',
  suggestion: 'اقتراح',
};

const LEGACY_OPTION_LABELS_EN: Record<string, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  industrial: 'Industrial',
  other: 'Other',
  pollution: 'Pollution',
  waste: 'Waste',
  birth_certificate: 'Birth certificate',
  marriage_certificate: 'Marriage certificate',
  residency_proof: 'Proof of residence',
  complaint: 'Complaint',
  suggestion: 'Suggestion',
};

// Date fields used to be saved as timestamps (yup's cast of the date input at the
// browser's local midnight); they are now saved as 'YYYY-MM-DD'.
const ISO_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

/** 'YYYY-MM-DD' of a stored date value, read in Lebanon's time zone. */
export function toDateOnly(value: string): string {
  if (!ISO_TIMESTAMP.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  // From the parts, not a locale's whole format: en-CA's 'YYYY-MM-DD' has changed
  // between browser versions.
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Beirut',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

/** A stored additionalInfo value as text for staff and residents (yes/no and list separators in English with `english`). */
export function formatAdditionalInfoValue(value: unknown, english = false): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') {
    return toDateOnly(value.trim());
  }
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return english ? (value ? 'Yes' : 'No') : value ? 'نعم' : 'لا';
  if (Array.isArray(value)) {
    return value
      .map(v => formatAdditionalInfoValue(v, english))
      .filter(Boolean)
      .join(english ? ', ' : '، ');
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export type AdditionalInfoRow = { key: string; label: string; value: string; image?: string };

/**
 * Label/value rows for a request's additionalInfo: the form's own fields first, in
 * form order, then anything else stored (older app fields, removed fields).
 * With `english`, the form's fields use their English label and select values their
 * English option label when the admin gave them (values are stored in Arabic).
 * A photo ('image' field) also has `image`, its public id: show it as a picture, not as text.
 */
export function describeAdditionalInfo(
  additionalInfo: unknown,
  fields: ServiceField[],
  { english = false }: { english?: boolean } = {}
): AdditionalInfoRow[] {
  if (!additionalInfo || typeof additionalInfo !== 'object' || Array.isArray(additionalInfo)) {
    const value = formatAdditionalInfoValue(additionalInfo, english);
    return value ? [{ key: 'value', label: english ? 'Value' : 'القيمة', value }] : [];
  }

  const info = additionalInfo as Record<string, unknown>;
  const known = new Set(fields.map(f => f.key));

  const rows = [
    ...fields
      .filter(f => Object.prototype.hasOwnProperty.call(info, f.key))
      // formatLegacyValue: 'type' kept its name but the older app stored English codes.
      .map(f => ({
        key: f.key,
        label: serviceFieldLabel(f, english),
        value: formatFieldValue(f, info[f.key], english),
        ...(f.kind === 'image' && isServiceImageValue(info[f.key]) && { image: info[f.key] as string }),
      })),
    ...Object.keys(info)
      .filter(key => !known.has(key))
      .sort()
      .map(key => ({
        key,
        label: ownLabel(english ? LEGACY_FIELD_LABELS_EN : LEGACY_FIELD_LABELS, key) ?? prettifyKey(key),
        value: formatLegacyValue(key, info[key], english),
      })),
  ];

  return rows.filter(row => row.value !== '');
}

function formatFieldValue(field: ServiceField, value: unknown, english: boolean): string {
  if (english && field.kind === 'select' && typeof value === 'string') {
    const index = field.options?.indexOf(value) ?? -1;
    if (index >= 0) return serviceFieldOptionLabel(field, index, true);
  }
  return formatLegacyValue(field.key, value, english);
}

function formatLegacyValue(key: string, value: unknown, english: boolean): string {
  const labels = english ? LEGACY_OPTION_LABELS_EN : LEGACY_OPTION_LABELS;
  const option = LEGACY_SELECT_FIELDS.has(key) && typeof value === 'string' ? ownLabel(labels, value) : undefined;
  return option ?? formatAdditionalInfoValue(value, english);
}

// Own keys only: a stored value such as 'constructor' must not hit Object.prototype.
function ownLabel(labels: Record<string, string>, key: string): string | undefined {
  return Object.prototype.hasOwnProperty.call(labels, key) ? labels[key] : undefined;
}

function prettifyKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim();
}
