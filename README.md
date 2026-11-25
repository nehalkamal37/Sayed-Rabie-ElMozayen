# Sayed Rabie El Mozayen website

Local prototype: Next.js App Router, TypeScript, plain CSS. Arabic (RTL) lives at
`/`, English (LTR) at `/en/`. Not deployed.

```bash
npm install
npm run dev -- -H localhost   # http://localhost:3000, this computer only
npm run typecheck
npm run lint
npm run build
```

## Routes

| Page | Arabic | English |
| --- | --- | --- |
| Home | `/` | `/en/` |
| Services & prices | `/services` | `/en/services` |
| Branch directory | `/branches` | `/en/branches` |
| Branch details | `/branches/<branch id>` | `/en/branches/<branch id>` |
| Groom package | `/groom-package` | `/en/groom-package` |
| Privacy policy | `/privacy` | `/en/privacy` |
| Booking request | `/book` | `/en/book` |

The visual specification is `design-handoff/`, which covers home, services and the
Madinaty branch page in Arabic. The other pages and all English pages follow from it.

Branches marked `draft` in `branches.ts`, and the privacy page, are labelled and
`noindex`. Remove the flag once the client approves them. The privacy page holds no
policy text yet: it needs approved copy before launch.

## Where things live

- `src/content/ar.ts`, `src/content/en.ts`: page copy. English must match the Arabic keys.
- `src/data/branches.ts`: one record per branch, shared by every page and both languages.
- `src/data/services.ts`: service IDs, names, descriptions, time, price and availability.
- `src/data/site.ts`: brand name, site URL, booking phone, booking WhatsApp, reviews.
- `src/data/photos.ts`: every photo and the handoff file it came from.
- `src/styles/tokens.css`: approved palette and typeface.
- `refrences/`, `design-handoff/`: client files. Read-only, never served.

## Booking

Every Book control is a link to `/book` with `?branch=` and `?service=`, and opens
the booking sheet (phones) or side panel (desktop) in place. Choices carried in
appear as changeable rows. `/book` remains the three-step page and the fallback
without JavaScript. Both share validation, draft storage and the WhatsApp message
in `src/lib/booking.ts`.

Nothing is submitted to a server. Until `bookingWhatsApp` is verified, a complete
request ends in a message preview marked as not sent. Once verified, it opens
WhatsApp with the message ready, and the copy says the visitor still presses send.

## Approving unverified facts

Unapproved facts are `pending` and carry no value. Replace `pending` with
`verified(...)` (from `src/data/verification.ts`) once the client approves them:

- `bookingWhatsApp` in `site.ts`: turns on every WhatsApp action and the handoff.
- `minutes`, `price`, `availableAt` on a service: replace the "—" placeholders.
- `address`, `landmark`, `parking`, `hours`, `directionsUrl` on a branch, and the
  answers in its `questions`.
- `reviews` in `site.ts`: the homepage section appears once the list has entries.

`bookingPhone` is shown because every approved screen shows it. Set it to `pending`
to remove it everywhere.

Draft badges on the services page and the homepage branch finder are copy
(`services.draft`, `home.branches.draft`); remove them with the last pending fact.
Every branch record has `detail` content, which makes its page in both languages.
`socialProfiles` in `site.ts` come from the content plan; confirm the handles.

Structured data (Organization, OfferCatalog, HairSalon) is output only when
`NEXT_PUBLIC_SITE_URL` is set, and HairSalon also needs a verified address.

## Placeholders

- **Typeface**: Dubai comes first in the stack and renders only where installed.
  IBM Plex Sans Arabic (OFL, self-hosted) is the approved fallback. It is pinned to
  5.0.8 because later releases drop the lam-meem ligature seen in the approved screens.
- **Photos**: all temporary. Every homepage photo is stock: the hero and haircut-and-beard
  photos are CC BY 2.0 and need a visible credit if published; hair treatment, skin care,
  groom and story are under the Pexels License. Services and Madinaty still use crops of one
  image of unknown origin. Sources, credits and edits are in `src/data/photos.ts`.
- **Map**: a drawn placeholder on the branch page.
- **Branch photos**: stock previews, labelled as such. None shows a real branch.

## Privacy

Booking details stay in the tab's `sessionStorage` so they survive a language
switch. They are never put in a URL or sent to a server.
