import { redirect } from 'next/navigation';

// Associations have no page of their own: old /associations/<id> links open its modal on the list.
export default async function AssociationRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/associations#${encodeURIComponent(id)}`);
}
