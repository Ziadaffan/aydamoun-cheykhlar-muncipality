# 02 — API integration

All endpoints below live on the Next.js host. Set `EXPO_PUBLIC_API_BASE_URL` in `.env` (e.g. `https://municipality.example.com`).

## Client wrapper

```ts
// lib/api.ts
const BASE = process.env.EXPO_PUBLIC_API_BASE_URL!;

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(await authHeader()), // see 03-authentication.md
      ...init.headers,
    },
  });
  if (!res.ok) throw await toApiError(res);
  return res.status === 204 ? (undefined as T) : res.json();
}
```

`authHeader()` returns `{ Authorization: 'Bearer <token>' }` with the token from `POST /api/auth/mobile-login` (see [Auth](#auth)), or `{}` for guests.

## Error model

Server returns:

```json
{ "error": "string", "code"?: "string", "details"?: {…} }
```

Status codes: `400` validation, `401` unauthenticated (also a token whose account no longer exists), `403` forbidden, `404` not found, `409` conflict, `422` new password too weak, `500` server.

`error` is a short developer message, in English on every endpoint the app uses (except `WEAK_PASSWORD`, see [Password rule](#password-rule)), so don't show it to residents. Choose the message from `code` when there is one, otherwise from the status:

| `code`                    | Status | Returned by                                                                                                       |
| ------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------- |
| `INVALID_CREDENTIALS`     | 401    | `POST /api/auth/mobile-login` (unknown identifier or wrong password)                                              |
| `MISSING_CREDENTIALS`     | 400    | `POST /api/auth/mobile-login`                                                                                     |
| `USER_EXISTS`             | 409    | `POST /api/auth/signup`, `PUT /api/user` (email or phone already used by another account)                         |
| `EMAIL_OR_PHONE_REQUIRED` | 400    | `POST /api/auth/signup`, `PUT /api/user`                                                                          |
| `INVALID_PHONE`           | 400    | `POST /api/auth/signup`, `PUT /api/user` (after normalization, not 6–15 digits with an optional leading `+`)      |
| `PASSWORD_REQUIRED`       | 400    | `POST /api/auth/signup`, `PATCH /api/user`, `DELETE /api/user`                                                    |
| `INVALID_PASSWORD`        | 400    | `PATCH /api/user` (wrong `oldPassword`), `DELETE /api/user` (wrong `password`)                                    |
| `SAME_PASSWORD`           | 400    | `PATCH /api/user`                                                                                                 |
| `WEAK_PASSWORD`           | 422    | `POST /api/auth/signup`, `PATCH /api/user`, `POST /api/auth/reset-password` (see [Password rule](#password-rule)) |
| `INVALID_TOKEN`           | 400    | `POST /api/auth/reset-password` (unknown, used or expired reset link)                                             |
| `USER_NOT_FOUND`          | 401    | `GET`/`PUT`/`PATCH`/`DELETE /api/user`: the token is valid but the account was deleted; sign out locally          |
| `EMAIL_REQUIRED`          | 400    | `POST /api/auth/forgot-password`                                                                                  |
| `INVALID_CATEGORY`        | 400    | `GET /api/news?category=…`                                                                                        |

Phone numbers are normalized on the server before they are stored or looked up (signup, login, profile update): Arabic-Indic `٠-٩` and Persian `۰-۹` digits become `0-9`; whitespace (including no-break spaces), `-` and the Unicode dashes U+2010–2015 and U+2212, dots, slashes, parentheses and the invisible bidi/format marks (U+061C, U+200B–200F, U+202A–202E, U+2066–2069, U+FEFF) are removed; one leading `+` is kept and any other `+` dropped. `"٠٣ ١٢٣ ٤٥٦"`, `"03-123-456"`, `"03/123456"` and `"03123456"` reach the same account. The server (`src/packages/common/utils/phone.utils.ts`) and the app (`lib/phone.ts`) implement the same function; keep them in sync. After normalization a new or changed number must be 6–15 digits with an optional leading `+`. Numbers stored before normalization existed keep their old form: as typed on the website's profile form (`"03 123 456"`), or with only spaces and dashes removed by the old signup (`"03/123456"`). Login, the signup duplicate check and the profile conflict check therefore also try the number exactly as typed and with only spaces and dashes removed (`phoneLookupValues`), so those accounts keep working.

### Password rule

New passwords (signup, `PATCH /api/user`, reset from the email link) need at least 6 characters with a lower-case letter, an upper-case letter and a digit (the website's rule, `common.validation.ts`). The server rejects others with `422 WEAK_PASSWORD`; its `error` text is Arabic so that app 1.1.0, which shows that text as is, explains the rule. Logins and the current-password checks of `PATCH`/`DELETE /api/user` accept older, weaker passwords.

## Endpoint inventory (public + user-scoped only)

### Auth

| Method | Path                        | Auth   | Used by                                                                        |
| ------ | --------------------------- | ------ | ------------------------------------------------------------------------------ |
| `POST` | `/api/auth/mobile-login`    | —      | [Login](pages/18-login.md): `{ identifier, password }` → `{ token, user }`     |
| `POST` | `/api/auth/signup`          | —      | [Signup](pages/19-signup.md): → `201 { message, user }`                        |
| `GET`  | `/api/user`                 | Bearer | App launch and return to foreground (who am I): → `{ user, token? }`           |
| `POST` | `/api/auth/forgot-password` | —      | [Login](pages/18-login.md) "Forgot password?": `{ email }` → `200 { message }` |
| `POST` | `/api/auth/reset-password`  | —      | Web page opened from the email link: `{ token, password }`                     |
| `POST` | `/api/auth/logout`          | —      | Optional, does nothing server-side and returns 200; logout is local            |

Do not call `/api/auth/session` or `/api/auth/signout` from the app: they are NextAuth's cookie endpoints for the website, ignore Bearer tokens, and `/api/auth/session` answers `{}`, which looks like "signed out".

Login body (JSON). `identifier` is an email (matched case-insensitively) or a phone number (normalized, see above):

```json
{ "identifier": "string", "password": "string" }
```

`200 { token, user }` with the same `user` shape as `GET /api/user`. Errors: `400 MISSING_CREDENTIALS`, `401 INVALID_CREDENTIALS`, `500` on server failure.

Token: an HS256 JWT valid for 30 days. Send it as `Authorization: Bearer <token>`. `GET /api/user` returns a fresh `token` whenever the one it received is more than 24 hours old: save it in place of the old one (sliding session), so anyone who opens the app at least once a month stays signed in. Only a `401` from `GET /api/user` means the session is over. A network error, timeout or `5xx` says nothing about the session, so keep it and try again later.

`GET /api/user`:

- `200 { user }` or `200 { user, token }` (see above).
- `401 { error: 'Unauthorized' }` when the token is missing, invalid or expired.
- `401 { error: 'User not found', code: 'USER_NOT_FOUND' }` when the account was deleted.

Signup body:

```json
{ "name": "string", "email"?: "string", "phone"?: "string", "password": "string" }
```

At least one of `email` / `phone` is required. Empty strings count as absent, so an email-only signup can send `"phone": ""`. Signup does not log in: call `mobile-login` next. Errors: `400 EMAIL_OR_PHONE_REQUIRED | INVALID_PHONE | PASSWORD_REQUIRED`, `422 WEAK_PASSWORD`, `409 USER_EXISTS` (a `400` with the message `User with this email or phone already exists` and no code on deployments before the error codes).

Forgot password: always `200 { message }` when `email` is present, whether or not an account exists, so the response can't be used to probe for accounts. If an account with that email exists, it receives a link to `/auth/reset-password` on the website, valid for 1 hour, and the new password is set there. Phone-only accounts can't receive the link: the municipality sets a temporary password for them from the admin page. Errors: `400 EMAIL_REQUIRED`, and `500` if the email could not be sent.

Reset password (website only, body `{ token, password }`): `200 { message }`; `400 INVALID_TOKEN` for an unknown, used or expired link; `422 WEAK_PASSWORD`.

### News

| Method | Path                                  | Auth | Returns                                                                         |
| ------ | ------------------------------------- | ---- | ------------------------------------------------------------------------------- |
| `GET`  | `/api/news`, `/api/news?category=ALL` | —    | `News[]`, every category, newest first                                          |
| `GET`  | `/api/news?category=<NewsCategory>`   | —    | `News[]` in that category, newest first. Unknown value → `400 INVALID_CATEGORY` |
| `GET`  | `/api/news?category=ALL&summary=1`    | —    | `NewsSummary[]`: for lists, see below                                           |
| `GET`  | `/api/news/featured`                  | —    | `News` (the newest featured article) or `null`                                  |
| `GET`  | `/api/news/featured?summary=1`        | —    | `NewsSummary` or `null`                                                         |
| `GET`  | `/api/news/categories`                | —    | `NewsCategory[]` that have at least one article                                 |
| `GET`  | `/api/news/[id]`                      | —    | `News`, the full article. `404` if unknown                                      |

`summary=1` (or `summary=true`) works with or without `category`. It drops `content` and keeps only the first image (`imageUrl` has at most one entry). Use it for every list and card, and fetch `/api/news/[id]` for the full article and gallery.

`imageUrl` entries are Cloudinary `https://` URLs. Articles saved before the image migration (`yarn migrate:news-images`) still hold raw base64 without a `data:` prefix until that script has been run, so clients should accept both.

No endpoint changes `views` today: it stays at its stored value.

### Services

| Method | Path                                    | Auth | Returns             |
| ------ | --------------------------------------- | ---- | ------------------- |
| `GET`  | `/api/services`                         | —    | `Service[]`         |
| `GET`  | `/api/services/[serviceId]`             | —    | `Service`           |
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

| Method   | Path                                 | Auth | Body / Returns                              |
| -------- | ------------------------------------ | ---- | ------------------------------------------- |
| `GET`    | `/api/user`                          | user | → `{ user, token? }` (see [Auth](#auth))    |
| `PUT`    | `/api/user`                          | user | `{ name?, email?, phone? }` → `{ user }`    |
| `PATCH`  | `/api/user`                          | user | `{ oldPassword, newPassword }` → `{ user }` |
| `DELETE` | `/api/user`                          | user | `{ password }` → `{ message }`              |
| `GET`    | `/api/user/service-submissions`      | user | `ServiceSubmission[]`                       |
| `GET`    | `/api/user/service-submissions/[id]` | user | `ServiceSubmission`                         |
| `PUT`    | `/api/user/service-submissions/[id]` | user | partial submission → updated                |
| `DELETE` | `/api/user/service-submissions/[id]` | user | `{ message }`                               |

`PUT /api/user`: only the fields sent are changed, and `""` or `null` clears `email`/`phone`. At least one of the two must remain. Errors: `400 EMAIL_OR_PHONE_REQUIRED | INVALID_PHONE`, `409 USER_EXISTS` (the email or phone belongs to another account). A phone number that has not changed is not re-validated.

`PATCH /api/user`: errors `400 PASSWORD_REQUIRED | INVALID_PASSWORD | SAME_PASSWORD`, `422 WEAK_PASSWORD` (checked in that order). `INVALID_PASSWORD` is a `400`, never a `401`: it must not end the session. Validate the [password rule](#password-rule) in the client too. Existing tokens stay valid after a change.

`DELETE /api/user` (body `{ password }`, sent as JSON with the `DELETE`): permanently deletes the account and, through the `ON DELETE CASCADE` foreign key, all of its service requests. On `200`, clear the local session. Errors: `400 PASSWORD_REQUIRED | INVALID_PASSWORD`.

Every `/api/user` method answers `401 USER_NOT_FOUND` when the token belongs to a deleted account.

### Jobs

| Method | Path             | Auth | Returns |
| ------ | ---------------- | ---- | ------- |
| `GET`  | `/api/jobs`      | —    | `Job[]` |
| `GET`  | `/api/jobs/[id]` | —    | `Job`   |

### Documents

| Method | Path             | Auth | Returns      |
| ------ | ---------------- | ---- | ------------ |
| `GET`  | `/api/documents` | —    | `Document[]` |

### Associations

| Method | Path                     | Auth | Returns         |
| ------ | ------------------------ | ---- | --------------- |
| `GET`  | `/api/associations`      | —    | `Association[]` |
| `GET`  | `/api/associations/[id]` | —    | `Association`   |

### Taxi stops

| Method | Path                   | Auth | Returns      |
| ------ | ---------------------- | ---- | ------------ |
| `GET`  | `/api/taxi-stops`      | —    | `TaxiStop[]` |
| `GET`  | `/api/taxi-stops/[id]` | —    | `TaxiStop`   |

### Council

| Method | Path           | Auth | Returns     |
| ------ | -------------- | ---- | ----------- |
| `GET`  | `/api/council` | —    | `Council[]` |

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
  | 'MUNICIPAL_NEWS'
  | 'DEVELOPMENT_PROJECTS'
  | 'ANNOUNCEMENTS'
  | 'COMMUNITY_EVENTS'
  | 'INFRASTRUCTURE'
  | 'ENVIRONMENTAL'
  | 'SOCIAL_SERVICES'
  | 'HEALTH_AND_SOCIAL_SERVICES'
  | 'OTHER';

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
  content: string; // HTML
  excerpt: string;
  imageUrl: string[]; // Cloudinary https URLs; raw base64 (no data: prefix) on rows not yet migrated
  category: NewsCategory;
  author: string;
  views: number;
  featured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ?summary=1: no `content`, and imageUrl holds at most the first image.
type NewsSummary = Omit<News, 'content'>;

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
  service?: Service; // included when expanded
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
  deadline: string | null; // ISO
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Document {
  id: string;
  title: string;
  description: string | null;
  type: string; // file extension
  fileUrl: string; // Cloudinary URL
  createdAt: string;
  updatedAt: string;
}

interface Association {
  id: string;
  name: string;
  description: string;
  picaURL: string; // image URL
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
api('/api/services/<id>/submissions', {
  method: 'POST',
  body: fd,
  headers: {
    /* drop content-type so RN sets boundary */
  },
});
```
