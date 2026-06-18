# 02 — API integration

All endpoints below live on the Next.js host. Set `EXPO_PUBLIC_API_BASE_URL` in `.env` (e.g. `https://municipality.example.com`).

## Client wrapper

```ts
// lib/api.ts
const BASE = process.env.EXPO_PUBLIC_API_BASE_URL!;

export async function api<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(await authHeader()),         // see 03-authentication.md
      ...init.headers,
    },
  });
  if (!res.ok) throw await toApiError(res);
  return res.status === 204 ? (undefined as T) : res.json();
}
```

`authHeader()` returns either `{ Cookie: '…' }` or `{ Authorization: 'Bearer …' }` depending on the auth strategy chosen in [03-authentication.md](03-authentication.md).

## Error model

Server returns:

```json
{ "error": "string", "code"?: "string", "details"?: {…} }
```

Status codes: `400` validation, `401` unauthenticated, `403` forbidden, `404` not found, `409` conflict (e.g. `USER_EXISTS`), `500` server. Translate `error` through i18n where a key matches; otherwise show the literal string.

## Endpoint inventory (public + user-scoped only)

### Auth

| Method | Path | Auth | Used by |
|---|---|---|---|
| `POST` | `/api/auth/signup` | — | [Signup](pages/19-signup.md) |
| `POST` | `/api/auth/callback/credentials` | — | [Login](pages/18-login.md) (NextAuth) |
| `GET` | `/api/auth/session` | session cookie | App boot (whoami) |
| `POST` | `/api/auth/signout` | session cookie | Logout button |
| `POST` | `/api/auth/logout` | — | Optional helper, returns 200 |

Signup body:
```json
{ "name": "string", "email"?: "string", "phone"?: "string", "password": "string" }
```
At least one of `email` / `phone` is required.

Login body (form-encoded for NextAuth credentials callback):
```
identifier=<email-or-phone>&password=<pwd>&csrfToken=<from /api/auth/csrf>&json=true
```

### News

| Method | Path | Auth | Returns |
|---|---|---|---|
| `GET` | `/api/news` | — | `News[]` |
| `GET` | `/api/news?category=<NewsCategory>` | — | `News[]` filtered |
| `GET` | `/api/news/featured` | — | `News` (most recent featured) |
| `GET` | `/api/news/categories` | — | `NewsCategory[]` |
| `GET` | `/api/news/[id]` | — | `News` (increments view count) |

### Services

| Method | Path | Auth | Returns |
|---|---|---|---|
| `GET` | `/api/services` | — | `Service[]` |
| `GET` | `/api/services/[serviceId]` | — | `Service` |
| `POST` | `/api/services/[serviceId]/submissions` | user | `ServiceSubmission` |

Submission body (JSON):
```json
{
  "fullName": "string",
  "phone": "string",
  "email": "string?",
  "address": "string",
  "description": "string?",
  "additionalInfo": { "...": "category-specific" }
}
```

### My account

| Method | Path | Auth | Body / Returns |
|---|---|---|---|
| `PUT` | `/api/user` | user | `{ name?, email?, phone? }` → `{ user }` |
| `PATCH` | `/api/user` | user | `{ oldPassword, newPassword }` → `{ user }` |
| `GET` | `/api/user/service-submissions` | user | `ServiceSubmission[]` |
| `GET` | `/api/user/service-submissions/[id]` | user | `ServiceSubmission` |
| `PUT` | `/api/user/service-submissions/[id]` | user | partial submission → updated |
| `DELETE` | `/api/user/service-submissions/[id]` | user | `{ message }` |

### Jobs

| Method | Path | Auth | Returns |
|---|---|---|---|
| `GET` | `/api/jobs` | — | `Job[]` |
| `GET` | `/api/jobs/[id]` | — | `Job` |

### Documents

| Method | Path | Auth | Returns |
|---|---|---|---|
| `GET` | `/api/documents` | — | `Document[]` |

### Associations

