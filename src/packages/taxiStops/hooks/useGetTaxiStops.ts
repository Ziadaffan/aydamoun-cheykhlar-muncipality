import { useQuery } from '@tanstack/react-query';

export default function useGetTaxiStops() {
  return useQuery({
    queryKey: ['taxiStops'],
    queryFn: () => getTaxiStops(),
  });
}

const getTaxiStops = async () => {
  const response = await fetch('/api/taxi-stops');

  if (!response.ok) {
    throw new Error('Failed to fetch taxi stops');
  }

  return response.json();
};
