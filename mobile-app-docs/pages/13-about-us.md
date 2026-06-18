# 13 — About us

| | |
|---|---|
| **Route** | `/about-us` |
| **Web parity** | [src/app/about-us/page.tsx](../../src/app/about-us/page.tsx) → [AboutUsPage.tsx](../../src/packages/about-us/components/AboutUsPage.tsx) |
| **Auth** | Public |
| **API** | `GET /api/council` |

## Purpose

Introduce the municipality and its leadership. Three sections: municipality info (static), President (highlighted from council list), other council members.

## Screen layout

```
┌─────────────────────────────────────┐
│  [<]  About us                      │
├─────────────────────────────────────┤
│                                     │
│  ─── Municipality info ───          │
│  About Aydamoun Cheikh Lahr…        │
│  • Founded …                        │
│  • Population …                     │
│  • Mission statement                │
│                                     │
│  ─── President ───                  │
│  ┌─────────────────────────────┐    │
│  │   <large round photo>       │    │
│  │   Full name                 │    │
│  │   President                 │    │
│  │   📞 …  ✉ …                │    │
│  └─────────────────────────────┘    │
│                                     │
│  ─── Council members ───            │
│  ┌──────────┐  ┌──────────┐         │
│  │ <photo>  │  │ <photo>  │         │
│  │ Name     │  │ Name     │         │
│  │ Role     │  │ Role     │         │
│  │ 📞 ✉    │  │ 📞 ✉    │         │
│  └──────────┘  └──────────┘         │
│  …                                  │
└─────────────────────────────────────┘
```

## Data fetching

```ts
const { data: council, isLoading } = useQuery({
  queryKey: ['council'],
  queryFn: () => api<Council[]>('/api/council'),
});

const president = council?.find(m => m.position === 'PRESIDENT');
const others    = council?.filter(m => m.position !== 'PRESIDENT') ?? [];
```

## Sections

### Municipality info

Static, taken from translation file. Headings + bullet list. Possibly a Cloudinary hero image (the web component is `AboutUsMunicipalityInfoSection` — peek for the actual layout, but it's static copy).

### President

Single large card. Round avatar (160×160). Name big. Role label (translated). Contact icons; phone tap → `tel:`, email tap → `mailto:`. Whole card is non-pressable.

### Council members

2-col grid of compact cards. Each card same shape as the President card but smaller (avatar 96×96).

## Components

```tsx
function CouncilCard({ member, large }: { member: Council; large?: boolean }) {
  const size = large ? 160 : 96;
  return (
    <Card>
      <CldImage src={member.image ?? defaultAvatar} style={{ width: size, height: size, borderRadius: size/2, alignSelf: 'center' }} />
      <Text style={textStyles[large ? 'h2' : 'h3']}>{member.name}</Text>
      <Text>{t(`council.position.${member.position}`)}</Text>
      {member.phone && <ContactRow icon={Phone} onPress={() => Linking.openURL(`tel:${member.phone}`)} text={member.phone} />}
      {member.email && <ContactRow icon={Mail}  onPress={() => Linking.openURL(`mailto:${member.email}`)} text={member.email} />}
    </Card>
  );
}
```

## States

- Loading → `<LoadingScreen>`.
- Empty (council is empty) → just show municipality info.
- Error → `<ErrorState onRetry />`.

## i18n keys

`about.{municipality.title,municipality.body,president.title,council.title}`, `council.position.{PRESIDENT,VICE_PRESIDENT,COUNCIL_MEMBER}`.
