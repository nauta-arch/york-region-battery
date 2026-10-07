# York Region Battery Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the York Region Battery static storefront website (home, shop/catalog, about/FAQ, contact) per the approved spec, ready to deploy to Cloudflare Pages under `yorkregionbattery.ca`.

**Architecture:** Plain static HTML + CSS + classic (non-module) vanilla JS. All pages share one global namespace object `window.YRB`. No framework, no bundler, no npm/package.json, no build step — files are served as-is. Pure logic (price/condition formatting, catalog filtering) lives in small standalone script files and is verified with Node's built-in `vm` module (zero dependencies, dev-only, never shipped as a dependency) rather than a test framework, matching the spec's explicit "no automated test suite, manual verification" decision for this project.

**Tech Stack:** HTML5, CSS3 (custom properties, no preprocessor), vanilla JS (ES2017, classic scripts — no `import`/`export`), Google Fonts (Space Grotesk + Inter via `<link>`, no local font files), Node.js (dev-time only, for `vm`-based logic verification — not part of the shipped site).

## Global Constraints

- No build step, no framework, no Node toolchain in the shipped site — plain static files only (spec: Architecture).
- Contact/buy is `mailto:lucasnauta@gmail.com` and `tel:+14378980642` only — no form backend, no third-party form service (spec: Contact / Buy Flow).
- Every listing has a required `condition` field (`tested` | `as-is`) rendered as a visible badge — this is the core trust mechanism (spec: Data Model).
- No fabricated testimonials, review counts, or unverifiable trust claims anywhere in copy (spec: Visual Design).
- No scraped/internet photos — only original placeholder graphics (SVG diagrams/icons), clearly diagrams rather than photos (spec: Images).
- Footer on every page must disclose the business is independent and not affiliated with/endorsed by the TTC (spec: Visual Design).
- Deploy target is Cloudflare Pages serving plain static files from the repo root, domain `yorkregionbattery.ca` (spec: Deployment).
- All currency is CAD.

---

## File Structure

```
/
├── index.html
├── shop.html
├── about.html
├── contact.html
├── favicon.svg
├── css/
│   └── style.css
├── images/
│   └── placeholders/
│       ├── brand-mark.svg
│       ├── module-diagram.svg
│       ├── icon-cells.svg
│       ├── icon-bms.svg
│       └── icon-hardware.svg
├── js/
│   ├── listings.js      (catalog data → window.YRB.LISTINGS)
│   ├── format.js         (pure formatting helpers → window.YRB.format)
│   ├── catalog.js         (filter + render → window.YRB.catalog)
│   ├── home-page.js        (wires featured listings into index.html)
│   └── shop-page.js        (wires filter bar + grid into shop.html)
└── .claude/
    └── launch.json         (local static-file preview server config)
```

---

### Task 1: Global stylesheet, design tokens, and favicon

**Files:**
- Create: `css/style.css`
- Create: `favicon.svg`

**Interfaces:**
- Consumes: nothing
- Produces (used by every later task): CSS custom properties `--color-bg`, `--color-surface`, `--color-surface-alt`, `--color-border`, `--color-text`, `--color-text-muted`, `--color-accent`, `--color-accent-dark`, `--color-badge-tested-bg`, `--color-badge-tested-text`, `--color-badge-asis-bg`, `--color-badge-asis-text`, `--font-heading`, `--font-body`, `--space-xs`, `--space-sm`, `--space-md`, `--space-lg`, `--space-xl`, `--max-width`, `--radius`. CSS classes `.container`, `.site-header`, `.site-header__inner`, `.brand`, `.brand__mark`, `.brand__name`, `.site-nav`, `.site-footer`, `.site-footer__inner`, `.site-footer__contact`, `.site-footer__legal`, `.button`, `.button--primary`, `.button--secondary`, `.badge`, `.badge--tested`, `.badge--asis`.

- [ ] **Step 1: Create `css/style.css` with reset, tokens, layout, header/footer, buttons, and badges**

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
h1, h2, h3 { font-family: var(--font-heading); line-height: 1.2; margin: 0 0 var(--space-sm); }
p { margin: 0 0 var(--space-sm); }

