import { redirect } from 'next/navigation';

// Jobs have no page of their own: old /jobs/<id> links open the job's modal on the list.
export default async function JobRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/jobs#${encodeURIComponent(id)}`);
}
