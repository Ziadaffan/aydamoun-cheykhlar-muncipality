import { useQuery } from '@tanstack/react-query';
import type { HistoryEntryDto } from '../types';

const getHistory = async (): Promise<HistoryEntryDto[]> => {
  const response = await fetch('/api/history');
  if (!response.ok) throw new Error('Failed to fetch history');
  return response.json();
};

/** The village history timeline, oldest first. */
export const useGetHistory = () => useQuery({ queryKey: ['history', 'public'], queryFn: getHistory });
