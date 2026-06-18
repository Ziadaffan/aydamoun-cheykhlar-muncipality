# 03 — Authentication

## ⚠️ Important caveat — read first

The web app uses **NextAuth with JWT-in-cookie** ([src/lib/auth.ts](../src/lib/auth.ts)). NextAuth issues an `HttpOnly` cookie named `next-auth.session-token` (or `__Secure-next-auth.session-token` in prod) and every protected API route reads it via `getServerSession()`.

That is awkward for a native client because:

1. NextAuth's `/api/auth/callback/credentials` returns a redirect (`302`) by default. The mobile client must send `json: true` and disable redirects to get a JSON response, then read the `Set-Cookie` header.
2. React Native's `fetch` does **not** persist cookies across calls by default.
3. The cookie is `HttpOnly`, so we can't read it from JS in a browser context — but in React Native we can because we're parsing the response header ourselves.

**Two viable strategies. Pick one and tell the backend team.**

### Strategy A — Replay the NextAuth cookie (no backend changes)

1. On login, hit `GET /api/auth/csrf` → get `{ csrfToken }`.
2. POST to `/api/auth/callback/credentials?json=true` with body `csrfToken=…&identifier=…&password=…&json=true` as `application/x-www-form-urlencoded`. Set `redirect: 'manual'` on the fetch.
3. Read the response's `set-cookie` header. Parse out `next-auth.session-token=…` (and `__Host-next-auth.csrf-token` for renewals).
4. Persist the cookie value in **`expo-secure-store`** keyed by `auth.cookie`.
5. On every subsequent API call, set `headers: { Cookie: 'next-auth.session-token=<value>' }`.
6. To check who's logged in, `GET /api/auth/session` with the cookie header — returns `{ user: { id, name, email, role, ... }, expires }`.
7. Logout: `POST /api/auth/signout` with the cookie, then delete the stored value.

Pros: no backend work. Cons: brittle if NextAuth bumps version; cookie names differ between dev/prod (`__Secure-` prefix on HTTPS).

### Strategy B — Add a mobile-friendly auth endpoint (recommended)

Ask the backend team to add **one** new route, `POST /api/auth/mobile-login`, that:

- Accepts `{ identifier, password }` as JSON.
- Validates credentials with the same bcrypt comparison `authOptions.authorize()` already does.
- Signs a JWT (using `NEXTAUTH_SECRET` + the same `next-auth/jwt` `encode()` helper) and returns it as `{ token, user, expiresAt }`.
- Also add `POST /api/auth/mobile-refresh` that takes a near-expiry token and re-issues one.

Then update `withAuth` / API routes to additionally accept `Authorization: Bearer <token>` — they can verify via `decode()` from `next-auth/jwt`.

Pros: clean Bearer-token model, no cookie parsing, easy to test. Cons: requires backend change.

**The rest of this doc assumes Strategy A**, since the user said *"the mobile app will call the API of the Next app"* with no backend changes. Adjust if Strategy B is adopted.

## Token storage

```ts
import * as SecureStore from 'expo-secure-store';

const KEY = 'auth.cookie';

export const saveCookie = (v: string) => SecureStore.setItemAsync(KEY, v);
export const loadCookie = () => SecureStore.getItemAsync(KEY);
export const clearCookie = () => SecureStore.deleteItemAsync(KEY);
```

`authHeader()` used by `api()` (see [02-api-integration.md](02-api-integration.md)):

```ts
export async function authHeader(): Promise<HeadersInit> {
  const cookie = await loadCookie();
  return cookie ? { Cookie: cookie } : {};
}
```

## Session context

```ts
// features/auth/SessionContext.tsx
const SessionContext = createContext<{
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}>(/* ... */);
```

On app boot:

1. Read the saved cookie.
2. If present, `GET /api/auth/session`. If it returns `{ user }`, set context. If not, clear stored cookie.
3. If absent, `user = null`.

## Login flow (Strategy A)

```ts
async function login({ identifier, password }) {
  // 1. CSRF token
  const csrfRes = await fetch(`${BASE}/api/auth/csrf`, { credentials: 'omit' });
  const { csrfToken } = await csrfRes.json();
  const csrfCookie = csrfRes.headers.get('set-cookie') ?? '';

  // 2. Credentials callback (force JSON, no redirect)
  const body = new URLSearchParams({
    csrfToken, identifier, password, json: 'true',
    callbackUrl: `${BASE}/`,
  }).toString();

  const res = await fetch(`${BASE}/api/auth/callback/credentials?json=true`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: csrfCookie,
    },
    body,
    redirect: 'manual',
  });

  // NextAuth returns 200 + Set-Cookie on success, 401-style error JSON on bad creds.
  const setCookie = res.headers.get('set-cookie');
  if (!setCookie?.includes('next-auth.session-token')) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const sessionCookie = parseCookie(setCookie, 'next-auth.session-token');
  await saveCookie(`next-auth.session-token=${sessionCookie}`);

  // 3. Fetch user
  const session = await api<{ user: User }>('/api/auth/session');
  return session.user;
}
```

`parseCookie` is a one-line helper that walks the `set-cookie` header (RN concatenates multiple cookies with `, ` — use `set-cookie-parser` if it gets messy).

## Signup flow

```ts
async function signup(input: SignupInput) {
  await api('/api/auth/signup', { method: 'POST', body: JSON.stringify(input) });
  // Then auto-login:
  return login({
    identifier: input.email ?? input.phone!,
    password: input.password,
  });
}
```

## Logout

```ts
async function logout() {
  try { await api('/api/auth/signout', { method: 'POST' }); } catch {}
  await clearCookie();
  // navigate to /auth/login or to home
}
```

## Validation schemas

Mirror these from [src/packages/auth/validation/auth.validation.ts](../src/packages/auth/validation/auth.validation.ts):

```ts
import * as yup from 'yup';

const phoneRegex = /^[0-9+\-\s]{6,20}$/;
const password = yup.string().min(6, 'errors.password.min').required('errors.required');

export const loginSchema = yup.object({
  identifier: yup
    .string().trim().required('errors.required')
    .test('email-or-phone', 'errors.identifier.invalid', (v) =>
      !!v && (yup.string().email().isValidSync(v) || phoneRegex.test(v))
    ),
  password,
});

export const signupSchema = yup.object({
  name: yup.string().trim().min(2).max(50).required(),
  email: yup.string().email().nullable().notRequired(),
  phone: yup.string().matches(phoneRegex).nullable().notRequired(),
  password,
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'errors.passwordMismatch').required(),
}).test('email-or-phone', 'errors.atLeastOne', (v) => !!(v.email || v.phone));
```

## Protected routes on mobile

Wrap each protected screen in `<RequireAuth>`:

```tsx
function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useSession();
  if (loading) return <LoadingScreen />;
  if (!user) return <AuthGate />; // shows AuthBanner + Login / Signup buttons
  return <>{children}</>;
}
```

The following screens must use it:

- [Service Form](pages/05-service-form.md)
- [Submission Success](pages/06-submission-success.md) (technically reachable post-submit only)
- [Profile](pages/14-profile.md)
- [Edit Profile](pages/15-edit-profile.md)
- [Change Password](pages/16-change-password.md)
- [Edit Submission](pages/17-edit-submission.md)
