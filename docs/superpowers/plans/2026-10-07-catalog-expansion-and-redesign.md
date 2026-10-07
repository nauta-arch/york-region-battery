# Catalog Expansion & Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Nissan Leaf and Chevy Volt modules to the York Region Battery catalog (with honest, source-aware positioning) and reskin the site with an original "industrial salvage, toned-down comic" visual theme.

**Architecture:** Same plain static HTML/CSS/vanilla-JS site, no build step, no framework. This plan modifies existing files in place — `css/style.css` is replaced with new design tokens and a few restrained comic-style accents while keeping every existing class name/selector contract identical (zero JS/markup breakage); `js/listings.js` gains a `source` field on every listing plus two new listings; `js/catalog.js`'s `filterListings` gains a third filter key; all 4 HTML pages get copy/meta/footer updates reflecting the broadened multi-source positioning.

**Tech Stack:** Unchanged — HTML5, CSS3 custom properties, vanilla JS (classic scripts, `window.YRB` namespace), Google Fonts via `<link>` (Anton + Oswald + Inter, replacing Space Grotesk + Inter), Node.js `vm` module for dev-time logic verification only.

## Global Constraints

Carried forward from the original spec, still binding:
- No build step, no framework, no Node toolchain in the shipped site.
- Contact/buy is `mailto:lucasnauta@gmail.com` and `tel:+14378980642` only.
- Every listing has a required `condition` field (`tested`|`as-is`) rendered as a visible badge.
- No fabricated testimonials, review counts, or unverifiable trust claims.
- No scraped/internet photos — only original placeholder SVG graphics.
- All currency is CAD.

New, from this addendum's spec:
- Every listing gets a `source` field: `"ttc"|"leaf"|"volt"`.
- The two new listings (`nissan-leaf-module`, `chevy-volt-module`) use the exact price/qty/specs/description text given in this plan — these are explicitly placeholders the owner will edit later; do not invent different numbers.
- No use of any trademarked name, logo, or asset from any media property anywhere in the site. The visual theme is original, inspired by a general style, never named as such on the site.
- The footer legal disclaimer must name all three brands: TTC, Nissan, General Motors.
- Comic-style visual accents (ink outlines, halftone, skew) apply to buttons/badges/hero only — spec tables, prices, and safety copy stay in the unstyled body font, fully legible.

---

## File Structure (files touched by this plan)

```
/
├── index.html           (Modify — hero/trust copy, meta, fonts, footer)
├── shop.html             (Modify — add Source filter, meta, fonts, footer)
├── about.html             (Modify — broadened copy, new safety paragraph, meta, fonts, footer)
├── contact.html            (Modify — meta, fonts, footer)
├── css/
│   └── style.css            (Modify — full token/theme replacement, same class contract)
├── images/placeholders/
│   ├── leaf-module-diagram.svg  (Create)
│   └── volt-module-diagram.svg  (Create)
├── js/
│   ├── listings.js          (Modify — add `source` field + 2 new listings)
│   ├── catalog.js            (Modify — `filterListings` gains `source` key)
│   └── shop-page.js           (Modify — wire new Source filter)
```

---

### Task 1: Visual theme redesign (`css/style.css`)

**Files:**
- Modify: `css/style.css` (full replacement)

**Interfaces:**
- Consumes: nothing
- Produces: same class/selector contract as before (`.container`, `.site-header*`, `.button*`, `.badge*`, `.listing-card*`, `.hero*`, `.trust-*`, `.filter-bar`, `.catalog-empty`, `.contact-actions`), plus new: `--color-border-ink`, `--color-good`, `--color-good-bg`, `--color-caution`, `--color-caution-bg`, `--font-display`, `.eyebrow` class. All later tasks (HTML pages) consume these.

- [ ] **Step 1: Replace the full contents of `css/style.css`**

