# 20 — Privacy policy

| | |
|---|---|
| **Route** | `/legal/privacy-policy` |
| **Web parity** | [src/app/privacy-policy/page.tsx](../../src/app/privacy-policy/page.tsx) (currently a placeholder on web) |
| **Auth** | Public |
| **API** | None |

## Purpose

Static legal page. The municipality's privacy practices.

## Screen layout

```
┌─────────────────────────────────────┐
│  [<]  Privacy policy                │
├─────────────────────────────────────┤
│                                     │
│  Privacy policy (h1)                │
│  Last updated: …                    │
│                                     │
│  H2  Information we collect         │
│  Body…                              │
│                                     │
│  H2  How we use information         │
│  Body…                              │
│                                     │
│  H2  Sharing                        │
│  Body…                              │
│                                     │
│  H2  Contact                        │
│  Body…                              │
│                                     │
└─────────────────────────────────────┘
```

## Content source

The web app currently renders just `<div>Privacy Policy</div>` — there is no published copy yet. Options for mobile:

1. **Hardcode** the policy text in translations `legal.privacy.{lastUpdated, sections.*.title, sections.*.body}`. Easy to ship; needs an app update for changes.
2. **Fetch from a markdown file** on the Next.js host: e.g. `GET /legal/privacy-policy.md` (would need a backend addition). Renders with `react-native-markdown-display`.

Default: option 1 until the municipality publishes a canonical version.

## Components

- `<Screen scroll>`.
- Section components: `<H2>{title}</H2><Text>{body}</Text>`.
- A "Last updated" line at the top.

## Excluded

Nothing — purely informational.
