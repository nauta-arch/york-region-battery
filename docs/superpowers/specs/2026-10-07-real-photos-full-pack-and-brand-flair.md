# York Region Battery — Real Photos, Full Pack Listing, Brand Flair & Spec Corrections

**Date:** 2026-10-07
**Status:** Approved
**Builds on:** [2026-10-06-york-region-battery-design.md](2026-10-06-york-region-battery-design.md), [2026-10-07-catalog-expansion-and-redesign.md](2026-10-07-catalog-expansion-and-redesign.md)

## Overview

Four changes, bundled because they touch overlapping files:

1. **Real spec corrections** — the owner's actual test data and photographed
   nameplate labels correct several figures that were placeholder guesses
   from early brainstorming.
2. **New listing** — a complete 16-module TTC pack, sold as one assembled
   unit.
3. **Real photos** — three of the owner's own photos of actual stock replace
   SVG diagrams on the TTC listings they depict (the original site
   deliberately avoided photos only because none existed yet; these are
   genuine photos of the owner's real inventory, not scraped images, so the
   original concern doesn't apply).
4. **Brand flair** — a tagline, a secondary "inspection stamp" mark tied to
   the testing process, new About-page content explaining A123's reputation
   and the real reason TTC-sourced modules tend to test well, and a touch
   more of the existing halftone/texture motif.

## Goals / Non-goals

**Goals:**
- Replace guessed voltage/capacity figures with the owner's real,
  photographed/tested numbers
- Add the full-pack listing as a real, honestly-priced product
- Use real photos where they now exist, without touching listings that
  don't have one yet (Leaf, Volt, BMS, hardware keep SVG placeholders)
- Give the brand more distinct personality (tagline, stamp mark, voice)
  without compromising the trust-through-honesty principle already
  established
- Explain *why* A123 cells and TTC-sourced modules are a good bet, backed
  by real test data, not inflated claims

**Non-goals:**
- Not replacing every image site-wide — only the 3 TTC listings a real
  photo now exists for
- Not claiming the full pack's 16 modules were each individually
  capacity-tested to the same per-module number — "tested" here means the
  owner verified the assembled pack as a working unit
- No new filter dimension beyond the new "Full Packs" category value

## Real Spec Corrections

All in `js/listings.js`, affecting the two existing A123 12S8P module
listings and the loose-cell listing. Source: the owner's own test logs and
the nameplate labels visible in their photos (BAE Systems module label:
"Module Ratings: Voltage 40V, Current 225A"; cell label: "ANR26650M1B
Nanophosphate, 3.3V, 2.6Ah, 8.58Wh").

| Field | Old (placeholder) | New (real) |
|---|---|---|
| Module nominal voltage | `~39.6V` | `40V` |
| Module capacity (Batch 1, tested) | `60Ah (measured)` | `18–19Ah measured (20Ah original rating)` |
| Module capacity (Batch 2, as-is) | `Not yet capacity-tested` | `Not yet capacity-tested (20Ah original rating)` |
| Pack voltage reference (both modules' Source field) | `TTC transit bus pack (16S, 660V nominal)` | `TTC transit bus pack (16S, ~640V nominal)` |
| Cell nominal voltage | `3.3V nominal / 3.65V charged` | `3.3V nominal` |
| Cell capacity | `2.3Ah (measured)` | `2.6Ah rated; individually tested cells typically measure a little under that` |

The 18–19Ah-against-20Ah figure is the owner's real test result across the
modules they've measured, not a per-unit guarantee — phrase it as what
`Tested & Graded` already means (checked, not assumed), not as a new claim
layered on top.

## New Listing: Full TTC Battery Pack

```js
{
  id: "ttc-full-pack-16s",
  category: "packs",
  source: "ttc",
  name: "Full TTC Battery Pack — 16 Modules (16S)",
  price: 1000.00,
  currency: "CAD",
  qtyAvailable: 12,
  condition: "tested",
  specs: {
    "Configuration": "16S (16 × 12S8P modules in series)",
    "Cell Type": "26650 LiFePO4 (A123/Lithium Werks ANR26650M1B)",
    "Nominal Voltage": "~640V (16 × 40V modules)",
    "Capacity": "18–19Ah (modules test at 18–19Ah against a 20Ah original rating)",
    "Includes": "Complete pack case, internal bus bars/wiring, high-voltage connectors, integrated cooling fans",
    "Source": "TTC transit bus pack (complete, as removed)"
  },
  description: "The complete 16-module pack as pulled from the bus — full case, internal wiring, high-voltage connectors, and integrated cooling fans included. We've tested this pack as a working assembled unit. If you want the whole ~640V string instead of building one up from individual modules, this is it.",
  image: "images/products/ttc-full-pack-photo.jpg"
}
```

This introduces a new `category` value, `"packs"`, requiring a 4th option
on the Shop page's Category filter: `<option value="packs">Full Packs</option>`.
No other filter logic changes — `filterListings` already does plain string
equality on `category`, so a new value works automatically.

**Safety handling disclaimer**, needed because this is a ~640V assembled
unit (meaningfully higher voltage/risk than a single 40V module) and the
site's existing Safety Notes section doesn't currently address handling a
live high-voltage pack: add one sentence to the About page's Safety Notes
section calling out that full-pack handling requires appropriate HV
precautions (insulated tools, no work on an unknown-state pack without
proper PPE) beyond what applies to a single low-voltage module.

## Real Photos

Three files already copied into `images/products/`:
- `images/products/a123-module-photo.jpg` — single-module close-up showing
  the BAE Systems label (40V/225A). Used on both A123 module listings
  (Batch 1 and Batch 2 — same physical module type, same photo).
- `images/products/a123-cell-photo.jpg` — Lithium Werks-branded cell
  close-up with a clearly legible spec label (3.3V, 2.6Ah, 8.58Wh). Used on
  the loose-cell listing.
- `images/products/ttc-full-pack-photo.jpg` — full open-case shot showing
  all 16 modules in the rack. Used on the new full-pack listing.

These replace the `image` field's SVG path on exactly those listings. The
loose `.listing-card__image` CSS rule already uses `object-fit: contain`
on a fixed-height container, which works fine for photos as well as SVGs —
no CSS change needed. `alt` text on these `<img>` tags should describe
what's shown (not just repeat the listing name, since a real photo carries
more information than a diagram) — e.g. "BAE Systems A123 12S8P module,
40V/225A label visible" rather than empty/decorative alt, since these are
now informative content images, not decorative icons.

Leaf, Volt, BMS, and hardware listings are unchanged — still SVG
placeholders, no photos exist for them yet.

## Brand Flair

- **Tagline:** "Salvaged Power. Built to Last." — added under the wordmark
  in the header (`.brand`) and repeated once in the hero as a secondary
  line under the eyebrow label.
- **Inspection-stamp mark:** a new circular SVG badge — battery+bolt icon
  center, "YORK REGION BATTERY" arced around the top, "SALVAGED · GRADED"
  arced around the bottom — styled with the same ink-outline treatment as
  buttons/badges. Placed on the About page next to the "How We Test &
  Grade" section, reinforcing that section visually rather than existing
  as pure decoration.
- **Texture expansion:** reuse the existing halftone dot pattern (already
  defined for `.hero`) as a thin strip along the top edge of the footer,
  and add one more angled `clip-path` divider between two sections on the
  About page — same restrained dose as the original hero treatment, not a
  new pattern.

## New About-Page Content

Two additions to `about.html`, both placed after the existing "What Are
These Modules?" section:

**New section, "Why A123 Cells?"** — explains the real, well-established
reputation: A123 pioneered "Nanophosphate" (LiFePO4) cells known for
thermal stability and long cycle life relative to typical consumer lithium
chemistries; used in demanding commercial/industrial/transit applications,
not just consumer electronics; a long-standing favorite in the DIY
solar/off-grid community specifically because of that durability profile.
This is general, well-supported information about the A123/Lithium Werks
cell line, not a claim specific to the owner's stock.

**Expansion to "Why These Sources?"** — adds the specific TTC detail:
Toronto's hybrid bus fleet (BAE Systems HybriDrive propulsion, the same
system these A123 packs came from) had well-documented reliability
problems with the hybrid drivetrain itself, leading many buses to be
retired or converted back to diesel well before the battery packs reached
their expected end of life. Framed honestly as *why this is often good
news for buyers*, backed by the real evidence: modules the owner has
tested typically come in at 18–19Ah against a 20Ah original rating — not
asserted as a guarantee for every untested unit, and not conflated with
the `Tested & Graded` badge (which still means *this specific listing* was
measured).

## Testing / QA

No new logic beyond the new `category: "packs"` value (covered by existing
`filterListings` string-equality behavior — verify with the same Node `vm`
pattern used throughout: filtering by `category: "packs"` returns exactly
the one new listing). Everything else is content/copy/image changes,
verified manually in-browser per the established pattern: images load
without 404s, alt text present, Shop page's new 4th category option works,
About page renders the new section/content correctly, no console/network
errors.