```css
/* ---------- Reset & Base ---------- */
*, *::before, *::after { box-sizing: border-box; }
html { font-size: 16px; }
body {
  margin: 0;
  font-family: var(--font-body);
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
}
img { max-width: 100%; display: block; }
a { color: var(--color-accent); text-decoration: none; }
a:hover { text-decoration: underline; }
h1 { font-family: var(--font-display); text-transform: uppercase; letter-spacing: 0.01em; line-height: 1.05; margin: 0 0 var(--space-sm); font-size: 2rem; }
h2, h3 { font-family: var(--font-heading); line-height: 1.2; margin: 0 0 var(--space-sm); }
p { margin: 0 0 var(--space-sm); }

/* ---------- Design Tokens ---------- */
:root {
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

  --font-display: 'Anton', system-ui, sans-serif;
  --font-heading: 'Oswald', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;

  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2.5rem;
  --space-xl: 4rem;

  --max-width: 1140px;
  --radius: 8px;
}

/* ---------- Layout ---------- */
.container { max-width: var(--max-width); margin: 0 auto; padding: 0 var(--space-md); }
.page-section { padding: var(--space-lg) 0; }

/* ---------- Eyebrow ---------- */
.eyebrow { font-family: var(--font-heading); text-transform: uppercase; letter-spacing: 0.15em; font-size: 0.8rem; font-weight: 600; color: var(--color-accent); margin: 0 0 var(--space-xs); }

/* ---------- Header ---------- */
.site-header { border-bottom: 1px solid var(--color-border); background-color: var(--color-surface); }
.site-header__inner { display: flex; align-items: center; justify-content: space-between; padding: var(--space-sm) 0; }
.brand { display: flex; align-items: center; gap: var(--space-xs); color: var(--color-text); }
.brand:hover { text-decoration: none; }
.brand__mark { width: 28px; height: 28px; }
.brand__name { font-family: var(--font-heading); font-weight: 600; font-size: 1.1rem; letter-spacing: 0.02em; text-transform: uppercase; }
.site-nav { display: flex; gap: var(--space-md); }
.site-nav a { color: var(--color-text-muted); font-weight: 500; }
.site-nav a:hover, .site-nav a[aria-current="page"] { color: var(--color-accent); }

/* ---------- Footer ---------- */
.site-footer { border-top: 1px solid var(--color-border); background-color: var(--color-surface); margin-top: var(--space-xl); padding: var(--space-lg) 0 var(--space-md); }
.site-footer__inner { display: flex; flex-wrap: wrap; gap: var(--space-lg); justify-content: space-between; }
.site-footer__brand { max-width: 36ch; }
.site-footer__contact a { display: block; color: var(--color-text); margin-bottom: var(--space-xs); }
.site-footer__legal { margin-top: var(--space-md); padding-top: var(--space-md); border-top: 1px solid var(--color-border); color: var(--color-text-muted); font-size: 0.85rem; }

/* ---------- Buttons ---------- */
.button { display: inline-block; padding: 0.65rem 1.25rem; border-radius: 4px; font-family: var(--font-heading); font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; text-decoration: none; border: 2px solid var(--color-border-ink); box-shadow: 3px 3px 0 var(--color-border-ink); transition: transform 0.15s ease, box-shadow 0.15s ease; }
.button:hover { transform: translate(-1px, -1px); box-shadow: 4px 4px 0 var(--color-border-ink); text-decoration: none; }
.button--primary { background-color: var(--color-accent); color: #1a0e00; }
.button--primary:hover { background-color: var(--color-accent-dark); }
.button--secondary { background-color: var(--color-surface); color: var(--color-text); }
.button--secondary:hover { border-color: var(--color-accent); color: var(--color-accent); }

/* ---------- Badges ---------- */
.badge { display: inline-block; padding: 0.2rem 0.6rem; border: 1.5px solid var(--color-border-ink); border-radius: 3px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; font-family: var(--font-heading); transform: skewX(-6deg); }
.badge--tested { background-color: var(--color-good-bg); color: var(--color-good); }
.badge--asis { background-color: var(--color-caution-bg); color: var(--color-caution); }

/* ---------- Catalog Grid & Cards ---------- */
.catalog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-md); margin-top: var(--space-lg); }
.listing-card { background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); overflow: hidden; display: flex; flex-direction: column; transition: transform 0.15s ease, border-color 0.15s ease; }
.listing-card:hover { transform: translateY(-2px); border-color: var(--color-accent); }
.listing-card__image { width: 100%; height: 160px; object-fit: contain; background-color: var(--color-surface-alt); padding: var(--space-md); }
.listing-card__body { padding: var(--space-md); display: flex; flex-direction: column; gap: var(--space-xs); }
.listing-card__title { font-size: 1.05rem; margin: var(--space-xs) 0 0; }
.listing-card__price { color: var(--color-text-muted); font-weight: 600; margin: 0; }
.listing-card__specs { width: 100%; border-collapse: collapse; font-size: 0.85rem; margin: var(--space-xs) 0; }
.listing-card__specs th { text-align: left; color: var(--color-text-muted); font-weight: 500; padding: 0.2rem 0.5rem 0.2rem 0; vertical-align: top; white-space: nowrap; }
.listing-card__specs td { padding: 0.2rem 0; }
.listing-card__description { font-size: 0.9rem; color: var(--color-text-muted); }
.listing-card__actions { display: flex; gap: var(--space-xs); margin-top: var(--space-xs); flex-wrap: wrap; }

/* ---------- Hero ---------- */
.hero {
  position: relative;
  padding: var(--space-xl) 0 calc(var(--space-xl) + 28px);
  background-image: repeating-radial-gradient(circle at 0 0, rgba(242, 135, 27, 0.08) 0, rgba(242, 135, 27, 0.08) 1px, transparent 1px, transparent 14px);
  background-size: 14px 14px;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 28px), 0 100%);
}
.hero h1 { font-size: 2.75rem; max-width: 42ch; margin-top: var(--space-xs); }
.hero__subhead { max-width: 60ch; color: var(--color-text-muted); font-size: 1.1rem; }
.hero__actions { display: flex; gap: var(--space-sm); margin-top: var(--space-md); flex-wrap: wrap; }

/* ---------- Trust Points ---------- */
.trust-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-md); margin: var(--space-lg) 0; }
.trust-card { background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: var(--space-md); }
.trust-card h3 { font-size: 1.05rem; color: var(--color-accent); }

/* ---------- Filter Bar ---------- */
.filter-bar { display: flex; gap: var(--space-sm); align-items: center; flex-wrap: wrap; padding: var(--space-md) 0; border-bottom: 1px solid var(--color-border); }
.filter-bar select { background-color: var(--color-surface); color: var(--color-text); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 0.5rem 0.75rem; }
.catalog-empty { padding: var(--space-lg) 0; color: var(--color-text-muted); text-align: center; }

/* ---------- Contact Actions ---------- */
.contact-actions { display: flex; gap: var(--space-sm); margin: var(--space-md) 0; flex-wrap: wrap; }

/* ---------- Responsive ---------- */
@media (max-width: 768px) {
  .site-header__inner { flex-direction: column; align-items: flex-start; gap: var(--space-xs); }
  .site-nav { gap: var(--space-sm); flex-wrap: wrap; }
}
```

