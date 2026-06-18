import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

export const useDeleteNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newsId: string) => deleteNews(newsId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

const deleteNews = async (newsId: string) => {
  const response = await fetch(`/api/news/${newsId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete news');
  }

  return response.json();
};
