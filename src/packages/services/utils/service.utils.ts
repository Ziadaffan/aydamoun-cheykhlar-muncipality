import { ServiceType } from '@prisma/client';

export function getServiceCategoryMeta(type: ServiceType) {
  switch (type) {
    case 'LICENSEES_AND_CONSTRUCTION_SERVICES':
      return { icon: '🏗️', bgColor: 'from-blue-400 to-blue-600', categoryKey: 'buildingLicenses' };
    case 'ENVIRONMENTAL_SERVICES':
      return { icon: '🌱', bgColor: 'from-green-400 to-green-600', categoryKey: 'environmentalServices' };
    case 'ADMINISTRATIVE_SERVICES':
      return { icon: '📋', bgColor: 'from-purple-400 to-purple-600', categoryKey: 'administrativeTransactions' };
    case 'DOWNLOAD_OFFICIAL_FORMS_SERVICES':
      return { icon: '📄', bgColor: 'from-blue-400 to-blue-600', categoryKey: 'officialForms' };
    case 'COMPLAINTS_AND_SUGGESTIONS_SERVICES':
      return { icon: '📢', bgColor: 'from-orange-400 to-orange-600', categoryKey: 'complaintsAndSuggestions' };
    case 'OTHER':
      return { icon: '⭐', bgColor: 'from-indigo-400 to-indigo-600', categoryKey: 'additionalServices' };
    default:
      return { icon: '❓', bgColor: 'from-gray-400 to-gray-600', categoryKey: 'other' };
  }
}

/** Each service type's name in Arabic and English (the same text as services.<categoryKey>.title). */
export const SERVICE_TYPE_LABELS: Record<ServiceType, { ar: string; en: string }> = {
  LICENSEES_AND_CONSTRUCTION_SERVICES: { ar: 'خدمات الرخص والإنشاءات', en: 'Licenses and construction' },
  ENVIRONMENTAL_SERVICES: { ar: 'خدمات النظافة والبيئة', en: 'Cleaning and environment' },
  ADMINISTRATIVE_SERVICES: { ar: 'المعاملات الإدارية', en: 'Administrative transactions' },
  DOWNLOAD_OFFICIAL_FORMS_SERVICES: { ar: 'تحميل النماذج الرسمية', en: 'Official forms' },
  COMPLAINTS_AND_SUGGESTIONS_SERVICES: { ar: 'الشكاوى والاقتراحات', en: 'Complaints and suggestions' },
  OTHER: { ar: 'خدمات إضافية', en: 'Additional services' },
};

type SearchableService = { name: string; nameEn?: string | null; description: string; descriptionEn?: string | null; type: ServiceType };

/**
 * Whether a service matches a search: its name or description in Arabic or English,
 * or its type's name in either language. Case-insensitive; an empty query matches all.
 */
export function serviceMatchesSearch(service: SearchableService, query: string): boolean {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return true;
  const typeLabel = SERVICE_TYPE_LABELS[service.type];
  return [service.name, service.nameEn, service.description, service.descriptionEn, typeLabel?.ar, typeLabel?.en].some(
    text => !!text && text.toLocaleLowerCase().includes(needle)
  );
}