- [ ] **Step 2: Verify the new tokens/classes are present**

Run:
```bash
grep -c "color-border-ink" css/style.css
grep -c "font-display" css/style.css
grep -c "\.eyebrow" css/style.css
grep -c "color-good\|color-caution" css/style.css
```
Expected: each command outputs a number greater than 0.

- [ ] **Step 3: Verify every pre-existing class name the JS/HTML depends on still exists**

Run: `grep -cE "\.(listing-card|catalog-grid|catalog-empty|filter-bar|button--primary|button--secondary|badge--tested|badge--asis|hero|trust-grid|trust-card|contact-actions)\b" css/style.css`
Expected: a number greater than 10 (confirms no class was accidentally renamed/dropped — this file is consumed by HTML/JS written in earlier work that this task must not break).

- [ ] **Step 4: Commit**

```bash
git add css/style.css
git commit -m "Redesign visual theme: industrial salvage palette with comic accents"
```

---

### Task 2: New placeholder SVG diagrams for Leaf and Volt modules

**Files:**
- Create: `images/placeholders/leaf-module-diagram.svg`
- Create: `images/placeholders/volt-module-diagram.svg`

**Interfaces:**
- Consumes: nothing (colors hardcoded to match Task 1's new accent hex values, since `<img>`-loaded SVGs can't read page CSS variables)
- Produces: the two file paths, referenced by `js/listings.js` (Task 3)

- [ ] **Step 1: Create `images/placeholders/leaf-module-diagram.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" role="img" aria-label="Diagram of a Nissan Leaf 2S2P battery module">
  <rect x="100" y="60" width="200" height="180" rx="12" fill="none" stroke="#f2871b" stroke-width="3"/>
  <g fill="#f2871b">
    <circle cx="160" cy="110" r="14"/><circle cx="240" cy="110" r="14"/>
    <circle cx="160" cy="190" r="14"/><circle cx="240" cy="190" r="14"/>
  </g>
  <text x="200" y="265" fill="#b3a593" font-size="13" font-family="sans-serif" text-anchor="middle">2S2P &#183; 4 pouch cells (LMO/NMC)</text>
</svg>
```

- [ ] **Step 2: Create `images/placeholders/volt-module-diagram.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" role="img" aria-label="Diagram of a Chevy Volt 3-cell-in-series battery module">
  <rect x="130" y="40" width="140" height="220" rx="12" fill="none" stroke="#f2871b" stroke-width="3"/>
  <g fill="#f2871b">
    <circle cx="200" cy="90" r="14"/>
    <circle cx="200" cy="150" r="14"/>
    <circle cx="200" cy="210" r="14"/>
  </g>
  <text x="200" y="275" fill="#b3a593" font-size="13" font-family="sans-serif" text-anchor="middle">3S &#183; NMC prismatic pouch (LG Chem)</text>
</svg>
```

- [ ] **Step 3: Verify both files are well-formed XML**

Run: `for f in images/placeholders/leaf-module-diagram.svg images/placeholders/volt-module-diagram.svg; do echo "$f"; python3 -c "import xml.dom.minidom as m; m.parse('$f')" && echo OK; done`
Expected: `OK` printed after each of the 2 file paths, no errors.

- [ ] **Step 4: Commit**

```bash
git add images/placeholders/leaf-module-diagram.svg images/placeholders/volt-module-diagram.svg
git commit -m "Add placeholder diagrams for Nissan Leaf and Chevy Volt modules"
```

---

### Task 3: Catalog data — add `source` field and two new listings

**Files:**
- Modify: `js/listings.js` (full replacement)

**Interfaces:**
- Consumes: `images/placeholders/leaf-module-diagram.svg`, `images/placeholders/volt-module-diagram.svg` (Task 2)
- Produces: `window.YRB.LISTINGS` — now 7 objects, each with the existing fields plus a new required `source: "ttc"|"leaf"|"volt"` field. Consumed by `js/catalog.js` (Task 4), `js/home-page.js` (unchanged, still works via `.slice(0,3)`), `js/shop-page.js` (Task 5).

- [ ] **Step 1: Replace the full contents of `js/listings.js`**

