import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateNewsFormData } from '../validation/news.validation';

export const useUpdateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (news: UpdateNewsFormData & { id: string }) => updateNews(news),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

const updateNews = async (data: UpdateNewsFormData & { id: string }) => {
  const formData = new FormData();

  formData.append('title', data.title);
  formData.append('content', data.content);
  formData.append('excerpt', data.excerpt);
  formData.append('category', data.category);
  formData.append('author', data.author);
  formData.append('featured', data.featured.toString());

  if (data.tags && data.tags.length > 0) {
    formData.append('tags', JSON.stringify(data.tags));
  }

  if (data.images && data.images.length > 0) {
    data.images.forEach((image, index) => {
      if (image instanceof File) {
        formData.append(`images`, image);
      }
    });
  }

  const response = await fetch(`/api/news/${data.id}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update news');
  }

  return response.json();
};