/* ---------- Design Tokens ---------- */
:root {
  --color-bg: #0e1113;
  --color-surface: #161b1e;
  --color-surface-alt: #1d2327;
  --color-border: #2a3136;
  --color-text: #e8ecee;
  --color-text-muted: #9aa5ab;
  --color-accent: #3dd6b0;
  --color-accent-dark: #27a885;
  --color-badge-tested-bg: rgba(61, 214, 176, 0.15);
  --color-badge-tested-text: #3dd6b0;
  --color-badge-asis-bg: rgba(154, 165, 171, 0.15);
  --color-badge-asis-text: #9aa5ab;

  --font-heading: 'Space Grotesk', system-ui, sans-serif;
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

/* ---------- Header ---------- */
.site-header { border-bottom: 1px solid var(--color-border); background-color: var(--color-surface); }
.site-header__inner { display: flex; align-items: center; justify-content: space-between; padding: var(--space-sm) 0; }
.brand { display: flex; align-items: center; gap: var(--space-xs); color: var(--color-text); }
.brand:hover { text-decoration: none; }
.brand__mark { width: 28px; height: 28px; }
.brand__name { font-family: var(--font-heading); font-weight: 600; font-size: 1.1rem; letter-spacing: 0.02em; }
.site-nav { display: flex; gap: var(--space-md); }
.site-nav a { color: var(--color-text-muted); font-weight: 500; }
.site-nav a:hover, .site-nav a[aria-current="page"] { color: var(--color-accent); }

/* ---------- Footer ---------- */
.site-footer { border-top: 1px solid var(--color-border); background-color: var(--color-surface); margin-top: var(--space-xl); padding: var(--space-lg) 0 var(--space-md); }
.site-footer__inner { display: flex; flex-wrap: wrap; gap: var(--space-lg); justify-content: space-between; }
.site-footer__contact a { display: block; color: var(--color-text); margin-bottom: var(--space-xs); }
.site-footer__legal { margin-top: var(--space-md); padding-top: var(--space-md); border-top: 1px solid var(--color-border); color: var(--color-text-muted); font-size: 0.85rem; }

/* ---------- Buttons ---------- */
.button { display: inline-block; padding: 0.65rem 1.25rem; border-radius: var(--radius); font-weight: 600; text-decoration: none; }
.button--primary { background-color: var(--color-accent); color: #04211b; }
.button--primary:hover { background-color: var(--color-accent-dark); text-decoration: none; }
.button--secondary { background-color: transparent; color: var(--color-text); border: 1px solid var(--color-border); }
.button--secondary:hover { border-color: var(--color-accent); color: var(--color-accent); text-decoration: none; }

/* ---------- Badges ---------- */
.badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.02em; text-transform: uppercase; }
.badge--tested { background-color: var(--color-badge-tested-bg); color: var(--color-badge-tested-text); }
.badge--asis { background-color: var(--color-badge-asis-bg); color: var(--color-badge-asis-text); }

/* ---------- Responsive ---------- */
@media (max-width: 768px) {
  .site-header__inner { flex-direction: column; align-items: flex-start; gap: var(--space-xs); }
  .site-nav { gap: var(--space-sm); flex-wrap: wrap; }
}
```

- [ ] **Step 2: Create `favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect x="4" y="10" width="20" height="12" rx="2" fill="#3dd6b0"/>
  <rect x="24" y="14" width="3" height="4" fill="#3dd6b0"/>
  <path d="M15 12 L10 18 L14 18 L12 22 L19 15 L15 15 Z" fill="#0e1113"/>
</svg>
```

- [ ] **Step 3: Verify the stylesheet defines every required class**

Run: `grep -c "^\." css/style.css && grep -E "\.(site-header|site-footer|button--primary|button--secondary|badge--tested|badge--asis)\b" css/style.css | wc -l`
Expected: the second command outputs `6` or more (all six class names found at least once).

- [ ] **Step 4: Commit**

```bash
git add css/style.css favicon.svg
git commit -m "Add global stylesheet, design tokens, and favicon"
```

---

### Task 2: Placeholder SVG graphics

**Files:**
- Create: `images/placeholders/brand-mark.svg`
- Create: `images/placeholders/module-diagram.svg`
- Create: `images/placeholders/icon-cells.svg`
- Create: `images/placeholders/icon-bms.svg`
- Create: `images/placeholders/icon-hardware.svg`

**Interfaces:**
- Consumes: nothing (colors are hardcoded hex matching Task 1's tokens, since `<img>`-loaded SVGs can't read the parent page's CSS custom properties)
- Produces: the five file paths above, referenced by `js/listings.js` (Task 3) and the header brand mark (Task 6+)

- [ ] **Step 1: Create `images/placeholders/brand-mark.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" role="img" aria-label="York Region Battery mark">
  <rect x="6" y="15" width="30" height="18" rx="3" fill="#3dd6b0"/>
  <rect x="36" y="21" width="4" height="6" fill="#3dd6b0"/>
  <path d="M23 18 L15 27 L21 27 L18 33 L28 22 L22 22 Z" fill="#0e1113"/>
</svg>
```

- [ ] **Step 2: Create `images/placeholders/module-diagram.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" role="img" aria-label="Diagram of a 12S8P A123 battery module">
  <rect x="20" y="20" width="300" height="260" rx="12" fill="none" stroke="#3dd6b0" stroke-width="3"/>
  <g fill="#3dd6b0">
    <circle cx="45" cy="55" r="9"/><circle cx="75" cy="55" r="9"/><circle cx="105" cy="55" r="9"/><circle cx="135" cy="55" r="9"/>
    <circle cx="165" cy="55" r="9"/><circle cx="195" cy="55" r="9"/><circle cx="225" cy="55" r="9"/><circle cx="255" cy="55" r="9"/>
    <circle cx="45" cy="90" r="9"/><circle cx="75" cy="90" r="9"/><circle cx="105" cy="90" r="9"/><circle cx="135" cy="90" r="9"/>
    <circle cx="165" cy="90" r="9"/><circle cx="195" cy="90" r="9"/><circle cx="225" cy="90" r="9"/><circle cx="255" cy="90" r="9"/>
  </g>
  <text x="150" y="145" fill="#9aa5ab" font-size="22" text-anchor="middle" font-family="monospace">⋮</text>
  <g fill="#3dd6b0">
    <circle cx="45" cy="250" r="9"/><circle cx="75" cy="250" r="9"/><circle cx="105" cy="250" r="9"/><circle cx="135" cy="250" r="9"/>
    <circle cx="165" cy="250" r="9"/><circle cx="195" cy="250" r="9"/><circle cx="225" cy="250" r="9"/><circle cx="255" cy="250" r="9"/>
  </g>
  <text x="288" y="150" fill="#e8ecee" font-size="14" font-family="sans-serif" text-anchor="middle" transform="rotate(90 288 150)">12 groups in series (S)</text>
  <text x="170" y="292" fill="#9aa5ab" font-size="13" font-family="sans-serif" text-anchor="middle">26650 LiFePO4 cells · 8 in parallel per group (8P)</text>
</svg>
```

- [ ] **Step 3: Create `images/placeholders/icon-cells.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" role="img" aria-label="Icon of a loose cylindrical cell">
  <rect x="16" y="6" width="16" height="36" rx="4" fill="none" stroke="#3dd6b0" stroke-width="3"/>
  <rect x="20" y="2" width="8" height="6" rx="1" fill="#3dd6b0"/>
  <line x1="16" y1="16" x2="32" y2="16" stroke="#3dd6b0" stroke-width="2"/>
</svg>
```

- [ ] **Step 4: Create `images/placeholders/icon-bms.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" role="img" aria-label="Icon of a battery management system board">
  <rect x="6" y="8" width="36" height="32" rx="3" fill="none" stroke="#3dd6b0" stroke-width="3"/>
  <rect x="16" y="16" width="8" height="8" fill="#3dd6b0"/>
  <line x1="6" y1="24" x2="16" y2="24" stroke="#3dd6b0" stroke-width="2"/>
  <line x1="24" y1="20" x2="36" y2="20" stroke="#3dd6b0" stroke-width="2"/>
  <line x1="24" y1="28" x2="36" y2="28" stroke="#3dd6b0" stroke-width="2"/>
  <circle cx="36" cy="14" r="2" fill="#3dd6b0"/>
</svg>
```

- [ ] **Step 5: Create `images/placeholders/icon-hardware.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" role="img" aria-label="Icon of salvaged hardware such as bus bars and connectors">
  <rect x="6" y="20" width="36" height="8" rx="2" fill="#3dd6b0"/>
  <circle cx="12" cy="24" r="3" fill="#0e1113"/>
  <circle cx="36" cy="24" r="3" fill="#0e1113"/>
  <rect x="20" y="10" width="8" height="8" rx="1" fill="none" stroke="#3dd6b0" stroke-width="2"/>
</svg>
```

- [ ] **Step 6: Verify all five files are well-formed and present**

Run: `for f in images/placeholders/*.svg; do echo "$f"; python3 -c "import xml.dom.minidom as m; m.parse('$f')" && echo OK; done`
Expected: `OK` printed after each of the 5 file paths, no errors.

- [ ] **Step 7: Commit**

```bash
git add images/placeholders/
git commit -m "Add original placeholder graphics for brand mark and catalog categories"
```

---

### Task 3: Catalog data

**Files:**
- Create: `js/listings.js`

**Interfaces:**
- Consumes: image paths from Task 2 (`images/placeholders/module-diagram.svg`, `icon-cells.svg`, `icon-bms.svg`, `icon-hardware.svg`)
- Produces: global `window.YRB.LISTINGS` — an array of 5 objects, each with fields `id` (string), `category` (`"modules"|"cells"|"bms"|"hardware"`), `name` (string), `price` (number), `currency` (`"CAD"`), `qtyAvailable` (number), `condition` (`"tested"|"as-is"`), `specs` (object of string→string), `description` (string), `image` (relative path string). Used by `js/catalog.js` (Task 5), `js/home-page.js` (Task 6), `js/shop-page.js` (Task 7).

- [ ] **Step 1: Create `js/listings.js`**

```js
window.YRB = window.YRB || {};

YRB.LISTINGS = [
  {
    id: "a123-12s8p-batch1",
    category: "modules",
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
  }
];
```

- [ ] **Step 2: Verify the data loads and has the expected shape**

Run:
```bash
node -e "
const fs = require('fs'); const vm = require('vm');
const sandbox = {}; vm.createContext(sandbox);
vm.runInContext('var window = this;', sandbox);
vm.runInContext(fs.readFileSync('js/listings.js', 'utf8'), sandbox);
console.log(sandbox.YRB.LISTINGS.length);
console.log(sandbox.YRB.LISTINGS.map(l => l.id));
"
```
Expected:
```
5
[
  'a123-12s8p-batch1',
  'a123-12s8p-batch2',
  '26650-loose-cell',
  'ttc-bms-board',
  'bus-bar-connector-set'
]
```

- [ ] **Step 3: Commit**

```bash
git add js/listings.js
git commit -m "Add initial catalog data for York Region Battery"
```

---

### Task 4: Formatting helpers (`js/format.js`)

**Files:**
- Create: `js/format.js`

**Interfaces:**
- Consumes: listing objects shaped as in Task 3 (fields `name`, `price`, `currency`, `condition`)
- Produces: `YRB.format.price(listing) -> string`, `YRB.format.conditionLabel(condition) -> string`, `YRB.format.conditionClass(condition) -> string`, `YRB.format.mailtoLink(listing) -> string`, `YRB.format.telLink() -> string`. Used by `js/catalog.js` (Task 5).

- [ ] **Step 1: Create a stub `js/format.js`**

```js
window.YRB = window.YRB || {};
YRB.format = {};
```

- [ ] **Step 2: Run the verification command and confirm it fails**

Run:
```bash
node -e "
const fs = require('fs'); const vm = require('vm');
const sandbox = {}; vm.createContext(sandbox);
vm.runInContext('var window = this;', sandbox);
vm.runInContext(fs.readFileSync('js/format.js', 'utf8'), sandbox);
console.log(sandbox.YRB.format.price({price: 85, currency: 'CAD'}));
console.log(sandbox.YRB.format.conditionLabel('tested'));
console.log(sandbox.YRB.format.mailtoLink({name: 'A123 12S8P Module — Batch 1'}));
"
```
Expected: `TypeError: sandbox.YRB.format.price is not a function` (the stub has no methods yet).

- [ ] **Step 3: Implement `js/format.js`**

```js
window.YRB = window.YRB || {};

YRB.format = {
  price(listing) {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: listing.currency || 'CAD'
    }).format(listing.price);
  },

  conditionLabel(condition) {
    return condition === 'tested' ? 'Tested & Graded' : 'As-Is Salvage';
  },

  conditionClass(condition) {
    return condition === 'tested' ? 'badge badge--tested' : 'badge badge--asis';
  },

  mailtoLink(listing) {
    const subject = encodeURIComponent(`Inquiry: ${listing.name}`);
    return `mailto:lucasnauta@gmail.com?subject=${subject}`;
  },

  telLink() {
    return 'tel:+14378980642';
  }
};
```

- [ ] **Step 4: Run the verification command again and confirm it passes**

Run the same command as Step 2.
Expected:
```
$85.00
Tested & Graded
mailto:lucasnauta@gmail.com?subject=Inquiry%3A%20A123%2012S8P%20Module%20%E2%80%94%20Batch%201
```
(The exact currency string may render as `$85.00` or `CA$85.00` depending on the ICU data built into your Node binary — either is correct as long as it reads as eighty-five dollars. The `conditionLabel` and `mailtoLink` lines must match exactly.)

- [ ] **Step 5: Commit**

```bash
git add js/format.js
git commit -m "Add price/condition/contact-link formatting helpers"
```

---

### Task 5: Catalog filtering and rendering (`js/catalog.js`)

**Files:**
- Create: `js/catalog.js`
- Modify: `css/style.css` (append catalog grid/card styles)

**Interfaces:**
- Consumes: `YRB.LISTINGS` (Task 3), `YRB.format.price/conditionLabel/conditionClass/mailtoLink/telLink` (Task 4), CSS classes `.button`, `.button--primary`, `.button--secondary`, `.badge*` (Task 1)
- Produces: `YRB.catalog.filterListings(listings, filters) -> array`, `YRB.catalog.renderListingCard(listing) -> string` (HTML), `YRB.catalog.renderCatalog(containerEl, emptyEl, listings) -> void`. CSS classes `.catalog-grid`, `.listing-card`, `.listing-card__image`, `.listing-card__body`, `.listing-card__title`, `.listing-card__price`, `.listing-card__specs`, `.listing-card__description`, `.listing-card__actions`. Used by `js/home-page.js` (Task 6) and `js/shop-page.js` (Task 7).

- [ ] **Step 1: Create a stub `js/catalog.js`**

```js
window.YRB = window.YRB || {};
YRB.catalog = {};
```

- [ ] **Step 2: Run the verification command and confirm it fails**

Run:
```bash
node -e "
const fs = require('fs'); const vm = require('vm');
const sandbox = {}; vm.createContext(sandbox);
vm.runInContext('var window = this;', sandbox);
vm.runInContext(fs.readFileSync('js/catalog.js', 'utf8'), sandbox);
const sample = [
  {category: 'modules', condition: 'tested', name: 'A'},
  {category: 'modules', condition: 'as-is', name: 'B'},
  {category: 'cells', condition: 'tested', name: 'C'}
];
console.log(sandbox.YRB.catalog.filterListings(sample, {category: 'modules', condition: 'all'}).map(i => i.name));
"
```
Expected: `TypeError: sandbox.YRB.catalog.filterListings is not a function`

- [ ] **Step 3: Implement `js/catalog.js`**

```js
window.YRB = window.YRB || {};

YRB.catalog = {
  filterListings(listings, filters) {
    const { category = 'all', condition = 'all' } = filters || {};
    return listings.filter((item) => {
      const categoryMatches = category === 'all' || item.category === category;
      const conditionMatches = condition === 'all' || item.condition === condition;
      return categoryMatches && conditionMatches;
    });
  },

  renderListingCard(listing) {
    const priceText = YRB.format.price(listing);
    const badgeClass = YRB.format.conditionClass(listing.condition);
    const badgeLabel = YRB.format.conditionLabel(listing.condition);
    const specRows = Object.entries(listing.specs)
      .map(([key, value]) => `<tr><th>${key}</th><td>${value}</td></tr>`)
      .join('');

    return `
      <article class="listing-card" data-category="${listing.category}" data-condition="${listing.condition}">
        <img class="listing-card__image" src="${listing.image}" alt="${listing.name}" loading="lazy">
        <div class="listing-card__body">
          <span class="${badgeClass}">${badgeLabel}</span>
          <h3 class="listing-card__title">${listing.name}</h3>
          <p class="listing-card__price">${priceText} &middot; ${listing.qtyAvailable} available</p>
          <table class="listing-card__specs">${specRows}</table>
          <p class="listing-card__description">${listing.description}</p>
          <div class="listing-card__actions">
            <a class="button button--primary" href="${YRB.format.mailtoLink(listing)}">Email about this listing</a>
            <a class="button button--secondary" href="${YRB.format.telLink()}">Call / Text</a>
          </div>
        </div>
      </article>
    `;
  },

  renderCatalog(containerEl, emptyEl, listings) {
    if (!listings.length) {
      containerEl.innerHTML = '';
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;
    containerEl.innerHTML = listings.map(YRB.catalog.renderListingCard).join('');
  }
};
```

- [ ] **Step 4: Run the verification command again and confirm it passes**

Run (extend the Step 2 script with a second assertion):
```bash
node -e "
const fs = require('fs'); const vm = require('vm');
const sandbox = {}; vm.createContext(sandbox);
vm.runInContext('var window = this;', sandbox);
vm.runInContext(fs.readFileSync('js/catalog.js', 'utf8'), sandbox);
const sample = [
  {category: 'modules', condition: 'tested', name: 'A'},
  {category: 'modules', condition: 'as-is', name: 'B'},
  {category: 'cells', condition: 'tested', name: 'C'}
];
console.log(sandbox.YRB.catalog.filterListings(sample, {category: 'modules', condition: 'all'}).map(i => i.name));
console.log(sandbox.YRB.catalog.filterListings(sample, {category: 'all', condition: 'tested'}).map(i => i.name));
"
```
Expected:
```
[ 'A', 'B' ]
[ 'A', 'C' ]
```

- [ ] **Step 5: Append catalog grid/card styles to `css/style.css`**

```css

/* ---------- Catalog Grid & Cards ---------- */
.catalog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-md); margin-top: var(--space-lg); }
.listing-card { background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); overflow: hidden; display: flex; flex-direction: column; }
.listing-card__image { width: 100%; height: 160px; object-fit: contain; background-color: var(--color-surface-alt); padding: var(--space-md); }
.listing-card__body { padding: var(--space-md); display: flex; flex-direction: column; gap: var(--space-xs); }
.listing-card__title { font-size: 1.05rem; margin: var(--space-xs) 0 0; }
.listing-card__price { color: var(--color-text-muted); font-weight: 600; margin: 0; }
.listing-card__specs { width: 100%; border-collapse: collapse; font-size: 0.85rem; margin: var(--space-xs) 0; }
.listing-card__specs th { text-align: left; color: var(--color-text-muted); font-weight: 500; padding: 0.2rem 0.5rem 0.2rem 0; vertical-align: top; white-space: nowrap; }
.listing-card__specs td { padding: 0.2rem 0; }
.listing-card__description { font-size: 0.9rem; color: var(--color-text-muted); }
.listing-card__actions { display: flex; gap: var(--space-xs); margin-top: var(--space-xs); flex-wrap: wrap; }
```

- [ ] **Step 6: Commit**

```bash
git add js/catalog.js css/style.css
git commit -m "Add catalog filtering/rendering logic and card styles"
```

---

### Task 6: Home page

**Files:**
- Create: `index.html`
- Create: `js/home-page.js`
- Modify: `css/style.css` (append hero/trust-point styles)

**Interfaces:**
- Consumes: `YRB.LISTINGS` (Task 3), `YRB.catalog.renderListingCard` (Task 5), `.container`/`.button*`/`.page-section` (Task 1)
- Produces: `index.html`, `js/home-page.js`; CSS classes `.hero`, `.hero__subhead`, `.hero__actions`, `.trust-grid`, `.trust-card`

- [ ] **Step 1: Append hero/trust-point styles to `css/style.css`**

```css