```js
window.YRB = window.YRB || {};

YRB.LISTINGS = [
  {
    id: "a123-12s8p-batch1",
    category: "modules",
    source: "ttc",
    name: "A123 12S8P Module — Batch 1",
    price: 85.00,
    currency: "CAD",
    qtyAvailable: 12,
    condition: "tested",
    specs: {
      "Configuration": "12S8P",
      "Cell Type": "26650 LiFePO4 (A123)",
      "Nominal Voltage": "~39.6V",
      "Capacity": "60Ah (measured)",
      "Source": "TTC transit bus pack (16S, 660V nominal)"
    },
    description: "Pulled from a TTC transit bus battery pack, this 12S8P module has been capacity-tested and balance-checked across all 12 series groups. Ready to drop into a solar storage bank.",
    image: "images/placeholders/module-diagram.svg"
  },
  {
    id: "a123-12s8p-batch2",
    category: "modules",
    source: "ttc",
    name: "A123 12S8P Module — Batch 2 (As-Is)",
    price: 55.00,
    currency: "CAD",
    qtyAvailable: 20,
    condition: "as-is",
    specs: {
      "Configuration": "12S8P",
      "Cell Type": "26650 LiFePO4 (A123)",
      "Nominal Voltage": "~39.6V",
      "Capacity": "Not yet capacity-tested",
      "Source": "TTC transit bus pack (16S, 660V nominal)"
    },
    description: "Visually inspected and voltage-checked but not yet capacity-tested — priced accordingly. Great if you're comfortable testing/grading cells yourself.",
    image: "images/placeholders/module-diagram.svg"
  },
  {
    id: "26650-loose-cell",
    category: "cells",
    source: "ttc",
    name: "A123 26650 LiFePO4 Cell (Single)",
    price: 6.00,
    currency: "CAD",
    qtyAvailable: 150,
    condition: "tested",
    specs: {
      "Configuration": "Single cell",
      "Cell Type": "26650 LiFePO4 (A123)",
      "Nominal Voltage": "3.3V nominal / 3.65V charged",
      "Capacity": "2.3Ah (measured)",
      "Source": "TTC transit bus pack module teardown"
    },
    description: "Individually capacity-tested loose cells pulled down from modules. Good for topping up an existing bank or small parallel builds.",
    image: "images/placeholders/icon-cells.svg"
  },
  {
    id: "ttc-bms-board",
    category: "bms",
    source: "ttc",
    name: "TTC Pack BMS Board (12S)",
    price: 40.00,
    currency: "CAD",
    qtyAvailable: 6,
    condition: "tested",
    specs: {
      "Configuration": "12S battery management board",
      "Cell Type": "N/A",
      "Nominal Voltage": "Rated for 12S pack (~43.8V max)",
      "Capacity": "N/A",
      "Source": "TTC transit bus pack module stack"
    },
    description: "Bench-tested and confirmed functional. Balances and protects a 12S LiFePO4 string — not a universal BMS, check voltage/cell-count compatibility before buying.",
    image: "images/placeholders/icon-bms.svg"
  },
  {
    id: "bus-bar-connector-set",
    category: "hardware",
    source: "ttc",
    name: "Bus Bar & Connector Set",
    price: 15.00,
    currency: "CAD",
    qtyAvailable: 25,
    condition: "as-is",
    specs: {
      "Configuration": "Nickel-plated steel bus bars + connectors",
      "Cell Type": "N/A",
      "Nominal Voltage": "N/A",
      "Capacity": "N/A",
      "Source": "TTC transit bus pack module interconnects"
    },
    description: "Cleaned and visually inspected interconnect hardware pulled from module teardown. Sold as-is — good for custom pack building.",
    image: "images/placeholders/icon-hardware.svg"
  },
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
  },
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
];
```

- [ ] **Step 2: Verify the data loads with 7 listings and correct sources**

Run:
```bash
node -e "
const fs = require('fs'); const vm = require('vm');
const sandbox = {}; vm.createContext(sandbox);
vm.runInContext('var window = this;', sandbox);
vm.runInContext(fs.readFileSync('js/listings.js', 'utf8'), sandbox);
console.log(sandbox.YRB.LISTINGS.length);
console.log(sandbox.YRB.LISTINGS.map(l => l.source));
console.log(sandbox.YRB.LISTINGS.filter(l => l.id === 'nissan-leaf-module' || l.id === 'chevy-volt-module').map(l => l.condition));
"
```
Expected:
```
7
[
  'ttc', 'ttc', 'ttc', 'ttc', 'ttc',
  'leaf',
  'volt'
]
[ 'as-is', 'as-is' ]
```

- [ ] **Step 3: Commit**

```bash
git add js/listings.js
git commit -m "Add source field to listings and add Nissan Leaf / Chevy Volt modules"
```

---

### Task 4: Extend `filterListings` with a `source` filter

**Files:**
- Modify: `js/catalog.js:4-11` (the `filterListings` function only — `renderListingCard`/`renderCatalog` are unchanged)

**Interfaces:**
- Consumes: listing objects with the new `source` field (Task 3)
- Produces: `YRB.catalog.filterListings(listings, {category, condition, source}) -> array` — same function name/shape, now accepts a third optional key. Consumed by `js/shop-page.js` (Task 5).

- [ ] **Step 1: Confirm current behavior fails the new case (red)**

Run:
```bash
node -e "
const fs = require('fs'); const vm = require('vm');
const sandbox = {}; vm.createContext(sandbox);
vm.runInContext('var window = this;', sandbox);
vm.runInContext(fs.readFileSync('js/catalog.js', 'utf8'), sandbox);
const sample = [
  {category: 'modules', condition: 'tested', source: 'ttc', name: 'A'},
  {category: 'modules', condition: 'as-is', source: 'leaf', name: 'B'},
  {category: 'modules', condition: 'as-is', source: 'volt', name: 'C'}
];
console.log(sandbox.YRB.catalog.filterListings(sample, {category: 'all', condition: 'all', source: 'leaf'}).map(i => i.name));
"
```
Expected: `[ 'A', 'B', 'C' ]` (WRONG — the current function ignores `source` entirely and returns all 3; this confirms the gap before the fix).

- [ ] **Step 2: Update `filterListings` in `js/catalog.js`**

