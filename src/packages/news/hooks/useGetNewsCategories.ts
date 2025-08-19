import { useQuery } from '@tanstack/react-query';

export const useGetNewsCategories = () => {
  return useQuery({
    queryKey: ['newsCategories'],
    queryFn: () => getNewsCategories(),
  });
};

const getNewsCategories = async () => {
  const response = await fetch('/api/news/categories');
  return response.json();
};
