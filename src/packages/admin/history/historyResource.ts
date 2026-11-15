import { createAdminResource } from '../common/useAdminResource';
import type { HistoryEntryDto } from '@/packages/history/types';

export const historyResource = createAdminResource<HistoryEntryDto>({ baseUrl: '/api/history', queryKey: 'history' });
