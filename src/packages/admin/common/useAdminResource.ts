import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminFetch } from './adminApi';

/**
 * Query and mutation hooks for one admin-managed collection (announcements, history,
 * council, services). `listUrl` is what the admin list loads (e.g. with `?all=1`).
 */
export function createAdminResource<T extends { id: string }>({
  baseUrl,
  listUrl = baseUrl,
  queryKey,
}: {
  baseUrl: string;
  listUrl?: string;
  queryKey: string;
}) {
  const useList = () => useQuery({ queryKey: [queryKey, 'admin-list'], queryFn: () => adminFetch<T[]>(listUrl) });

  const useOne = (id: string | undefined) => useQuery({ queryKey: [queryKey, id], queryFn: () => adminFetch<T>(`${baseUrl}/${id}`), enabled: !!id });

  const useInvalidate = () => {
    const queryClient = useQueryClient();
    return () => queryClient.invalidateQueries({ queryKey: [queryKey] });
  };

  const useCreate = () => {
    const invalidate = useInvalidate();
    return useMutation({ mutationFn: (init: RequestInit) => adminFetch<T>(baseUrl, init), onSuccess: invalidate });
  };

  const useUpdate = (id: string) => {
    const invalidate = useInvalidate();
    return useMutation({ mutationFn: (init: RequestInit) => adminFetch<T>(`${baseUrl}/${id}`, init), onSuccess: invalidate });
  };

  const useDelete = () => {
    const invalidate = useInvalidate();
    return useMutation({ mutationFn: (id: string) => adminFetch<void>(`${baseUrl}/${id}`, { method: 'DELETE' }), onSuccess: invalidate });
  };

  return { useList, useOne, useCreate, useUpdate, useDelete };
}
