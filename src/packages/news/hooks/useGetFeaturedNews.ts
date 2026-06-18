import { useQuery } from '@tanstack/react-query';

export const useGetFeaturedNews = () => {
  return useQuery({
    queryKey: ['featuredNews'],
    queryFn: () => getFeaturedNews(),
  });
};

const getFeaturedNews = async () => {
  const response = await fetch('/api/news/featured');
  return response.json();
};
