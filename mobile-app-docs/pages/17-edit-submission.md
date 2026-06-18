# 17 — Edit submission

| | |
|---|---|
| **Route** | `/(account)/profile/submissions/[id]/edit` |
| **Web parity** | [src/app/profile/edit-submission/[submissionId]/page.tsx](../../src/app/profile/edit-submission/[submissionId]/page.tsx) → [EditSubmissionPage.tsx](../../src/packages/profile/edit-submission/components/EditSubmissionPage.tsx) |
| **Auth** | **Required** (user can only touch their own submissions) |
| **API** | `GET /api/user/service-submissions/[id]`, `PUT /api/user/service-submissions/[id]`, `DELETE /api/user/service-submissions/[id]` |

## Purpose

Let a user revise an existing `PENDING` submission (or delete it). Once `IN_PROGRESS` / `COMPLETED` / `REJECTED`, edits are blocked.

## Screen layout

```
┌─────────────────────────────────────┐
│  [<]  Edit request                  │
├─────────────────────────────────────┤
│                                     │
│  Service name (h2)                  │
│  [ Pending ] badge                  │
│                                     │
│  Full name *                        │
│  [_____________________________]    │
│                                     │
│  Phone *                            │
│  [_____________________________]    │
│                                     │
│  Email                              │
│  [_____________________________]    │
│                                     │
│  Address *                          │
│  [_____________________________]    │
│                                     │
│  Description                        │
│  ┌────────────────────────────┐     │
│  └────────────────────────────┘     │
│                                     │
│  --- Category-specific fields ---   │
│                                     │
│  ▮ MessageBanner                    │
│                                     │
│  [ Delete ] (danger)                │
│  [ Cancel ]   [ Save changes ]      │
│                                     │
└─────────────────────────────────────┘
```

## Data fetching

```ts
const { id } = useLocalSearchParams<{ id: string }>();
const { data: submission, isLoading } = useQuery({
  queryKey: ['submission', id],
  queryFn: () => api<ServiceSubmission & { service: Service }>(
    `/api/user/service-submissions/${id}`
  ),
});
```

## Form

Reuse the same dynamic schema as [Service form](05-service-form.md), choosing the schema by `submission.service.type`. Default-fill from `submission`.

## Read-only mode

If `submission.status !== 'PENDING'`, render all fields as `<Text>` rows instead of inputs, and replace the action buttons with a single back button. Show an info banner at the top: "This request has been processed and can no longer be edited."

## Save

```ts
const save = useMutation({
  mutationFn: (values) =>
    api(`/api/user/service-submissions/${id}`, {
      method: 'PUT', body: JSON.stringify(values),
    }),
  onSuccess: () => {
    queryClient.invalidateQueries(['my-submissions']);
    queryClient.invalidateQueries(['submission', id]);
    router.back();
  },
});
```

## Delete

```ts
const del = useMutation({
  mutationFn: () =>
    api(`/api/user/service-submissions/${id}`, { method: 'DELETE' }),
  onSuccess: () => {
    queryClient.invalidateQueries(['my-submissions']);
    router.replace('/profile');
  },
});
```

Confirm via `Alert.alert('Delete request?', '…', [{ text: 'Cancel' }, { text: 'Delete', style: 'destructive', onPress: del.mutate }])`.

## States

- Loading → `<LoadingScreen>`.
- 404 / 403 → `<EmptyState>` + back to profile.
- Submitting → disable both Save and Delete; show spinner inside the active button.
