# York Region Battery — Catalog Expansion & Visual Redesign

**Date:** 2026-10-07
**Status:** Approved
**Builds on:** [2026-10-06-york-region-battery-design.md](2026-10-06-york-region-battery-design.md)

## Overview

Two changes to the existing York Region Battery site:

1. **Catalog expansion** — add Nissan Leaf and Chevy Volt battery modules
   alongside the existing TTC A123 modules, which means broadening the
   site's positioning from "TTC transit-grade LiFePO4" to "salvaged EV &
   transit battery modules" generally, since Leaf/Volt cells are a
   different chemistry (NMC/LMO pouch) and a different source than TTC.
2. **Visual redesign** — an original "industrial salvage, toned-down comic"
   theme: bold condensed display type, a hazard-orange accent, restrained
   comic-panel accents (ink outlines, halftone texture, one angled divider),
   replacing the current teal/dark-SaaS look. Explicitly **not** using any
   trademarked name, logo, or asset from any media property — this is an
   original design inspired by a general visual style, not a copy of one.

Both changes touch overlapping files (data model, hero/trust copy, About
page, CSS), so they're one spec/plan rather than two.

## Goals / Non-goals

**Goals:**
- Sell Nissan Leaf and Chevy Volt modules honestly — correct chemistry,
  correct provenance, clearly marked as unverified (`as-is`) since they
  haven't been capacity-tested yet
- Make the site's copy and metadata accurately reflect a multi-source,
  multi-chemistry catalog instead of implying TTC/LiFePO4-only
  (misleading copy on a real commerce site is a real problem, not just a
  style issue)
- Let buyers filter by source (TTC / Leaf / Volt) in addition to category
  and condition, since chemistry/source is now a buying-decision factor
- Add a chemistry-specific safety note (LiFePO4 vs NMC/LMO) since the About
  page's Safety section would otherwise silently become inaccurate
- Give the site a distinctive, original visual identity, while keeping
  specs/pricing/safety text fully legible — bold accents, not bold chaos
- Extend the non-affiliation disclaimer to cover Nissan and GM, same
  reasoning as the existing TTC disclaimer

**Non-goals:**
- No new pages, no cart/checkout, no form backend (unchanged from original spec)
- No fabricated capacity/test claims for the new listings — they're
  genuinely untested, and the copy says so
- No use of any trademarked name/logo/asset (Borderlands or otherwise) —
  the visual direction is "inspired by," built from scratch in CSS/SVG
- No per-listing detail pages (unchanged — still inline cards)

## Data Model Changes

Add a `source` field to every listing: `"ttc" | "leaf" | "volt"`. Retrofit
the 5 existing listings with `source: "ttc"`. Add two new listings:

```js
{
  id: "nissan-leaf-module",
  category: "modules",
  source: "leaf",
  name: "Nissan Leaf Battery Module",
  price: 25.00,
  currency: "CAD",
  qtyAvailable: 4,
  condition: "as-is",
  specs: {
    "Configuration": "2S2P (4 cells)",
    "Cell Type": "Laminated pouch, LMO/NMC blend (Nissan/AESC)",
    "Nominal Voltage": "~7.4V",
    "Capacity": "~33Ah (typical for this module type — pending our own verification)",
    "Source": "Nissan Leaf EV battery pack"
  },
  description: "Pulled from a Nissan Leaf EV battery pack. Not yet capacity-tested on our end — specs shown are typical for this module type, not measured. Different chemistry than our LiFePO4 modules: check your charger/BMS voltage limits before mixing into an existing LiFePO4 bank.",
  image: "images/placeholders/leaf-module-diagram.svg"
}
```

```js
{
  id: "chevy-volt-module",
  category: "modules",
  source: "volt",
  name: "Chevy Volt Battery Module (Gen 1)",
  price: 30.00,
  currency: "CAD",
  qtyAvailable: 4,
  condition: "as-is",
  specs: {
    "Configuration": "3S (3 cells in series)",
    "Cell Type": "Prismatic pouch, NMC (LG Chem)",
    "Nominal Voltage": "~10.8–12.6V",
    "Capacity": "~15Ah (typical for this module type — pending our own verification)",
    "Source": "Chevrolet Volt EV battery pack (Gen 1)"
  },
  description: "Pulled from a Gen 1 Chevy Volt EV battery pack. Not yet capacity-tested on our end — specs shown are typical for this module type, not measured. Different chemistry than our LiFePO4 modules: check your charger/BMS voltage limits before mixing into an existing LiFePO4 bank.",
  image: "images/placeholders/volt-module-diagram.svg"
}
```

**Owner note:** price/qty on both new listings are placeholders — swap in
real numbers in `js/listings.js` once you've counted and priced actual
stock. `condition` is `as-is` because nothing's been tested yet; flip to
`tested` only once you've actually run cells through your test process.

Two new placeholder diagrams needed (same style/rationale as the existing
`module-diagram.svg` — original SVG, not a photo): `leaf-module-diagram.svg`
(a simple 2x2 dot grid representing 2S2P) and `volt-module-diagram.svg` (a
simple 3-dot vertical stack representing 3S).

## Shop Page: Source Filter

