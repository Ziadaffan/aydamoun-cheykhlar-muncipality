import { useQuery } from '@tanstack/react-query';

export default function useGetTaxiStopById(id: string) {
  return useQuery({
    queryKey: ['taxiStops', id],
    queryFn: () => getTaxiStopById(id),
    enabled: !!id,
  });
}

const getTaxiStopById = async (id: string) => {
  const response = await fetch(`/api/taxi-stops/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch taxi stop');
  }

  return response.json();
};
