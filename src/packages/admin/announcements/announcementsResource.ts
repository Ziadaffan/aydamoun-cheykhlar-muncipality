import { createAdminResource } from '../common/useAdminResource';
import type { AnnouncementDto } from '@/packages/announcements/types';

export const announcementsResource = createAdminResource<AnnouncementDto>({
  baseUrl: '/api/announcements',
  listUrl: '/api/announcements?all=1',
  queryKey: 'announcements',
});
