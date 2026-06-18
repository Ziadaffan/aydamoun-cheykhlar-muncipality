# 14 — Profile

| | |
|---|---|
| **Route** | `/(account)/profile` |
| **Web parity** | [src/app/profile/page.tsx](../../src/app/profile/page.tsx) → [ProfilePage.tsx](../../src/packages/profile/components/ProfilePage.tsx) |
| **Auth** | **Required** |
| **API** | `GET /api/user/service-submissions`, `DELETE /api/user/service-submissions/[id]` |

## Purpose

Logged-in user's home base. Shows account info, lets them edit it or change password, and lists their service submissions with status and edit/delete actions.

## Screen layout

```
┌─────────────────────────────────────┐
│  [≡]  Profile            [globe]    │
├─────────────────────────────────────┤
│                                     │
│  ┌── ProfileHeader ──────────────┐  │
│  │     <avatar>                  │  │
│  │     Full name (h2)            │  │
│  │     email · phone             │  │
│  └──────────────────────────────┘   │
│                                     │
│  [ Edit profile ]                   │
│  [ Change password ]                │
│  [ Log out ] (danger)               │
│                                     │
│  ─── My submissions ───             │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Building permit             │    │
│  │ Submitted May 22, 2026      │    │
│  │ [ Pending ]                 │    │
│  │ [ Edit ]   [ Delete ]       │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ …                           │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

## Data fetching

```ts
const { user } = useSession();

const submissions = useQuery({
  queryKey: ['my-submissions'],
  queryFn: () => api<(ServiceSubmission & { service: Service })[]>('/api/user/service-submissions'),
  staleTime: 0,
});
```

## Sections

### Profile header

- Avatar (use `user.image` if present, else initials placeholder).
- Name + email + phone rows. Long emails wrap.

### Action buttons

- "Edit profile" → `router.push('/profile/edit')` ([Edit profile](15-edit-profile.md))
- "Change password" → `router.push('/profile/change-password')` ([Change password](16-change-password.md))
- "Log out" (danger variant) → calls `signOut()` from session context, then `router.replace('/home')`.

### Submissions section

Heading "My submissions" + count.

#### `SubmissionCard`

| Element | Detail |
|---|---|
| Service name | `submission.service.name` |
| Submitted date | `date-fns format(createdAt, 'PPP')` |
| Status badge | `<StatusBadge status={submission.status} />` — see [01-design-system.md](../01-design-system.md#1-color-tokens) |
| Edit button | Only if `status === 'PENDING'`. Navigates to `/profile/submissions/[id]/edit` ([Edit submission](17-edit-submission.md)) |
| Delete button | Only if `status === 'PENDING'`. Opens confirmation `<Alert>`; on confirm → mutation below |

#### Delete mutation

```ts
const del = useMutation({
  mutationFn: (id: string) =>
    api(`/api/user/service-submissions/${id}`, { method: 'DELETE' }),
  onSuccess: () => queryClient.invalidateQueries(['my-submissions']),
});
```

#### Empty / loading / error

- Empty → `<EmptyState icon={Inbox}>` "No submissions yet — start one from Services".
- Loading → inline spinner under the header.
- Error → inline `<ErrorState onRetry={refetch} small />`.

## Pull-to-refresh

Yes — refetches submissions and session.

## Excluded vs web

Web shows an inline editable form on this page. We split that out to its own [Edit profile](15-edit-profile.md) screen for clarity on mobile.
