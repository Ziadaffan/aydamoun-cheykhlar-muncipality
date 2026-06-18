import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

const deleteJob = async (jobId: string) => {
  const response = await fetch(`/api/jobs/${jobId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete job');
  }

  return response.json();
};