| Method | Path | Auth | Returns |
|---|---|---|---|
| `GET` | `/api/associations` | — | `Association[]` |
| `GET` | `/api/associations/[id]` | — | `Association` |

### Taxi stops

| Method | Path | Auth | Returns |
|---|---|---|---|
| `GET` | `/api/taxi-stops` | — | `TaxiStop[]` |
| `GET` | `/api/taxi-stops/[id]` | — | `TaxiStop` |

### Council

| Method | Path | Auth | Returns |
|---|---|---|---|
| `GET` | `/api/council` | — | `Council[]` |

## Data shapes (TypeScript)

```ts
type Role = 'USER' | 'ADMIN';

type ServiceType =
  | 'LICENSEES_AND_CONSTRUCTION_SERVICES'
  | 'ENVIRONMENTAL_SERVICES'
  | 'ADMINISTRATIVE_SERVICES'
  | 'DOWNLOAD_OFFICIAL_FORMS_SERVICES'
  | 'COMPLAINTS_AND_SUGGESTIONS_SERVICES'
  | 'OTHER';

type Position = 'PRESIDENT' | 'VICE_PRESIDENT' | 'COUNCIL_MEMBER';

type ServiceStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';

type NewsCategory =
  | 'MUNICIPAL_NEWS' | 'DEVELOPMENT_PROJECTS' | 'ANNOUNCEMENTS'
  | 'COMMUNITY_EVENTS' | 'INFRASTRUCTURE' | 'ENVIRONMENTAL'
  | 'SOCIAL_SERVICES' | 'HEALTH_AND_SOCIAL_SERVICES' | 'OTHER';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

interface News {
  id: string;
  title: string;
  content: string;     // HTML
  excerpt: string;
  imageUrl: string[];  // Cloudinary URLs OR base64 data URIs
  category: NewsCategory;
  author: string;
  views: number;
  featured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  type: ServiceType;
  createdAt: string;
  updatedAt: string;
}

interface ServiceSubmission {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  address: string;
  description: string | null;
  additionalInfo: Record<string, unknown>;
  status: ServiceStatus;
  userId: string;
  serviceId: string;
  service?: Service;   // included when expanded
  createdAt: string;
  updatedAt: string;
}

interface Job {
  id: string;
  title: string;
  description: string | null;
  provider: string;
  phone: string | null;
  location: string;
  salary: string | null;
  deadline: string | null;  // ISO
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Document {
  id: string;
  title: string;
  description: string | null;
  type: string;        // file extension
  fileUrl: string;     // Cloudinary URL
  createdAt: string;
  updatedAt: string;
}

interface Association {
  id: string;
  name: string;
  description: string;
  picaURL: string;     // image URL
  createdAt: string;
  updatedAt: string;
}

interface TaxiStop {
  id: string;
  name: string;
  fromLocation: string;
  toLocation: string;
  hour: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

interface Council {
  id: string;
  name: string;
  position: Position;
  phone: string | null;
  email: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}
```

## React Query conventions

- One hook per endpoint, file-collocated in `features/<feature>/queries.ts`.
- Query keys: `['news', { category }]`, `['news', id]`, `['services'], ['my-submissions']`, etc.
- Invalidate `['my-submissions']` after any create/update/delete on a submission.
- Invalidate `['session']` after PUT/PATCH `/api/user` so the new name/email shows in the drawer.
- `staleTime`: `5 * 60_000` for list endpoints, `0` for `/api/user/service-submissions` (status changes server-side).

## Multipart uploads

The web admin uses `multipart/form-data` for image-bearing endpoints. Since the mobile app has **no admin features**, the only place it sends a file is potentially the service form (some categories accept document attachments). When you do, build with `FormData`:

```ts
const fd = new FormData();
fd.append('fullName', fullName);
fd.append('attachment', { uri: pickedUri, name: 'file.pdf', type: 'application/pdf' } as any);
api('/api/services/<id>/submissions', { method: 'POST', body: fd, headers: { /* drop content-type so RN sets boundary */ } });
```