/* ---------- Hero ---------- */
.hero { padding: var(--space-xl) 0; }
.hero h1 { font-size: 2.25rem; max-width: 40ch; }
.hero__subhead { max-width: 60ch; color: var(--color-text-muted); font-size: 1.1rem; }
.hero__actions { display: flex; gap: var(--space-sm); margin-top: var(--space-md); flex-wrap: wrap; }

/* ---------- Trust Points ---------- */
.trust-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-md); margin: var(--space-lg) 0; }
.trust-card { background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: var(--space-md); }
.trust-card h3 { font-size: 1.05rem; color: var(--color-accent); }
```

- [ ] **Step 2: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>York Region Battery | Salvaged TTC A123 LiFePO4 Modules for Solar Storage</title>
  <meta name="description" content="York Region Battery sells tested, salvaged A123 LiFePO4 battery modules reclaimed from TTC transit buses — ideal for DIY solar and off-grid power storage in York Region, Ontario.">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
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
      <h1>Reclaimed TTC Transit-Grade LiFePO4. Tested. Ready for Your Solar Storage Build.</h1>
      <p class="hero__subhead">We salvage, test, and grade A123 battery modules pulled from retired Toronto Transit Commission buses — so you can build a reliable DIY powerwall for a fraction of the cost of new cells.</p>
      <div class="hero__actions">
        <a class="button button--primary" href="shop.html">Browse the Shop</a>
        <a class="button button--secondary" href="contact.html">Ask a Question</a>
      </div>
    </section>

    <section class="page-section container">
      <h2>Why Buy Salvaged A123 Cells?</h2>
      <div class="trust-grid">
        <div class="trust-card">
          <h3>Tested &amp; Graded</h3>
          <p>Every module we list as Tested &amp; Graded is capacity-checked and balance-checked before it goes up for sale, so you know what you're actually getting.</p>
        </div>
        <div class="trust-card">
          <h3>Real Provenance</h3>
          <p>These cells come from real TTC transit bus battery packs — 12S8P A123 LiFePO4 modules, originally run in 16-series 660V packs — not unknown bulk-bin salvage.</p>
        </div>
        <div class="trust-card">
          <h3>Built for Solar Storage</h3>
          <p>LiFePO4 chemistry is one of the safest, longest-lasting options for stationary home battery backups — a great fit whether you're new to DIY power or expanding an existing bank.</p>
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
        <p>Salvaged TTC transit battery parts, tested and sold for solar &amp; off-grid use.<br>Serving York Region, Ontario.</p>
      </div>
      <div class="site-footer__contact">
        <a href="mailto:lucasnauta@gmail.com">lucasnauta@gmail.com</a>
        <a href="tel:+14378980642">437-898-0642 (call or text)</a>
      </div>
    </div>
    <div class="container site-footer__legal">
      <p>York Region Battery is an independent salvage reseller and is not affiliated with, endorsed by, or sponsored by the Toronto Transit Commission (TTC).</p>
    </div>
  </footer>

  <script src="js/listings.js"></script>
  <script src="js/format.js"></script>
  <script src="js/catalog.js"></script>
  <script src="js/home-page.js"></script>
</body>
</html>
```

