import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateJobFormData } from '../validation/jobs.validation';

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

const createJob = async (data: CreateJobFormData) => {
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
    const deadlineDate = data.deadline instanceof Date 
      ? data.deadline 
      : typeof data.deadline === 'string' 
        ? new Date(data.deadline) 
        : new Date(data.deadline as string | number);
    formData.append('deadline', deadlineDate.toISOString());
  }
  formData.append('active', data.active?.toString() || 'true');

  const response = await fetch('/api/jobs', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create job');
  }

  return response.json();
};

