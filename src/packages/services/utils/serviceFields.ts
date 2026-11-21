// The extra fields of each service's request form. Pure: used by the API (which sends
// every service with its resolved `fields`), the website's forms and the admin pages.
//
// A service's own `fields` (set by an admin) win; a service without them (null) uses
// its category's defaults below. The mobile app renders the same `fields` it gets
// from the API, so the defaults only need to live here.

export type ServiceFieldKind = 'text' | 'textarea' | 'number' | 'select' | 'date' | 'image';

export const SERVICE_FIELD_KINDS: readonly ServiceFieldKind[] = ['text', 'textarea', 'number', 'select', 'date', 'image'];

/**
 * 'image' fields: the photo is uploaded first (POST /api/service-images) and the
 * request stores the Cloudinary public id it got back, always in this folder.
 */
export const SERVICE_IMAGE_FOLDER = 'service-submissions';
export const SERVICE_IMAGE_PUBLIC_ID = /^service-submissions\/[A-Za-z0-9_-]+$/;

/** Whether `value` is the stored value of an 'image' field (an uploaded photo's public id). */
export function isServiceImageValue(value: unknown): value is string {
  return typeof value === 'string' && SERVICE_IMAGE_PUBLIC_ID.test(value);
}

export interface ServiceField {
  /** Name inside submission.additionalInfo; /^[a-zA-Z][a-zA-Z0-9_]*$/, unique per service. */
  key: string;
  /** Arabic label. */
  label: string;
  /** English label (the app shows it in English, falling back to `label`). */
  labelEn?: string | null;
  kind: ServiceFieldKind;
  required: boolean;
  /** select only, at least one; the stored value is the (Arabic) option text. */
  options?: string[];
  /**
   * select only: English labels of `options`, same length and order. Display only: the
   * value sent and stored is still the Arabic option. Absent/null = show `options`.
   */
  optionsEn?: string[] | null;
}

/** The text to show for option `index` of a select field: English when asked for and set. */
export function serviceFieldOptionLabel(field: ServiceField, index: number, english: boolean): string {
  const option = field.options?.[index] ?? '';
  return (english && field.optionsEn?.[index]?.trim()) || option;
}

/** A field's label in the site's language: `labelEn` for English when set. */
export function serviceFieldLabel(field: ServiceField, english: boolean): string {
  return (english && field.labelEn?.trim()) || field.label;
}

/** The service that asks for its own complaint/suggestion form. */
export const SPECIAL_SERVICE_ID = 'e0e69b72-4d3f-4a60-872e-fadb66ef590d';

export const SERVICE_FIELD_KEY_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]*$/;
export const SERVICE_FIELD_LIMITS = { fields: 30, key: 64, label: 200, options: 50, option: 200 };

const PRIORITY_OPTIONS = ['منخفض', 'متوسط', 'عالي'];
const PRIORITY_OPTIONS_EN = ['Low', 'Medium', 'High'];
const DEPARTMENT_OPTIONS = ['الخدمات العامة', 'البيئة', 'الإدارة', 'أخرى'];
const DEPARTMENT_OPTIONS_EN = ['Public services', 'Environment', 'Administration', 'Other'];

// Field names, options (stored as these Arabic values) and required flags are the ones
// requests have been made with so far (radio fields are now 'select').
const CATEGORY_DEFAULT_FIELDS: Record<string, ServiceField[]> = {
  LICENSEES_AND_CONSTRUCTION_SERVICES: [
    { key: 'propertyAddress', label: 'عنوان العقار', labelEn: 'Property address', kind: 'text', required: true },
    {
      key: 'propertyType',
      label: 'نوع العقار',
      labelEn: 'Property type',
      kind: 'select',
      options: ['سكني', 'تجاري', 'صناعي'],
      optionsEn: ['Residential', 'Commercial', 'Industrial'],
      required: true,
    },
    { key: 'constructionArea', label: 'مساحة البناء (م²)', labelEn: 'Construction area (m²)', kind: 'number', required: true },
    {
      key: 'existingBuilding',
      label: 'هل يوجد بناء قائم؟',
      labelEn: 'Is there an existing building?',
      kind: 'select',
      options: ['نعم', 'لا'],
      optionsEn: ['Yes', 'No'],
      required: true,
    },
  ],
  ENVIRONMENTAL_SERVICES: [
    { key: 'location', label: 'موقع المشكلة', labelEn: 'Location of the issue', kind: 'text', required: true },
    { key: 'urgency', label: 'مستوى الأولوية', labelEn: 'Priority', kind: 'select', options: PRIORITY_OPTIONS, optionsEn: PRIORITY_OPTIONS_EN, required: true },
  ],
  ADMINISTRATIVE_SERVICES: [
    { key: 'propertyNumber', label: 'رقم العقار (إن وجد)', labelEn: 'Property number (if any)', kind: 'text', required: false },
    { key: 'eventDate', label: 'تاريخ الفعالية (إن وجد)', labelEn: 'Event date (if any)', kind: 'date', required: false },
  ],
  DOWNLOAD_OFFICIAL_FORMS_SERVICES: [],
  COMPLAINTS_AND_SUGGESTIONS_SERVICES: [
    { key: 'department', label: 'القسم المعني', labelEn: 'Department', kind: 'select', options: DEPARTMENT_OPTIONS, optionsEn: DEPARTMENT_OPTIONS_EN, required: true },
    { key: 'priority', label: 'مستوى الأولوية', labelEn: 'Priority', kind: 'select', options: PRIORITY_OPTIONS, optionsEn: PRIORITY_OPTIONS_EN, required: true },
  ],
  OTHER: [
    { key: 'preferredDate', label: 'التاريخ المفضل', labelEn: 'Preferred date', kind: 'date', required: false },
    { key: 'preferredTime', label: 'الوقت المفضل', labelEn: 'Preferred time', kind: 'select', options: ['صباحاً', 'مساءً'], optionsEn: ['Morning', 'Evening'], required: false },
  ],
};