- [ ] **Step 3: Create `js/home-page.js`**

```js
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('featured-listings');
  const featured = YRB.LISTINGS.slice(0, 3);
  container.innerHTML = featured.map(YRB.catalog.renderListingCard).join('');
});
```

- [ ] **Step 4: Verify the page's static structure**

Run: `grep -c "listing-card\|featured-listings\|site-footer__legal" index.html`
Expected: a number greater than 0 (confirms the key containers/classes are present in the markup before browser verification in Task 10).

- [ ] **Step 5: Commit**

```bash
git add index.html js/home-page.js css/style.css
git commit -m "Add home page with hero, trust points, and featured listings"
```

---

### Task 7: Shop page

**Files:**
- Create: `shop.html`
- Create: `js/shop-page.js`
- Modify: `css/style.css` (append filter bar/empty-state styles)

**Interfaces:**
- Consumes: `YRB.LISTINGS` (Task 3), `YRB.catalog.filterListings/renderCatalog` (Task 5)
- Produces: `shop.html`, `js/shop-page.js`; CSS classes `.filter-bar`, `.catalog-empty`

- [ ] **Step 1: Append filter bar/empty-state styles to `css/style.css`**

```css

/* ---------- Filter Bar ---------- */
.filter-bar { display: flex; gap: var(--space-sm); align-items: center; flex-wrap: wrap; padding: var(--space-md) 0; border-bottom: 1px solid var(--color-border); }
.filter-bar select { background-color: var(--color-surface); color: var(--color-text); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 0.5rem 0.75rem; }
.catalog-empty { padding: var(--space-lg) 0; color: var(--color-text-muted); text-align: center; }
```

