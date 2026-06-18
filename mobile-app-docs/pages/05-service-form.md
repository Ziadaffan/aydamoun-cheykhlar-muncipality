# 05 — Service form

| | |
|---|---|
| **Route** | `/(tabs)/services/forms/[serviceId]` |
| **Web parity** | [src/app/services/forms/[serviceId]/page.tsx](../../src/app/services/forms/[serviceId]/page.tsx) → [ServiceFormPage.tsx](../../src/packages/services/forms/ServiceFormPage.tsx) |
| **Auth** | **Required** (`RequireAuth`) |
| **API** | `GET /api/services/[serviceId]`, `POST /api/services/[serviceId]/submissions` |

## Purpose

Dynamic form to submit a service request. Most fields are common to all services; the `additionalInfo` JSON varies by category.

## Screen layout

```
┌─────────────────────────────────────┐
│  [<]  Apply                         │
├─────────────────────────────────────┤
│                                     │
│  Service name (h2)                  │
│  Service description (body)         │
│                                     │
│  Banner: services.formInstructions  │
│  (yellow tint)                      │
│                                     │
│  ─── divider ───                    │
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
│  │                            │     │
│  │                            │     │
│  └────────────────────────────┘     │
│                                     │
│  ─── Category-specific fields ───   │
│  (rendered dynamically — see below) │
│                                     │
│  ▮ MessageBanner (success | error)  │
│                                     │
│  [ Reset ]      [ Submit request ]  │
│                                     │
└─────────────────────────────────────┘
```

Wrap in `<KeyboardAvoidingView behavior="padding">` + scrolling.

## Data fetching

```ts
const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
const { data: service, isLoading } = useQuery({
  queryKey: ['service', serviceId],
  queryFn: () => api<Service>(`/api/services/${serviceId}`),
});
```

## Form

```ts
type CommonValues = {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  description?: string;
};

const baseSchema = yup.object({
  fullName: yup.string().trim().min(2).max(100).required(),
  phone:    yup.string().matches(/^[0-9+\-\s]{6,20}$/).required(),
  email:    yup.string().email().nullable(),
  address:  yup.string().trim().min(2).max(200).required(),
  description: yup.string().max(1000).nullable(),
});
```

Compose the per-category schema on top:

```ts
const schemaByType: Record<ServiceType, yup.AnyObjectSchema> = {
  LICENSEES_AND_CONSTRUCTION_SERVICES: baseSchema.concat(yup.object({
    additionalInfo: yup.object({
      lotNumber: yup.string().required(),
      buildingType: yup.string().required(),
      surfaceM2: yup.number().positive().required(),
    }),
  })),
  ENVIRONMENTAL_SERVICES: baseSchema.concat(yup.object({
    additionalInfo: yup.object({
      issueType: yup.string().required(),
      location: yup.string().required(),
    }),
  })),
  // … fill in for ADMINISTRATIVE, OFFICIAL_FORMS, COMPLAINTS, OTHER
};
```

Pre-fill `fullName`, `phone`, `email` from `useSession().user` for ergonomics; user can edit before submitting.

## Category-specific fields

Render via a `<DynamicFields type={service.type} />` component. Suggested fields per type (mirror what the web's `ServiceForm` ultimately stores in `additionalInfo`):

| Category | Extra fields |
|---|---|
| `LICENSEES_AND_CONSTRUCTION_SERVICES` | Lot number, Building type (Picker), Surface (m²), Attachments (image[]) |
| `ENVIRONMENTAL_SERVICES` | Issue type (Picker: pollution / waste / other), Precise location (textarea + map pin), Photos |
| `ADMINISTRATIVE_SERVICES` | Document type (Picker), Purpose (textarea) |
| `DOWNLOAD_OFFICIAL_FORMS_SERVICES` | Form type (Picker — populated from `/api/documents`), Reason |
| `COMPLAINTS_AND_SUGGESTIONS_SERVICES` | Subject, Type (Picker: complaint / suggestion), Photos (optional) |
| `OTHER` | Subject, Free-text body |

**Verify these against the actual web component** ([ServiceForm.tsx](../../src/packages/services/forms/ServiceForm.tsx)) before implementing — they're inferred from the data model.

## Submit

```ts
const submit = useMutation({
  mutationFn: (values) => api<ServiceSubmission>(
    `/api/services/${serviceId}/submissions`,
    { method: 'POST', body: JSON.stringify(values) }
  ),
  onSuccess: () => {
    queryClient.invalidateQueries(['my-submissions']);
    router.replace('/services/submission-success');
  },
});
```

If `additionalInfo` includes file pickers, switch the body to `FormData` (see [02-api-integration.md](../02-api-integration.md#multipart-uploads)).

## States

- **Loading service**: `<LoadingScreen />`.
- **Service not found**: `<EmptyState>` + back button.
- **Submitting**: disable submit button, show spinner inside it.
- **Server error**: `<MessageBanner type="error" message={err.message} dismissable />`.

## Excluded

No success modal — we route to the dedicated [Submission Success](06-submission-success.md) screen.
