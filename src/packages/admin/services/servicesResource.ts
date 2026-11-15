import type { ServiceType } from '@prisma/client';
import type { ServiceField } from '@/packages/services/utils/serviceFields';
import { createAdminResource } from '../common/useAdminResource';

/** A service as the API sends it: `fields` resolved; `hasCustomFields` false = category defaults. */
export type ServiceDto = {
  id: string;
  name: string;
  description: string;
  nameEn: string | null;
  descriptionEn: string | null;
  type: ServiceType;
  fields: ServiceField[];
  hasCustomFields?: boolean;
  active: boolean;
  order: number;
};

export const servicesResource = createAdminResource<ServiceDto>({
  baseUrl: '/api/services',
  listUrl: '/api/services?all=1',
  queryKey: 'services',
});
