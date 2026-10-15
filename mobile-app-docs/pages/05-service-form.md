# 05 — Service form

| | |
|---|---|
| **Route** | `/(tabs)/services/forms/[serviceId]` |
| **Web parity** | [src/app/services/forms/[serviceId]/page.tsx](../../src/app/services/forms/[serviceId]/page.tsx) → [ServiceFormPage.tsx](../../src/packages/services/forms/ServiceFormPage.tsx) |
| **Auth** | Public to open and fill; sending requires login |
| **API** | `GET /api/services/[serviceId]`, `POST /api/services/[serviceId]/submissions` |
| **App files** | `app/(tabs)/services/forms/[serviceId].tsx`, `features/services/submissionForm.tsx`, `features/services/fields.ts` |

## Purpose

Send a service request. Five fields are common to every service; the category's own
fields go into the `additionalInfo` JSON. **The app and the website use the same
fields, the same option values and the same rules**, so the dashboard shows the same
request whichever side sent it.

## Screen layout

```
┌─────────────────────────────────────┐
│  [<]  تقديم طلب                      │
├─────────────────────────────────────┤
│  Service name (header)              │
│  Service description                │
│                                     │
│  ▮ AuthNotice compact (guests only) │
│  ▮ Info: services.formInstructions  │
│                                     │
│  ┌── card ───────────────────────┐  │
│  │ الاسم الكامل *                  │  │
│  │ رقم الهاتف *   (03 123 456)     │  │
│  │ البريد الإلكتروني               │  │
│  │ العنوان *                       │  │
│  │ وصف مفصّل للطلب *               │  │
│  │ ── divider (only if the        │  │
│  │    category has fields) ──     │  │
│  │ category fields (table below)  │  │
│  └───────────────────────────────┘  │
│                                     │
│  ▮ "fix the red fields" / server    │
│    error banner                     │
│  [ إرسال الطلب ]  (guests: سجّل      │
│                    الدخول لإرسال)    │
│        مسح النموذج (when dirty)      │
└─────────────────────────────────────┘
```

## Rules (website = app = server)

| Field | Client rule (app and website) | Server (`submission.validation.ts`) |
|---|---|---|
| `fullName` | required, 2–100 | required, ≤ 100 |
| `phone` | required; normalized (Arabic-Indic digits, spaces, dashes, bidi marks removed), then 6–15 digits with an optional leading `+`; sent normalized | same normalization, 400 `INVALID_PHONE` |
| `email` | optional, valid address; blank → `null` | optional, 400 `INVALID_EMAIL` |
| `address` | required, 5–200 | required, ≤ 200 |
| `description` | required, 10–1000 | optional, ≤ 1000 (app 1.1.0 sent none) |
| `additionalInfo` | per category (below); empty optional fields are left out | flat object, ≤ 30 keys, values text (≤ 1000) or numbers; empty values dropped |

Other server errors: 400 `INVALID_SUBMISSION` (missing/too long field, malformed body or
`additionalInfo`), 401 (not logged in), 404 `SERVICE_NOT_FOUND`. Body fields other than
these six (`status`, `userId`, `serviceType`…) are ignored; a new request is always
`PENDING` and belongs to the session's user.

## Category fields

Source of truth: the website's [form.utils.ts](../../src/packages/services/utils/form.utils.ts)
(`getAdditionalFields`), mirrored by the app's `features/services/fields.ts`. Option values
are stored as the Arabic text shown.

| Service type (website category) | `additionalInfo` fields |
|---|---|
| `LICENSEES_AND_CONSTRUCTION_SERVICES` (`buildingLicenses`) | `propertyAddress`* text · `propertyType`* سكني/تجاري/صناعي · `constructionArea`* number · `existingBuilding`* نعم/لا |
| `ENVIRONMENTAL_SERVICES` (`environmentalServices`) | `location`* text · `urgency`* منخفض/متوسط/عالي |
| `ADMINISTRATIVE_SERVICES` (`administrativeTransactions`) | `propertyNumber` text · `eventDate` date |
| `DOWNLOAD_OFFICIAL_FORMS_SERVICES` (`officialForms`) | none |
| `COMPLAINTS_AND_SUGGESTIONS_SERVICES` (`complaintsAndSuggestions`) | `department`* الخدمات العامة/البيئة/الإدارة/أخرى · `priority`* منخفض/متوسط/عالي |
| `OTHER` (`additionalServices`) | `preferredDate` date · `preferredTime` صباحاً/مساءً |
| service `e0e69b72-4d3f-4a60-872e-fadb66ef590d` (own form) | `complaintNumber`* text · `type`* شكوى/اقتراح/استفسار · `department`* · `priority`* |

`*` = required. Numbers are sent as numbers (`"١٢٠٫٥"` → `120.5`). Dates are stored as
`YYYY-MM-DD` (older website requests hold a timestamp; both sides read it in Lebanon's
time zone). **The app has no date picker and leaves the two optional date fields out**;
a date saved from the website is kept when the request is edited in the app and shows in
its details.

Requests sent by app versions before 1.2 used other field names (`lotNumber`,
`buildingType: 'residential'`, `surfaceM2`, `issueType`, `documentType`, `purpose`,
`formType`, `reason`, `subject`, `type: 'complaint'`, `body`). The dashboard, the website
and the app still show them with Arabic labels (`LEGACY_FIELD_LABELS` in form.utils.ts,
`additionalInfoRows` in the app). `type` kept its name on the service with its own form:
an old `complaint`/`suggestion` shows as شكوى/اقتراح, and the app's edit form saves it as
that option (`currentOptionValue` in fields.ts).

## Behaviour (app)

- The service comes from the cached services list at once (`initialData`), then refreshes.
  A removed service shows «هذه الخدمة غير متوفرة حالياً» (404).
- Name, phone and email are prefilled from the account, also after logging in from the
  form, without overwriting anything typed.
- Guests can fill the form; the send button opens login with `next` = this form, which
  stays mounted underneath and keeps the typed values.
- Invalid submit: scroll to and focus the first error (screen order), haptic, banner.
- Leaving with unsaved data asks first (back, swipe, Android back, tab re-press). Reset is
  low-emphasis and confirmed.
- 401 while sending: session-expired toast, login opens, the form keeps its values.
- Success: `router.replace` (within the services stack) to
  [Submission success](06-submission-success.md) with the created id.

## Editing a request (app «طلباتي», website profile)

Residents can edit or delete a request only while it is `PENDING`; the server answers
409 `SUBMISSION_LOCKED` otherwise. Edits use the same rules, except that a category field
or the description the saved request never had (older requests) is not required
(`getSchema(type, { serviceId, saved })`). `PUT` changes only the fields present in the
body; `additionalInfo`, when sent, replaces the stored object.