Replace the current `filterListings` method (lines 4-11) with:

```js
  filterListings(listings, filters) {
    const { category = 'all', condition = 'all', source = 'all' } = filters || {};
    return listings.filter((item) => {
      const categoryMatches = category === 'all' || item.category === category;
      const conditionMatches = condition === 'all' || item.condition === condition;
      const sourceMatches = source === 'all' || item.source === source;
      return categoryMatches && conditionMatches && sourceMatches;
    });
  },
```

Leave `renderListingCard` and `renderCatalog` exactly as they are — this task only touches `filterListings`.

- [ ] **Step 3: Re-run the same command and confirm it now passes (green)**

Run the identical command from Step 1.
Expected: `[ 'B' ]` (only the `leaf`-sourced listing matches).

- [ ] **Step 4: Confirm existing category/condition filtering still works (no regression)**

Run:
```bash
node -e "
const fs = require('fs'); const vm = require('vm');
const sandbox = {}; vm.createContext(sandbox);
vm.runInContext('var window = this;', sandbox);
vm.runInContext(fs.readFileSync('js/catalog.js', 'utf8'), sandbox);
const sample = [
  {category: 'modules', condition: 'tested', source: 'ttc', name: 'A'},
  {category: 'modules', condition: 'as-is', source: 'leaf', name: 'B'},
  {category: 'cells', condition: 'tested', source: 'ttc', name: 'C'}
];
console.log(sandbox.YRB.catalog.filterListings(sample, {category: 'modules', condition: 'all', source: 'all'}).map(i => i.name));
console.log(sandbox.YRB.catalog.filterListings(sample, {}).map(i => i.name));
"
```
Expected:
```
[ 'A', 'B' ]
[ 'A', 'B', 'C' ]
```
(Second line confirms calling with no filters — or an empty object — still returns everything, matching the original default-all behavior.)

- [ ] **Step 5: Commit**

```bash
git add js/catalog.js
git commit -m "Add source filter key to filterListings"
```

---

### Task 5: Shop page — add Source filter

**Files:**
- Modify: `shop.html` (full replacement)
- Modify: `js/shop-page.js` (full replacement)

**Interfaces:**
- Consumes: `YRB.catalog.filterListings` with `source` key (Task 4), new theme classes (Task 1)
- Produces: updated `shop.html` with a third `#filter-source` select; updated `js/shop-page.js` wiring it in

- [ ] **Step 1: Replace the full contents of `shop.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shop | York Region Battery</title>
  <meta name="description" content="Browse tested and as-is salvaged battery modules, loose cells, BMS boards, and hardware from TTC transit buses, Nissan Leafs, and Chevy Volts.">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="site-header">
    <div class="container site-header__inner">
      <a class="brand" href="index.html">
        <img class="brand__mark" src="images/placeholders/brand-mark.svg" alt="" width="28" height="28">
        <span class="brand__name">York Region Battery</span>
      </a>
      <nav class="site-nav" aria-label="Primary">
        <a href="index.html">Home</a>
        <a href="shop.html" aria-current="page">Shop</a>
        <a href="about.html">About &amp; FAQ</a>
        <a href="contact.html">Contact</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <section class="page-section">
      <h1>Shop</h1>
      <p>Filter by category, source, or condition. "Tested &amp; Graded" means capacity- and balance-checked; "As-Is Salvage" means visually inspected only and priced accordingly.</p>

      <div class="filter-bar">
        <label>
          Category
          <select id="filter-category">
            <option value="all">All Categories</option>
            <option value="modules">Modules</option>
            <option value="cells">Loose Cells</option>
            <option value="bms">BMS &amp; Electrical</option>
            <option value="hardware">Hardware</option>
          </select>
        </label>
        <label>
          Source
          <select id="filter-source">
            <option value="all">All Sources</option>
            <option value="ttc">TTC Transit Bus</option>
            <option value="leaf">Nissan Leaf</option>
            <option value="volt">Chevy Volt</option>
          </select>
        </label>
        <label>
          Condition
          <select id="filter-condition">
            <option value="all">All Conditions</option>
            <option value="tested">Tested &amp; Graded</option>
            <option value="as-is">As-Is Salvage</option>
          </select>
        </label>
        <button type="button" id="filter-reset" class="button button--secondary">Reset Filters</button>
      </div>

      <div id="catalog-grid" class="catalog-grid"></div>
      <p id="catalog-empty" class="catalog-empty" hidden>No listings match those filters right now — try a different combination or check back soon.</p>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container site-footer__inner">
      <div class="site-footer__brand">
        <strong>York Region Battery</strong>
        <p>Salvaged EV &amp; transit battery parts, tested and sold for solar &amp; off-grid use.<br>Serving York Region, Ontario.</p>
      </div>
      <div class="site-footer__contact">
        <a href="mailto:lucasnauta@gmail.com">lucasnauta@gmail.com</a>
        <a href="tel:+14378980642">437-898-0642 (call or text)</a>
      </div>
    </div>
    <div class="container site-footer__legal">
      <p>York Region Battery is an independent salvage reseller and is not affiliated with, endorsed by, or sponsored by the Toronto Transit Commission (TTC), Nissan, or General Motors.</p>
    </div>
  </footer>

  <script src="js/listings.js"></script>
  <script src="js/format.js"></script>
  <script src="js/catalog.js"></script>
  <script src="js/shop-page.js"></script>
</body>
</html>
```

