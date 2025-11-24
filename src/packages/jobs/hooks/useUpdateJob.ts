import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateJobFormData } from '../validation/jobs.validation';

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (job: UpdateJobFormData & { id: string }) => updateJob(job),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

const updateJob = async (data: UpdateJobFormData & { id: string }) => {
  const formData = new FormData();

  formData.append('title', data.title);
  if (data.description) {
    formData.append('description', data.description);
  }
  formData.append('provider', data.provider);
  formData.append('location', data.location);
  if (data.salary) {
    formData.append('salary', data.salary);
  }
  if (data.deadline) {
    const deadlineDate = data.deadline instanceof Date ? data.deadline : new Date(data.deadline);
    formData.append('deadline', deadlineDate.toISOString());
  }
  formData.append('active', data.active?.toString() || 'true');

  const response = await fetch(`/api/jobs/${data.id}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update job');
  }

  return response.json();
};

