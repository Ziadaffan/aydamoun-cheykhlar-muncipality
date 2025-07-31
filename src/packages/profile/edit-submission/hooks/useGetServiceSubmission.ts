import { useQuery } from '@tanstack/react-query';

export const useGetServiceSubmission = (submissionId: string) => {
  return useQuery({
    queryKey: ['serviceSubmission', submissionId],
    queryFn: () => getServiceSubmission(submissionId),
  });
};

const getServiceSubmission = async (submissionId: string) => {
  const response = await fetch(`/api/user/service-submissions/${submissionId}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch service submission');
      }
      return res.json();
    })
    .catch(err => {
      throw new Error('Failed to fetch service submission');
    });

  return response;
};