const SERVICE_SPECIFIC_FIELDS: Record<string, ServiceField[]> = {
  [SPECIAL_SERVICE_ID]: [
    { key: 'complaintNumber', label: 'رقم الشكوى أو الطلب', labelEn: 'Complaint or request number', kind: 'text', required: true },
    { key: 'type', label: 'النوع', labelEn: 'Type', kind: 'select', options: ['شكوى', 'اقتراح', 'استفسار'], optionsEn: ['Complaint', 'Suggestion', 'Inquiry'], required: true },
    { key: 'department', label: 'القسم المعني', labelEn: 'Department', kind: 'select', options: DEPARTMENT_OPTIONS, optionsEn: DEPARTMENT_OPTIONS_EN, required: true },
    { key: 'priority', label: 'مستوى الأولوية', labelEn: 'Priority', kind: 'select', options: PRIORITY_OPTIONS, optionsEn: PRIORITY_OPTIONS_EN, required: true },
  ],
};

const copy = (fields: ServiceField[]): ServiceField[] =>
  fields.map(field => ({
    ...field,
    ...(field.options && { options: [...field.options] }),
    ...(field.optionsEn && { optionsEn: [...field.optionsEn] }),
  }));

/** The fields a service gets when an admin hasn't defined its own. */
export function getDefaultServiceFields(type: string, serviceId?: string): ServiceField[] {
  if (serviceId && SERVICE_SPECIFIC_FIELDS[serviceId]) return copy(SERVICE_SPECIFIC_FIELDS[serviceId]);
  return copy(CATEGORY_DEFAULT_FIELDS[type] ?? []);
}

/** A service's form fields: its own when set, else its category's defaults. */
export function resolveServiceFields(service: { id?: string; type: string; fields?: unknown } | null | undefined): ServiceField[] {
  if (!service) return [];
  if (Array.isArray(service.fields)) {
    // Stored values were validated on save; this only guards against hand-edited rows.
    return service.fields.flatMap(raw => {
      const field = normalizeField(raw);
      return field ? [field] : [];
    });
  }
  return getDefaultServiceFields(service.type, service.id);
}

function normalizeField(raw: unknown): ServiceField | null {
  if (!raw || typeof raw !== 'object') return null;
  const value = raw as Record<string, unknown>;
  // 'radio' (older definitions) is shown as a select.
  const kind = value.kind === 'radio' ? 'select' : value.kind;
  if (typeof value.key !== 'string' || typeof value.label !== 'string' || !SERVICE_FIELD_KINDS.includes(kind as ServiceFieldKind)) {
    return null;
  }
  const field: ServiceField = {
    key: value.key,
    label: value.label,
    labelEn: typeof value.labelEn === 'string' && value.labelEn ? value.labelEn : null,
    kind: kind as ServiceFieldKind,
    required: value.required === true,
  };
  if (field.kind === 'select') {
    field.options = Array.isArray(value.options) ? value.options.filter((o): o is string => typeof o === 'string') : [];
    const optionsEn = Array.isArray(value.optionsEn) ? value.optionsEn.map(o => (typeof o === 'string' ? o : '')) : null;
    field.optionsEn = optionsEn && optionsEn.length === field.options.length && optionsEn.some(Boolean) ? optionsEn : null;
  }
  return field;
}

export class ServiceFieldsError extends Error {}

/**
 * Checks an admin's field definitions (from the API body) and returns them cleaned
 * up: trimmed, `options`/`optionsEn` only on selects, no empty `labelEn`/`optionsEn`. null/undefined = use
 * the category defaults. Throws ServiceFieldsError with a short English reason.
 */