- [ ] **Step 2: Replace the full contents of `js/shop-page.js`**

```js
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('catalog-grid');
  const empty = document.getElementById('catalog-empty');
  const categorySelect = document.getElementById('filter-category');
  const sourceSelect = document.getElementById('filter-source');
  const conditionSelect = document.getElementById('filter-condition');
  const resetButton = document.getElementById('filter-reset');

  function applyFilters() {
    const filters = {
      category: categorySelect.value,
      source: sourceSelect.value,
      condition: conditionSelect.value
    };
    const filtered = YRB.catalog.filterListings(YRB.LISTINGS, filters);
    YRB.catalog.renderCatalog(grid, empty, filtered);
  }

  categorySelect.addEventListener('change', applyFilters);
  sourceSelect.addEventListener('change', applyFilters);
  conditionSelect.addEventListener('change', applyFilters);
  resetButton.addEventListener('click', () => {
    categorySelect.value = 'all';
    sourceSelect.value = 'all';
    conditionSelect.value = 'all';
    applyFilters();
  });

  applyFilters();
});
```

- [ ] **Step 3: Verify structure**

Run: `grep -c "filter-source\|Nissan Leaf\|Chevy Volt\|General Motors" shop.html`
Expected: a number greater than 0.

- [ ] **Step 4: Commit**

```bash
git add shop.html js/shop-page.js
git commit -m "Add Source filter to shop page"
```

---

### Task 6: Home page — broadened positioning copy

**Files:**
- Modify: `index.html` (full replacement)

**Interfaces:**
- Consumes: new theme classes (Task 1), `YRB.LISTINGS`/`YRB.catalog.renderListingCard` (unchanged interfaces from Tasks 3/4)
- Produces: updated `index.html`

- [ ] **Step 1: Replace the full contents of `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>York Region Battery | Salvaged EV &amp; Transit Battery Modules for Solar Storage</title>
  <meta name="description" content="York Region Battery sells tested, salvaged battery modules reclaimed from TTC transit buses, Nissan Leafs, and Chevy Volts — ideal for DIY solar and off-grid power storage in York Region, Ontario.">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="site-header">
    <div class="container site-header__inner">
      <a class="brand" href="index.html">
        <img class="brand__mark" src="images/placeholders/brand-mark.svg" alt="" width="28" height="28">
        <span class="brand__name">York Region Battery</span>
      </a>
      <nav class="site-nav" aria-label="Primary">
        <a href="index.html" aria-current="page">Home</a>
        <a href="shop.html">Shop</a>
        <a href="about.html">About &amp; FAQ</a>
        <a href="contact.html">Contact</a>
      </nav>
    </div>
  </header>

  <main>
    <section class="hero container">
      <p class="eyebrow">Salvaged &middot; Graded &middot; Solar-Ready</p>
      <h1>Reclaimed EV &amp; Transit Battery Modules. Tested Where Marked. Ready for Your Solar Storage Build.</h1>
      <p class="hero__subhead">We salvage, test, and grade battery modules pulled from retired transit buses and EVs — including TTC buses, Nissan Leafs, and Chevy Volts — so you can build a reliable DIY powerwall for a fraction of the cost of new cells.</p>
      <div class="hero__actions">
        <a class="button button--primary" href="shop.html">Browse the Shop</a>
        <a class="button button--secondary" href="contact.html">Ask a Question</a>
      </div>
    </section>

    <section class="page-section container">
      <h2>Why Buy Salvaged Cells?</h2>
      <div class="trust-grid">
        <div class="trust-card">
          <h3>Tested &amp; Graded</h3>
          <p>Every module we list as Tested &amp; Graded is capacity-checked and balance-checked before it goes up for sale, so you know what you're actually getting.</p>
        </div>
        <div class="trust-card">
          <h3>Real Provenance</h3>
          <p>These modules come from real decommissioned vehicles — TTC transit buses, Nissan Leafs, and Chevy Volts — not unknown bulk-bin salvage.</p>
        </div>
        <div class="trust-card">
          <h3>Built for Solar Storage</h3>
          <p>Whether it's LiFePO4 from our TTC modules or NMC/LMO from Leaf and Volt modules, these are proven EV-grade cells — a great fit whether you're new to DIY power or expanding an existing bank.</p>
        </div>
        <div class="trust-card">
          <h3>Local, York Region, Ontario</h3>
          <p>Based in York Region. Local pickup available, shipping arranged on request.</p>
        </div>
      </div>
    </section>

    <section class="page-section container">
      <h2>Featured Listings</h2>
      <div id="featured-listings" class="catalog-grid"></div>
      <p><a href="shop.html">See the full catalog &rarr;</a></p>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container site-footer__inner">
      <div class="site-footer__brand">
        <strong>York Region Battery</strong>
        <p>Salvaged EV &amp; transit battery parts, tested and sold for solar &amp; off-grid use.<br>Serving York Region, Ontario.</p>
      </div>
      <div class="site-footer__contact">
        <a href="mailto:lucasnauta@gmail.com">lucasnauta@gmail.com</a>
        <a href="tel:+14378980642">437-898-0642 (call or text)</a>
      </div>
    </div>
    <div class="container site-footer__legal">
      <p>York Region Battery is an independent salvage reseller and is not affiliated with, endorsed by, or sponsored by the Toronto Transit Commission (TTC), Nissan, or General Motors.</p>
    </div>
  </footer>

  <script src="js/listings.js"></script>
  <script src="js/format.js"></script>
  <script src="js/catalog.js"></script>
  <script src="js/home-page.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify structure**

Run: `grep -c "eyebrow\|Nissan Leaf\|Chevy Volt\|General Motors" index.html`
Expected: a number greater than 0.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Broaden home page positioning to multi-source salvage"
```