Add a third `<select id="filter-source">` next to Category and Condition:
`All Sources` / `TTC Transit Bus` / `Nissan Leaf` / `Chevy Volt`
(values `all`/`ttc`/`leaf`/`volt`). `YRB.catalog.filterListings` gains a
third optional filter key, matched the same way as `category`/`condition`.

## Copy & Positioning Changes

- **Page titles/meta descriptions** (all 4 pages): drop "TTC A123 LiFePO4"
  exclusivity, broaden to "salvaged EV & transit battery modules," keep TTC
  named as the flagship source.
- **Hero headline:** "Reclaimed EV & Transit Battery Modules. Tested where
  marked. Ready for Your Solar Storage Build." with a small uppercase
  eyebrow label above it: "SALVAGED · GRADED · SOLAR-READY".
- **Hero subhead:** "We salvage, test, and grade battery modules pulled
  from retired transit buses and EVs — including TTC buses, Nissan Leafs,
  and Chevy Volts — so you can build a reliable DIY powerwall for a
  fraction of the cost of new cells."
- **Trust point "Real Provenance":** broadened to name all three sources
  instead of TTC only.
- **Trust point "Built for Solar Storage":** broadened to honestly note
  both chemistries (LiFePO4 from TTC modules, NMC/LMO from Leaf/Volt
  modules) rather than implying everything is LiFePO4.
- **Footer blurb:** "Salvaged EV & transit battery parts, tested and sold
  for solar & off-grid use." (drop TTC-only framing)
- **Footer legal disclaimer:** extend to cover all three brands: "York
  Region Battery is an independent salvage reseller and is not affiliated
  with, endorsed by, or sponsored by the Toronto Transit Commission (TTC),
  Nissan, or General Motors."
- **About page:** "What Are These Modules?" broadened to describe all three
  module types; "Why TTC Buses?" becomes "Why These Sources?" covering TTC,
  Leaf, and Volt provenance reasoning; **Safety Notes gains a new
  paragraph** explicitly contrasting LiFePO4 (TTC modules — thermally
  stable) against NMC/LMO (Leaf/Volt modules — less thermally stable,
  tighter charge-voltage tolerance) and warning not to treat them
  interchangeably or charge them with the same BMS settings.

## Visual Redesign

**Palette** (replaces the current teal/cool-dark tokens in `css/style.css`):
warm near-black base instead of cool-gray base, hazard-orange primary
accent instead of teal, badge colors made semantic (tested = green-teal
= "verified safe," as-is = the same hazard-orange as the primary accent =
"caution/unverified" — ties the brand color to the trust mechanism instead
of being decorative).

```css
--color-bg: #15120e;
--color-surface: #1f1a14;
--color-surface-alt: #2a2218;
--color-border: #3a2f22;
--color-border-ink: #0a0806;
--color-text: #f2ece1;
--color-text-muted: #b3a593;
--color-accent: #f2871b;
--color-accent-dark: #c96a0f;
--color-good: #4fd19f;
--color-good-bg: rgba(79, 209, 159, 0.15);
--color-caution: #f2871b;
--color-caution-bg: rgba(242, 135, 27, 0.18);
```

**Typography** — three-tier system (was two-tier):
- `--font-display: 'Anton', system-ui, sans-serif` — hero H1 only, ultra-bold condensed, poster/impact feel
- `--font-heading: 'Oswald', system-ui, sans-serif` — H2/H3, card titles, nav brand — bold condensed, industrial, still fully legible
- `--font-body: 'Inter', system-ui, sans-serif` — unchanged. All specs, prices, descriptions, safety copy stay in this font. This is deliberate: the stylized fonts live in headlines only, never where legibility of safety/price information matters.

**Comic accents (restrained, not everywhere):**
- Buttons and category/condition badges get a 2px solid `--color-border-ink`
  outline plus a small fixed hard-shadow (`box-shadow: 3px 3px 0 var(--color-border-ink)`)
  for an inked/stamped look; buttons lift slightly on hover.
- Hero section gets a low-opacity halftone dot texture (CSS
  `repeating-radial-gradient`, no image) as a background texture, confined
  to the hero only.
- One angled divider (CSS `clip-path`) at the bottom of the hero section,
  transitioning into the next section's background — a single dynamic
  moment, not a repeated motif.
- New `.eyebrow` utility class: small, uppercase, letter-spaced, accent-colored,
  used above the hero H1 and above major About-page section headings.
- Everywhere else (cards, spec tables, nav, footer) stays clean and
  grid-based — the redesign adds personality at the edges, it doesn't
  restructure the layout that already tested well.

## Testing / QA

Same approach as the original spec: no automated test framework. Verify
`filterListings`' new `source` key with the existing Node `vm`-sandbox
pattern (extend the Task 5 fixture with a `source` field and assert
filtering works). Everything else (new copy, new CSS, new listings
rendering correctly, new filter dropdown) is manual browser verification,
consistent with how Task 10 of the original plan verified the rest of the
site.

## Open Items for Owner

- Replace placeholder price/qty on the two new listings with real numbers
  once you've counted/priced actual stock.
- Flip `condition` to `"tested"` on the Leaf/Volt listings only once you've
  actually run them through your test process — not before.
