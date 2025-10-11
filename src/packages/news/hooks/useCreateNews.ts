import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateNewsFormData } from '../validation/news.validation';

export const useCreateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

const createNews = async (data: CreateNewsFormData) => {
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

  const response = await fetch('/api/news', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create news');
  }

  return response.json();
};
