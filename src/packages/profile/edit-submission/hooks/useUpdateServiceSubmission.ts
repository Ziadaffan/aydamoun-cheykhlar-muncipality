import { useMutation } from '@tanstack/react-query';

export const useUpdateServiceSubmission = (submissionId: string) => {
  return useMutation({
    mutationFn: (data: any) => updateServiceSubmission(submissionId, data),
  });
};

const updateServiceSubmission = async (submissionId: string, data: any) => {
  const response = await fetch(`/api/user/service-submissions/${submissionId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to update service submission');
      }
      return res.json();
    })
    .catch(err => {
      throw new Error('Failed to update service submission');
    });

  return response;
};