export function parseServiceFieldDefinitions(value: unknown): ServiceField[] | null {
  if (value === null || value === undefined) return null;
  if (!Array.isArray(value)) throw new ServiceFieldsError('fields must be an array');
  if (value.length > SERVICE_FIELD_LIMITS.fields) throw new ServiceFieldsError('too many fields');

  const keys = new Set<string>();
  return value.map((raw, index) => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new ServiceFieldsError(`fields[${index}] must be an object`);
    const item = raw as Record<string, unknown>;

    const key = typeof item.key === 'string' ? item.key.trim() : '';
    if (!SERVICE_FIELD_KEY_PATTERN.test(key) || key.length > SERVICE_FIELD_LIMITS.key) {
      throw new ServiceFieldsError(`fields[${index}].key is invalid`);
    }
    if (keys.has(key)) throw new ServiceFieldsError(`fields[${index}].key is duplicated`);
    keys.add(key);

    const label = typeof item.label === 'string' ? item.label.trim() : '';
    if (!label || label.length > SERVICE_FIELD_LIMITS.label) throw new ServiceFieldsError(`fields[${index}].label is invalid`);

    const labelEn = typeof item.labelEn === 'string' ? item.labelEn.trim() : '';
    if (labelEn.length > SERVICE_FIELD_LIMITS.label) throw new ServiceFieldsError(`fields[${index}].labelEn is too long`);

    if (!SERVICE_FIELD_KINDS.includes(item.kind as ServiceFieldKind)) throw new ServiceFieldsError(`fields[${index}].kind is invalid`);
    const kind = item.kind as ServiceFieldKind;

    const field: ServiceField = { key, label, labelEn: labelEn || null, kind, required: item.required === true };

    if (kind === 'select') {
      const rawOptions = Array.isArray(item.options) ? item.options.map(o => (typeof o === 'string' ? o.trim() : '')) : [];

      // English labels pair with the options by position, so they must line up one to one.
      let rawOptionsEn: string[] | null = null;
      if (item.optionsEn !== undefined && item.optionsEn !== null) {
        if (!Array.isArray(item.optionsEn)) throw new ServiceFieldsError(`fields[${index}].optionsEn must be an array`);
        if (item.optionsEn.length !== rawOptions.length) {
          throw new ServiceFieldsError(`fields[${index}].optionsEn must have as many items as options`);
        }
        rawOptionsEn = item.optionsEn.map(o => (typeof o === 'string' ? o.trim() : ''));
      }

      // Empty and repeated options are dropped (with their English label).
      const options: string[] = [];
      const optionsEn: string[] = [];
      rawOptions.forEach((option, i) => {
        if (!option || options.includes(option)) return;
        options.push(option);
        optionsEn.push(rawOptionsEn?.[i] ?? '');
      });

      if (options.length === 0) throw new ServiceFieldsError(`fields[${index}].options must have at least one option`);
      if (options.length > SERVICE_FIELD_LIMITS.options || [...options, ...optionsEn].some(o => o.length > SERVICE_FIELD_LIMITS.option)) {
        throw new ServiceFieldsError(`fields[${index}].options is invalid`);
      }
      field.options = options;
      field.optionsEn = optionsEn.some(Boolean) ? optionsEn : null;
    }

    return field;
  });
}

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
// Requests made before dates were saved as 'YYYY-MM-DD' hold a timestamp: still accepted on edit.
const LEGACY_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

export type AdditionalInfoValue = string | number | boolean | null;

/**
 * Checks a request's additionalInfo against the service's fields: required fields
 * present, select values among the options, numbers numeric, dates 'YYYY-MM-DD',
 * images the public id of an uploaded photo.
 * Values of other keys (older app versions, fields removed since) are kept as they are.
 * With `requireAll: false` (staff edits) missing required fields are allowed.
 * Returns the reason of the first problem, or null.
 */
export function findAdditionalInfoProblem(
  info: Record<string, AdditionalInfoValue>,
  fields: ServiceField[],
  { requireAll = true }: { requireAll?: boolean } = {}
): string | null {
  for (const field of fields) {
    const value = info[field.key];
    const empty = value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
    if (empty) {
      if (field.required && requireAll) return `additionalInfo.${field.key} is required`;
      continue;
    }
    switch (field.kind) {
      case 'number': {
        const n = typeof value === 'number' ? value : Number(String(value).trim());
        if (typeof value === 'boolean' || !Number.isFinite(n)) return `additionalInfo.${field.key} must be a number`;
        break;
      }
      case 'select':
        if (typeof value !== 'string' || !(field.options ?? []).includes(value)) return `additionalInfo.${field.key} is not one of the options`;
        break;
      case 'date':
        if (typeof value === 'string' && LEGACY_TIMESTAMP.test(value)) break;
        if (typeof value !== 'string' || !DATE_ONLY.test(value) || Number.isNaN(new Date(`${value}T00:00:00Z`).getTime())) {
          return `additionalInfo.${field.key} must be a date (YYYY-MM-DD)`;
        }
        break;
      case 'image':
        if (!isServiceImageValue(value)) return `additionalInfo.${field.key} must be an uploaded image`;
        break;
      default:
        if (typeof value !== 'string' && typeof value !== 'number') return `additionalInfo.${field.key} must be text`;
    }
  }
  return null;
}