---

### Task 7: About page — broadened content and chemistry safety note

**Files:**
- Modify: `about.html` (full replacement)

**Interfaces:**
- Consumes: new theme classes (Task 1)
- Produces: updated `about.html`

- [ ] **Step 1: Replace the full contents of `about.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About &amp; FAQ | York Region Battery</title>
  <meta name="description" content="What our salvaged EV and transit battery modules are, why they come from TTC buses, Nissan Leafs, and Chevy Volts, how York Region Battery tests and grades them, and our safety, shipping, and return policies.">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="site-header">
    <div class="container site-header__inner">
      <a class="brand" href="index.html">
        <img class="brand__mark" src="images/placeholders/brand-mark.svg" alt="" width="28" height="28">
        <span class="brand__name">York Region Battery</span>
      </a>
      <nav class="site-nav" aria-label="Primary">
        <a href="index.html">Home</a>
        <a href="shop.html">Shop</a>
        <a href="about.html" aria-current="page">About &amp; FAQ</a>
        <a href="contact.html">Contact</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <section class="page-section">
      <h1>About &amp; FAQ</h1>

      <h2>What Are These Modules?</h2>
      <p>We sell three kinds of salvaged battery modules: A123 12S8P modules (96 cylindrical 26650 LiFePO4 cells, 12 groups of 8 in parallel connected in series) pulled from Toronto Transit Commission bus packs; Nissan Leaf modules (2S2P, laminated pouch LMO/NMC cells) pulled from Leaf EV packs; and Chevy Volt modules (3 cells in series, NMC prismatic pouch cells) pulled from Gen 1 Volt EV packs. Each listing's spec table states exactly which type you're looking at.</p>

      <h2>Why These Sources?</h2>
      <p>Transit bus and EV battery packs get retired for reasons that have nothing to do with individual cell health — route changes, vehicle write-offs, fleet and model upgrades. That means a lot of the modules coming out of these packs still have plenty of usable life left, which makes them a strong source of cells for secondary, stationary use like home solar storage, even though they're no longer suitable for the demanding duty cycle of a vehicle.</p>

      <h2>How We Test &amp; Grade</h2>
      <p>Every module goes through the same process: visual inspection for physical damage, a full voltage check, a controlled capacity discharge test, and a balance check across its series groups. Modules that pass are listed as <strong>Tested &amp; Graded</strong>. Modules we haven't run through the full process yet are listed as <strong>As-Is Salvage</strong> — visually inspected only, priced lower to reflect the added risk and work that falls on the buyer.</p>

      <h2>Safety Notes</h2>
      <p>LiFePO4 is one of the most thermally stable lithium chemistries available, which is part of why it's a good fit for DIY storage projects. That said, treat any used battery module with care: don't short the terminals, store modules in a cool, dry place, use a BMS appropriate for your series/parallel configuration, and don't mix Tested &amp; Graded and As-Is modules in the same series string without testing the As-Is modules first.</p>
      <p>Not all of our modules are the same chemistry, and that matters for how you handle and charge them. Our TTC A123 modules are LiFePO4. Our Nissan Leaf and Chevy Volt modules are NMC/LMO pouch cells — energy-dense and well-proven in EVs, but less thermally tolerant and less forgiving of overcharge than LiFePO4. Don't charge them with LiFePO4 voltage settings, don't mix chemistries in the same series string, and match your BMS/charger to the specific chemistry of what you're building with.</p>

      <h2>Shipping &amp; Pickup</h2>
      <p>Local pickup is available in York Region, Ontario, by appointment. Shipping is arranged case-by-case for modules — reach out before ordering to confirm shipping options and cost for your location.</p>

      <h2>Returns &amp; Disputes</h2>
      <p>For Tested &amp; Graded modules: contact us within 7 days of pickup or delivery if a module doesn't meet its stated specs, and we'll work it out case by case. As-Is Salvage items are sold as-is with no returns, which is reflected in their price.</p>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container site-footer__inner">
      <div class="site-footer__brand">
        <strong>York Region Battery</strong>
        <p>Salvaged EV &amp; transit battery parts, tested and sold for solar &amp; off-grid use.<br>Serving York Region, Ontario.</p>
      </div>
      <div class="site-footer__contact">
        <a href="mailto:lucasnauta@gmail.com">lucasnauta@gmail.com</a>
        <a href="tel:+14378980642">437-898-0642 (call or text)</a>
      </div>
    </div>
    <div class="container site-footer__legal">
      <p>York Region Battery is an independent salvage reseller and is not affiliated with, endorsed by, or sponsored by the Toronto Transit Commission (TTC), Nissan, or General Motors.</p>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 2: Verify section count and new safety content**

Run: `grep -c "<h2>" about.html && grep -c "NMC/LMO\|Why These Sources" about.html`
Expected: first command outputs `6` (same section count as before — "Why TTC Buses?" was renamed, not added to); second command outputs a number greater than 0.

- [ ] **Step 3: Commit**

```bash
git add about.html
git commit -m "Broaden About page content and add chemistry-specific safety note"
```

---

### Task 8: Contact page — metadata and footer update

**Files:**
- Modify: `contact.html` (full replacement)

**Interfaces:**
- Consumes: new theme classes (Task 1)
- Produces: updated `contact.html`

- [ ] **Step 1: Replace the full contents of `contact.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact | York Region Battery</title>
  <meta name="description" content="Contact York Region Battery by email or phone about salvaged EV and transit battery module listings, local pickup, or shipping in York Region, Ontario.">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="site-header">
    <div class="container site-header__inner">
      <a class="brand" href="index.html">
        <img class="brand__mark" src="images/placeholders/brand-mark.svg" alt="" width="28" height="28">
        <span class="brand__name">York Region Battery</span>
      </a>
      <nav class="site-nav" aria-label="Primary">
        <a href="index.html">Home</a>
        <a href="shop.html">Shop</a>
        <a href="about.html">About &amp; FAQ</a>
        <a href="contact.html" aria-current="page">Contact</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <section class="page-section">
      <h1>Contact</h1>
      <p>Have a question about a listing, want to arrange local pickup, or need a quote on shipping? Reach out directly — we typically reply within a day.</p>
      <div class="contact-actions">
        <a class="button button--primary" href="mailto:lucasnauta@gmail.com?subject=General%20Inquiry">Email Us</a>
        <a class="button button--secondary" href="tel:+14378980642">Call / Text: 437-898-0642</a>
      </div>
      <p>Based in York Region, Ontario.</p>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container site-footer__inner">
      <div class="site-footer__brand">
        <strong>York Region Battery</strong>
        <p>Salvaged EV &amp; transit battery parts, tested and sold for solar &amp; off-grid use.<br>Serving York Region, Ontario.</p>
      </div>
      <div class="site-footer__contact">
        <a href="mailto:lucasnauta@gmail.com">lucasnauta@gmail.com</a>
        <a href="tel:+14378980642">437-898-0642 (call or text)</a>
      </div>
    </div>
    <div class="container site-footer__legal">
      <p>York Region Battery is an independent salvage reseller and is not affiliated with, endorsed by, or sponsored by the Toronto Transit Commission (TTC), Nissan, or General Motors.</p>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 2: Verify contact links unchanged and footer updated**

