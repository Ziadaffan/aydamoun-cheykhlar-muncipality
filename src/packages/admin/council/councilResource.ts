import type { Position } from '@prisma/client';
import { createAdminResource } from '../common/useAdminResource';

/** A council member as the API sends it. */
export type CouncilMemberDto = {
  id: string;
  name: string;
  position: Position;
  role: string | null;
  major: string | null;
  nameEn: string | null;
  roleEn: string | null;
  majorEn: string | null;
  phone: string | null;
  email: string | null;
  image: string | null;
  order: number;
};

export const councilResource = createAdminResource<CouncilMemberDto>({ baseUrl: '/api/council', queryKey: 'council-members' });
