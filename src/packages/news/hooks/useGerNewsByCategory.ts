import { useQuery } from '@tanstack/react-query';
import { NewsCategory } from '@prisma/client';

export const useGetNewsByCategory = (category: NewsCategory | 'ALL') => {
  return useQuery({
    queryKey: ['news', category],
    queryFn: () => getNewsByCategory(category),
    enabled: category !== 'ALL',
  });
};

const getNewsByCategory = async (category: NewsCategory | 'ALL') => {
  if (category === 'ALL') {
    const response = await fetch('/api/news');
    return response.json();
  }
  const response = await fetch(`/api/news?category=${category}`);
  return response.json();
};
