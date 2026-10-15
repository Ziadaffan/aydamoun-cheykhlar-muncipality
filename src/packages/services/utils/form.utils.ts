// The extra fields of each request form. The mobile app uses the same field names,
// options (stored as these Arabic values) and required flags: keep
// features/services/fields.ts in the app in step with this file.
export const getAdditionalFields = (category: string, serviceId?: string) => {
  if (serviceId) {
    const serviceSpecificFields = getServiceSpecificFields(serviceId);
    if (serviceSpecificFields.length > 0) {
      return serviceSpecificFields;
    }
  }

  switch (category) {
    case 'buildingLicenses':
      return [
        { name: 'propertyAddress', label: 'عنوان العقار', type: 'text', required: true },
        { name: 'propertyType', label: 'نوع العقار', type: 'select', options: ['سكني', 'تجاري', 'صناعي'], required: true },
        { name: 'constructionArea', label: 'مساحة البناء (م²)', type: 'number', required: true },
        { name: 'existingBuilding', label: 'هل يوجد بناء قائم؟', type: 'radio', options: ['نعم', 'لا'], required: true },
      ];

    case 'environmentalServices':
      return [
        { name: 'location', label: 'موقع المشكلة', type: 'text', required: true },
        { name: 'urgency', label: 'مستوى الأولوية', type: 'select', options: ['منخفض', 'متوسط', 'عالي'], required: true },
      ];

    case 'administrativeTransactions':
      return [
        { name: 'propertyNumber', label: 'رقم العقار (إن وجد)', type: 'text', required: false },
        { name: 'eventDate', label: 'تاريخ الفعالية (إن وجد)', type: 'date', required: false },
      ];

    case 'complaintsAndSuggestions':
      return [
        { name: 'department', label: 'القسم المعني', type: 'select', options: ['الخدمات العامة', 'البيئة', 'الإدارة', 'أخرى'], required: true },
        { name: 'priority', label: 'مستوى الأولوية', type: 'select', options: ['منخفض', 'متوسط', 'عالي'], required: true },
      ];

    case 'additionalServices':
      return [
        { name: 'preferredDate', label: 'التاريخ المفضل', type: 'date', required: false },
        { name: 'preferredTime', label: 'الوقت المفضل', type: 'select', options: ['صباحاً', 'مساءً'], required: false },
      ];

    default:
      return [];
  }
};

const getServiceSpecificFields = (serviceId: string) => {
  switch (serviceId) {
    case 'e0e69b72-4d3f-4a60-872e-fadb66ef590d':
      return [
        { name: 'complaintNumber', label: 'رقم الشكوى أو الطلب', type: 'text', required: true },
        { name: 'type', label: 'النوع', type: 'select', options: ['شكوى', 'اقتراح', 'استفسار'], required: true },
        { name: 'department', label: 'القسم المعني', type: 'select', options: ['الخدمات العامة', 'البيئة', 'الإدارة', 'أخرى'], required: true },
        { name: 'priority', label: 'مستوى الأولوية', type: 'select', options: ['منخفض', 'متوسط', 'عالي'], required: true },
      ];
    default:
      return [];
  }
};

// Field names and option values sent by app versions before 1.2, which had their own
// fields. Requests made with them are still in the database: show them in Arabic.
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

/** A stored additionalInfo value as text for staff and residents. */
export function formatAdditionalInfoValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') {
    return toDateOnly(value.trim());
  }
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'نعم' : 'لا';
  if (Array.isArray(value)) {
    return value
      .map(v => formatAdditionalInfoValue(v))
      .filter(Boolean)
      .join('، ');
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/**
 * Label/value rows for a request's additionalInfo: the form's own fields first, in
 * form order, then anything else stored (older app fields, removed fields).
 */
export function describeAdditionalInfo(additionalInfo: unknown, category: string, serviceId?: string) {
  if (!additionalInfo || typeof additionalInfo !== 'object' || Array.isArray(additionalInfo)) {
    const value = formatAdditionalInfoValue(additionalInfo);
    return value ? [{ key: 'value', label: 'القيمة', value }] : [];
  }

  const info = additionalInfo as Record<string, unknown>;
  const fields = getAdditionalFields(category, serviceId);
  const known = new Set(fields.map(f => f.name));

  const rows = [
    ...fields
      .filter(f => Object.prototype.hasOwnProperty.call(info, f.name))
      // formatLegacyValue: 'type' kept its name but the older app stored English codes.
      .map(f => ({ key: f.name, label: f.label, value: formatLegacyValue(f.name, info[f.name]) })),
    ...Object.keys(info)
      .filter(key => !known.has(key))
      .sort()
      .map(key => ({
        key,
        label: ownLabel(LEGACY_FIELD_LABELS, key) ?? prettifyKey(key),
        value: formatLegacyValue(key, info[key]),
      })),
  ];

  return rows.filter(row => row.value !== '');
}

function formatLegacyValue(key: string, value: unknown): string {
  const option = LEGACY_SELECT_FIELDS.has(key) && typeof value === 'string' ? ownLabel(LEGACY_OPTION_LABELS, value) : undefined;
  return option ?? formatAdditionalInfoValue(value);
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