Run: `grep -o 'href="mailto:[^"]*"\|href="tel:[^"]*"' contact.html && grep -c "General Motors" contact.html`
Expected:
```
href="mailto:lucasnauta@gmail.com?subject=General%20Inquiry"
href="tel:+14378980642"
```
then a number greater than 0.

- [ ] **Step 3: Commit**

```bash
git add contact.html
git commit -m "Update contact page metadata and footer for multi-brand disclaimer"
```

---

### Task 9: Final visual + functional QA pass

**Files:** none created — verification only, using the already-configured `.claude/launch.json` preview server.

**Interfaces:**
- Consumes: all files from Tasks 1-8

- [ ] **Step 1: Start the preview server and visually inspect the new theme**

Use `preview_start` with name `york-region-battery-static` (already configured), then `preview_screenshot` on `/`. Check: hero renders with eyebrow label, Anton display headline, halftone texture, and angled bottom edge without clipping any text; buttons show the ink-outline/hard-shadow comic treatment; overall palette is warm/dark with orange accent, not the old teal.

- [ ] **Step 2: Verify catalog now has 7 listings with correct badges**

On `/shop.html`, use `preview_eval` to confirm `document.querySelectorAll('.listing-card').length === 7` on initial load, and that the Nissan Leaf and Chevy Volt cards both show the "As-Is Salvage" badge (not "Tested & Graded").

- [ ] **Step 3: Verify the new Source filter**

Select Source = "Nissan Leaf" and confirm exactly 1 card renders (`nissan-leaf-module`); select Source = "Chevy Volt" and confirm exactly 1 card renders; select Source = "TTC Transit Bus" and confirm exactly 5 cards render; reset and confirm all 7 return. Re-verify combining Source with Category/Condition still narrows correctly (e.g. Category=modules + Source=ttc should show exactly 2 cards).

- [ ] **Step 4: Verify mobile layout and no horizontal overflow**

Use `preview_resize` with `preset: "mobile"` on `/` and `/shop.html`. Check `document.documentElement.scrollWidth === document.documentElement.clientWidth` (no overflow from the hero's clip-path/halftone background), and that the filter bar (now 3 selects + button) wraps cleanly instead of overflowing.

- [ ] **Step 5: Check console/network for errors**

Use `preview_console_logs` with `level: "error"` and `preview_network` with `filter: "failed"` after loading all 4 pages. Expected: both empty.

- [ ] **Step 6: Fix any issues found in Steps 1-5, then commit**

If the hero's `clip-path` crops the headline or any text, increase `.hero`'s bottom padding in `css/style.css` until it doesn't. If anything else is visually broken, fix it directly and verify again before committing.

```bash
git add -A
git commit -m "Final QA fixes for theme and catalog expansion" --allow-empty
```

(Use `--allow-empty` only if Steps 1-5 found nothing to fix and there's nothing to commit; otherwise commit the real fix with a message describing what was fixed.)

---

## Deployment

No change to the original plan's deployment approach — same static files, same Cloudflare Pages target. Nothing in this plan requires new deployment configuration.
