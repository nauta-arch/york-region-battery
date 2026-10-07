# York Region Battery — Website Design

**Date:** 2026-10-06
**Status:** Approved by user, pending spec review sign-off

## Overview

A static storefront website for **York Region Battery**, a one-person salvage
business reselling parts pulled from decommissioned TTC transit bus battery
packs — primarily A123 LiFePO4 modules (12S8P configuration, 26650
cylindrical cells, originally part of 16-series 660V bus packs), plus related
salvaged electrical parts (bus bars, connectors, BMS boards, contactors,
loose cells).

Primary audience: **solar / off-grid home battery backup hobbyists** looking
for inexpensive, high-quality LiFePO4 cells to build DIY powerwalls.

The site must read as an **established, trustworthy small business**, not a
garage listing — professional visual design, clear policies, honest
technical content, consistent branding. "Professional" means polish and
clarity, not inflated claims or fabricated testimonials; the site should earn
trust through transparency (clear tested/as-is labeling, real specs, clear
contact/return policy) rather than manufactured social proof.

## Goals / Non-goals

**Goals:**
- Present the catalog of salvaged modules/parts clearly, with honest
  condition labeling (Tested & Graded vs As-is)
- Educate buyers unfamiliar with salvaged EV cells (what they are, why
  TTC buses, safety basics, why they're good for solar storage)
- Let buyers initiate a purchase inquiry with zero backend infrastructure
- Deploy for free on Cloudflare Pages under the existing domain
  `yorkregionbattery.ca`
- Be trivially editable by a non-technical solo owner (add/remove/edit a
  listing without touching HTML)

**Non-goals (explicitly out of scope for this spec):**
- Real payment processing / cart / checkout (contact-to-buy only)
- User accounts, reviews, or any backend database
- Inventory automation or syncing with any external system
- Fake testimonials, review counts, or any fabricated trust signals

## Architecture

Plain static site: HTML + CSS + vanilla JS, **no build step, no framework,
no Node toolchain**. Deployed as static files to Cloudflare Pages, mapped to
the `yorkregionbattery.ca` domain.

Rationale: the catalog is small, the owner is non-technical, and Cloudflare
Pages serves static files for free with zero configuration. A static-site
generator (Astro/11ty) was considered but rejected — it would add a Node
build pipeline for a benefit (templating) that a single JS data file already
provides at this scale.

```
/
├── index.html          (Home)
├── shop.html           (Catalog)
├── about.html          (About / FAQ)
├── contact.html        (Contact)
├── css/
│   └── style.css
├── js/
│   ├── listings.js     (data: the catalog, see Data Model below)
│   └── catalog.js       (renders listings.js into shop.html / home teasers)
├── images/
│   └── placeholders/    (original SVG/diagram placeholder graphics)
└── docs/superpowers/specs/   (this file and future specs)
```

## Data Model

Listings live in `js/listings.js` as a plain JS array of objects, e.g.:

```js
const LISTINGS = [
  {
    id: "a123-12s8p-batch1",
    category: "modules",        // modules | cells | bms | hardware
    name: "A123 12S8P Module — Batch 1",
    price: 85.00,
    currency: "CAD",
    qtyAvailable: 10,
    condition: "tested",        // tested | as-is
    specs: {
      configuration: "12S8P",
      cellType: "26650 LiFePO4",
      nominalVoltage: "~39.6V",
      capacity: "60Ah (measured)",
      source: "TTC transit bus pack (16S, 660V nominal)"
    },
    description: "Pulled from a TTC bus pack, capacity-tested and balance-checked...",
    image: "placeholder-module.svg"
  },
  // ...
];
```

Adding a listing = adding one object to this array. No build/compile step —
the browser loads the file directly.

Categories at launch: **Modules**, **Cells** (loose 26650s), **BMS &
Electrical** (BMS boards, contactors), **Hardware** (bus bars, connectors).

Condition is a required field on every listing and renders as a visible
badge ("✓ Tested & Graded" in green, "As-Is Salvage" in neutral gray) — this
is the core trust mechanism given the audience is buying used safety-relevant
hardware.

## Pages

- **Home (`index.html`)** — hero section explaining what the business sells
  and why (reclaimed TTC transit-grade A123 LiFePO4 cells, tested, priced for
  DIY solar storage), 3-4 "why buy salvaged A123" trust points (chemistry
  safety, cost vs. new, tested/graded process), a teaser grid of 3-4 featured
  listings pulled from `listings.js`, footer with contact + legal disclaimer.
- **Shop (`shop.html`)** — full catalog grid, client-side filter by category
  and by condition (Tested / As-Is). Each card shows name, price, qty,
  condition badge, key specs, and expands (inline, no page nav) to show full
  description + "Email about this listing" mailto action.
- **About/FAQ (`about.html`)** — what A123/LiFePO4 cells are, why TTC buses
  specifically (provenance/credibility), how the testing & grading process
  works, safety notes (handling/storage of LiFePO4), shipping & local pickup
  policy, return/dispute policy.
- **Contact (`contact.html`)** — general inquiry via mailto link (prefilled
  subject), business contact info, service area (York Region, Ontario).

No listing gets its own URL/page — detail is an inline expand on the Shop
page. This keeps the site to 4 files and avoids generating/maintaining a page
per listing.

## Contact / Buy Flow

No backend. Every "buy" action is a `mailto:` link prefilled with a subject
line identifying the listing (e.g. `mailto:sales@yorkregionbattery.ca?subject=Inquiry:%20A123%2012S8P%20Module%20Batch%201`).
The owner replies manually and arranges payment (e-transfer/PayPal/pickup)
outside the site.

This was chosen over a real form specifically to avoid needing any backend,
API keys, or secrets for an MVP. A clean future upgrade path (noted but not
built now) is a Cloudflare Pages Function + an email-sending API if the
owner later wants submissions logged rather than just emailed.

## Visual Design (professional / established-business bar)

- Original design pass (not default/templated look) via frontend-design
  guidance during implementation: a real color palette and type pairing
  chosen deliberately, not framework defaults.
- Tone: industrial/technical but clean — reclaimed-hardware aesthetic
  without looking makeshift. Dark, confident palette (not neon/flashy).
- Consistent wordmark/logo treatment for "York Region Battery" (text-based
  lockup is sufficient — no fake "since 20XX" claims).
- Real footer with: business name, service area (York Region, ON), contact
  email, and a clear disclaimer that the business is independent and not
  affiliated with or endorsed by the TTC.
- Favicon, consistent spacing/typography system, no lorem-ipsum left in the
  shipped site.
- Trust is built through **honesty and clarity** (clear condition badges,
  real specs, visible policies on the About page) — explicitly no fabricated
  testimonials, review counts, or "trusted by X customers" claims the owner
  can't back up.

## Images

No scraped internet photos (copyright + misrepresentation risk for a
used-goods seller). Launch with original placeholder graphics: a simple
diagram of the 12S8P module layout, a generic module silhouette icon, and
per-category icons (cells, BMS, hardware). Each is clearly a diagram/icon,
not presented as a photo of actual stock, and is straightforward to swap for
real photos later by replacing files in `images/`.

## Testing / QA

No automated test suite needed (static content site, no logic beyond
filtering/rendering). Manual verification before calling this done:
- All pages load and nav works on desktop and mobile widths
- Catalog filter (category + condition) works correctly against
  `listings.js` data
- Every listing's mailto link has correct, URL-encoded subject text
- No broken internal links/images
- Lighthouse/basic accessibility pass (contrast, alt text on
  placeholder graphics)

## Open Item for Owner

The mailto contact flow needs a real, working email address. This spec
placeholders `sales@yorkregionbattery.ca`, which only works if email is
configured for that domain (e.g. via Cloudflare Email Routing, which is free
and simple to set up, or a forward to an existing inbox). **Confirm the
actual address to use before implementation**, or set up Cloudflare Email
Routing for the domain if you want a domain-matching address.

## Deployment

Static files pushed to a git repo, connected to Cloudflare Pages, custom
domain `yorkregionbattery.ca` attached in Cloudflare DNS/Pages settings.
Deployment configuration (Cloudflare Pages project setup, DNS) is a manual
step the owner performs in the Cloudflare dashboard — out of scope for the
implementation plan itself, but the repo structure (plain static files at
repo root) is chosen specifically to make that a zero-config "connect repo"
operation.