- [ ] **Step 2: Create `shop.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shop | York Region Battery</title>
  <meta name="description" content="Browse tested and as-is salvaged A123 LiFePO4 modules, loose cells, BMS boards, and hardware pulled from TTC transit bus battery packs.">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
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
      <p>Filter by category or condition. "Tested &amp; Graded" means capacity- and balance-checked; "As-Is Salvage" means visually inspected only and priced accordingly.</p>

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
        <p>Salvaged TTC transit battery parts, tested and sold for solar &amp; off-grid use.<br>Serving York Region, Ontario.</p>
      </div>
      <div class="site-footer__contact">
        <a href="mailto:lucasnauta@gmail.com">lucasnauta@gmail.com</a>
        <a href="tel:+14378980642">437-898-0642 (call or text)</a>
      </div>
    </div>
    <div class="container site-footer__legal">
      <p>York Region Battery is an independent salvage reseller and is not affiliated with, endorsed by, or sponsored by the Toronto Transit Commission (TTC).</p>
    </div>
  </footer>

  <script src="js/listings.js"></script>
  <script src="js/format.js"></script>
  <script src="js/catalog.js"></script>
  <script src="js/shop-page.js"></script>
</body>
</html>
```

- [ ] **Step 3: Create `js/shop-page.js`**

