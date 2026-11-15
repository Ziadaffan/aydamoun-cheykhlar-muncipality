import type { ServiceType } from '@prisma/client';

export const SERVICE_TYPES: ServiceType[] = [
  'LICENSEES_AND_CONSTRUCTION_SERVICES',
  'ENVIRONMENTAL_SERVICES',
  'ADMINISTRATIVE_SERVICES',
  'DOWNLOAD_OFFICIAL_FORMS_SERVICES',
  'COMPLAINTS_AND_SUGGESTIONS_SERVICES',
  'OTHER',
];

/** i18n key of a service type's name (admin.services.types.*). */
export const serviceTypeKey = (type: ServiceType) => `admin.services.types.${type}`;
