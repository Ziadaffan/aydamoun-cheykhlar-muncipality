import { useQuery } from '@tanstack/react-query';
import type { AnnouncementDto } from '../types';

const getAnnouncements = async (limit?: number): Promise<AnnouncementDto[]> => {
  const response = await fetch(limit ? `/api/announcements?limit=${limit}` : '/api/announcements');
  if (!response.ok) throw new Error('Failed to fetch announcements');
  return response.json();
};

/** Current announcements (not expired), pinned first then newest. */
export const useGetAnnouncements = (limit?: number) =>
  useQuery({ queryKey: ['announcements', 'public', limit ?? 'all'], queryFn: () => getAnnouncements(limit) });
