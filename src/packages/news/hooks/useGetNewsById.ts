import { useQuery } from '@tanstack/react-query';
import { News } from '@/packages/news/types/news.types';

/** Failed article request; `status` 404 means the article doesn't exist (deleted, or a wrong link). */
export class NewsRequestError extends Error {
  constructor(public readonly status: number) {
    super('Failed to fetch news');
  }
}

export const useGetNewsById = (id: string) => {
  return useQuery<News, Error>({
    queryKey: ['news', id],
    queryFn: () => getNewsById(id),
    enabled: !!id,
    // A missing article won't appear on retry.
    retry: (failureCount, error) => !(error instanceof NewsRequestError && error.status === 404) && failureCount < 3,
  });
};

const getNewsById = async (id: string): Promise<News> => {
  const response = await fetch(`/api/news/${encodeURIComponent(id)}`);

  if (!response.ok) {
    throw new NewsRequestError(response.status);
  }

  return response.json();
};
