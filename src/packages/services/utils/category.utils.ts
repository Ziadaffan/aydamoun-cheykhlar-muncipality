import { ServiceType } from '@prisma/client';
import { getServiceCategoryMeta } from './service.utils';

/**
 * The form category (form.utils) of a service type. Same mapping as the request form
 * itself, so the edit and admin pages show the fields the request was made with.
 */
export const mapServiceTypeToCategory = (serviceType: string): string => {
  if (!Object.values(ServiceType).includes(serviceType as ServiceType)) return '';
  return getServiceCategoryMeta(serviceType as ServiceType).categoryKey;
};