```js
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('catalog-grid');
  const empty = document.getElementById('catalog-empty');
  const categorySelect = document.getElementById('filter-category');
  const conditionSelect = document.getElementById('filter-condition');
  const resetButton = document.getElementById('filter-reset');

  function applyFilters() {
    const filters = {
      category: categorySelect.value,
      condition: conditionSelect.value
    };
    const filtered = YRB.catalog.filterListings(YRB.LISTINGS, filters);
    YRB.catalog.renderCatalog(grid, empty, filtered);
  }

  categorySelect.addEventListener('change', applyFilters);
  conditionSelect.addEventListener('change', applyFilters);
  resetButton.addEventListener('click', () => {
    categorySelect.value = 'all';
    conditionSelect.value = 'all';
    applyFilters();
  });

  applyFilters();
});
```

- [ ] **Step 4: Verify the page's static structure**

Run: `grep -c "filter-category\|filter-condition\|catalog-grid\|catalog-empty" shop.html`
Expected: a number greater than 0 (confirms the filter controls and containers are present).

- [ ] **Step 5: Commit**

```bash
git add shop.html js/shop-page.js css/style.css
git commit -m "Add shop page with category/condition filtering"
```

---

### Task 8: About/FAQ page

**Files:**
- Create: `about.html`

**Interfaces:**
- Consumes: `.container`, `.page-section` (Task 1) — no JS needed, static content only
- Produces: `about.html`

- [ ] **Step 1: Create `about.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About &amp; FAQ | York Region Battery</title>
  <meta name="description" content="What A123 LiFePO4 modules are, why they come from TTC transit buses, how York Region Battery tests and grades them, and our safety, shipping, and return policies.">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
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
      <p>Our core product is the A123 12S8P module: 96 cylindrical 26650 LiFePO4 cells, wired as 12 groups of 8 in parallel, connected in series. These modules were originally built into larger battery packs — 16 modules wired in series for a nominal 660V pack voltage — used to power hybrid/electric drive systems in Toronto Transit Commission buses.</p>

      <h2>Why TTC Buses?</h2>
      <p>Transit bus battery packs are retired for reasons that have nothing to do with individual cell health — route changes, vehicle decommissioning, fleet upgrades. That means a lot of the modules coming out of these packs still have plenty of usable life left, which makes them a strong source of cells for secondary, stationary use like home solar storage, even though they're no longer suitable for the demanding duty cycle of a transit vehicle.</p>

      <h2>How We Test &amp; Grade</h2>
      <p>Every module goes through the same process: visual inspection for physical damage, a full voltage check, a controlled capacity discharge test, and a balance check across all 12 series groups. Modules that pass are listed as <strong>Tested &amp; Graded</strong>. Modules we haven't run through the full process yet are listed as <strong>As-Is Salvage</strong> — visually inspected only, priced lower to reflect the added risk and work that falls on the buyer.</p>

      <h2>Safety Notes</h2>
      <p>LiFePO4 is one of the most thermally stable lithium chemistries available, which is part of why it's a good fit for DIY storage projects. That said, treat any used battery module with care: don't short the terminals, store modules in a cool, dry place, use a BMS appropriate for your series/parallel configuration, and don't mix Tested &amp; Graded and As-Is modules in the same series string without testing the As-Is modules first.</p>

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
        <p>Salvaged TTC transit battery parts, tested and sold for solar &amp; off-grid use.<br>Serving York Region, Ontario.</p>
      </div>
      <div class="site-footer__contact">
        <a href="mailto:lucasnauta@gmail.com">lucasnauta@gmail.com</a>
        <a href="tel:+14378980642">437-898-0642 (call or text)</a>
      </div>
    </div>
    <div class="container site-footer__legal">
      <p>York Region Battery is an independent salvage reseller and is not affiliated with, endorsed by, or sponsored by the Toronto Transit Commission (TTC).</p>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 2: Verify required sections are present**

Run: `grep -c "<h2>" about.html`
Expected: `5`

- [ ] **Step 3: Commit**

```bash
git add about.html
git commit -m "Add About & FAQ page"
```

---

### Task 9: Contact page

**Files:**
- Create: `contact.html`
- Modify: `css/style.css` (append contact actions styles)

**Interfaces:**
- Consumes: `.container`, `.page-section`, `.button*` (Task 1) — no JS needed, static content only
- Produces: `contact.html`; CSS class `.contact-actions`

- [ ] **Step 1: Append contact actions styles to `css/style.css`**

```css

/* ---------- Contact Actions ---------- */
.contact-actions { display: flex; gap: var(--space-sm); margin: var(--space-md) 0; flex-wrap: wrap; }
```

- [ ] **Step 2: Create `contact.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact | York Region Battery</title>
  <meta name="description" content="Contact York Region Battery by email or phone about A123 LiFePO4 module listings, local pickup, or shipping in York Region, Ontario.">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
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
        <p>Salvaged TTC transit battery parts, tested and sold for solar &amp; off-grid use.<br>Serving York Region, Ontario.</p>
      </div>
      <div class="site-footer__contact">
        <a href="mailto:lucasnauta@gmail.com">lucasnauta@gmail.com</a>
        <a href="tel:+14378980642">437-898-0642 (call or text)</a>
      </div>
    </div>
    <div class="container site-footer__legal">
      <p>York Region Battery is an independent salvage reseller and is not affiliated with, endorsed by, or sponsored by the Toronto Transit Commission (TTC).</p>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 3: Verify contact links are correct**

Run: `grep -o 'href="mailto:[^"]*"\|href="tel:[^"]*"' contact.html`
Expected:
```
href="mailto:lucasnauta@gmail.com?subject=General%20Inquiry"
href="tel:+14378980642"
```

- [ ] **Step 4: Commit**

```bash
git add contact.html css/style.css
git commit -m "Add contact page with direct email/phone actions"
```

---

### Task 10: Local preview server and final QA pass

**Files:**
- Create: `.claude/launch.json`

**Interfaces:**
- Consumes: all files from Tasks 1-9
- Produces: `.claude/launch.json` (dev-only preview config); no production code — this task is verification plus one piece of tooling config

- [ ] **Step 1: Create `.claude/launch.json`**

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "york-region-battery-static",
      "runtimeExecutable": "python3",
      "runtimeArgs": ["-m", "http.server", "4173"],
      "port": 4173
    }
  ]
}
```

- [ ] **Step 2: Start the preview server and load each page**

Use the `preview_start` tool with name `york-region-battery-static`, then `preview_snapshot` on `/`, `/shop.html`, `/about.html`, and `/contact.html`.
Expected: each page loads, the header nav shows the correct `aria-current="page"` link highlighted, and the footer shows the business name, `lucasnauta@gmail.com`, `437-898-0642`, and the TTC disclaimer text.

- [ ] **Step 3: Verify catalog filtering behavior**

On `/shop.html`, use `preview_eval` or `preview_click`/`preview_fill` to: select category "Modules" and confirm exactly 2 cards render; select condition "Tested & Graded" (category back to "All") and confirm exactly 3 cards render (batch 1 module, loose cell, BMS board); select an impossible combination that matches nothing and confirm the `#catalog-empty` message becomes visible; click "Reset Filters" and confirm all 5 cards return.
Expected: card counts match exactly as described above at each step.

- [ ] **Step 4: Verify responsive layout**

Use `preview_resize` with `preset: "mobile"` on `/` and `/shop.html`.
Expected: header stacks vertically, catalog grid collapses to a single column, no horizontal scroll/overflow, filter bar wraps cleanly.

- [ ] **Step 5: Check for console errors**

Use `preview_console_logs` with `level: "error"` after loading each of the 4 pages.
Expected: no output (zero JS errors).

- [ ] **Step 6: Fix any issues found in Steps 2-5, then commit**

```bash
git add .claude/launch.json
git commit -m "Add local static preview server config"
```

(If Steps 2-5 surfaced any fixes, commit those separately with a message describing what was fixed before this final commit.)

---

## Deployment (manual, outside this plan)

Once all tasks pass, push this repo to GitHub/GitLab and connect it as a Cloudflare Pages project with no build command (root directory, static output). Attach the `yorkregionbattery.ca` domain in the Cloudflare Pages custom domains settings. This is a manual dashboard step for the owner, not an engineering task.
