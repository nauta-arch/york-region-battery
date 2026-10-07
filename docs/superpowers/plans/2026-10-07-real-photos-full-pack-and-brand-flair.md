# Real Photos, Full Pack Listing & Brand Flair Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct placeholder spec numbers with real test/nameplate data, swap in real product photos on the TTC listings they depict, add a new full-pack listing, and give the brand a tagline, an inspection-stamp mark, and a touch more of the existing comic-texture motif.

**Architecture:** Same plain static site, no build step. This plan makes targeted edits to existing files (not full rewrites, except `about.html` which changes enough to warrant one) — `js/catalog.js` gains optional per-listing alt text support, `js/listings.js` gets corrected specs plus a new 8th listing, `shop.html` gets a new filter option, three HTML pages get a header tagline, `index.html` gets a hero tagline, and `about.html` gets new content plus the header tagline (baked in directly since it's rewritten anyway).

**Tech Stack:** Unchanged — plain HTML/CSS/vanilla JS, no build step, no framework. Real photos are plain `.jpg` files already copied into `images/products/`.

## Global Constraints

Carried forward, still binding:
- No build step, no framework, no Node toolchain in the shipped site.
- Contact is `mailto:lucasnauta@gmail.com` / `tel:+14378980642` only.
- No fabricated testimonials/trust claims — the new A123/TTC content must stay within what's actually known/tested, hedged appropriately.
- Footer disclaimer names TTC, Nissan, and General Motors on every page — must survive every edit in this plan unchanged.
- The `18–19Ah measured (20Ah original rating)` figure is the owner's real test result, not a per-unit guarantee — never phrase it as "guaranteed" or attach it to untested listings as fact.
- Real photos get descriptive `alt` text (not empty) since they carry informative content, unlike the decorative SVG icons.

---

## File Structure (files touched by this plan)

```
/
├── index.html           (Modify — header tagline, hero tagline)
├── shop.html             (Modify — header tagline, new "Full Packs" filter option)
├── contact.html           (Modify — header tagline)
├── about.html              (Modify, full replacement — header tagline + new content + stamp)
├── css/
│   └── style.css              (Modify — tagline styles, footer texture, stamp/section-accent styles)
├── images/
│   ├── products/                 (already exists — a123-module-photo.jpg, a123-cell-photo.jpg, ttc-full-pack-photo.jpg)
│   └── placeholders/
│       └── inspection-stamp.svg     (Create)
├── js/
│   ├── listings.js                  (Modify — corrected specs, real photo paths, new pack listing)
│   └── catalog.js                    (Modify — renderListingCard reads optional imageAlt)
```

---

### Task 1: Correct real specs and swap in real photos on existing TTC listings

**Files:**
- Modify: `js/catalog.js:23` (one line — `renderListingCard`'s `<img>` tag)
- Modify: `js/listings.js:5-59` (three listing objects: `a123-12s8p-batch1`, `a123-12s8p-batch2`, `26650-loose-cell`)

**Interfaces:**
- Consumes: real photo files already present at `images/products/a123-module-photo.jpg` and `images/products/a123-cell-photo.jpg`
- Produces: `renderListingCard` now reads an optional `listing.imageAlt` field (falls back to `''` when absent, so every other listing's decorative-icon behavior is unchanged)

- [ ] **Step 1: Add optional `imageAlt` support to `renderListingCard` in `js/catalog.js`**

Find this line:
```js
        <img class="listing-card__image" src="${listing.image}" alt="" loading="lazy">
```

Replace with:
```js
        <img class="listing-card__image" src="${listing.image}" alt="${listing.imageAlt || ''}" loading="lazy">
```

- [ ] **Step 2: Update the `a123-12s8p-batch1` listing in `js/listings.js`**

Find:
```js
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
```

Replace with:
```js
    specs: {
      "Configuration": "12S8P",
      "Cell Type": "26650 LiFePO4 (A123)",
      "Nominal Voltage": "40V",
      "Capacity": "18–19Ah measured (20Ah original rating)",
      "Source": "TTC transit bus pack (16S, ~640V nominal)"
    },
    description: "Pulled from a TTC transit bus battery pack, this 12S8P module has been capacity-tested and balance-checked across all 12 series groups. Ready to drop into a solar storage bank.",
    image: "images/products/a123-module-photo.jpg",
    imageAlt: "BAE Systems A123 12S8P module, 40V/225A rating label visible"
  },
```

- [ ] **Step 3: Update the `a123-12s8p-batch2` listing in `js/listings.js`**

Find:
```js
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
```

Replace with:
```js
    specs: {
      "Configuration": "12S8P",
      "Cell Type": "26650 LiFePO4 (A123)",
      "Nominal Voltage": "40V",
      "Capacity": "Not yet capacity-tested (20Ah original rating)",
      "Source": "TTC transit bus pack (16S, ~640V nominal)"
    },
    description: "Visually inspected and voltage-checked but not yet capacity-tested — priced accordingly. Great if you're comfortable testing/grading cells yourself.",
    image: "images/products/a123-module-photo.jpg",
    imageAlt: "BAE Systems A123 12S8P module, 40V/225A rating label visible"
  },
```

- [ ] **Step 4: Update the `26650-loose-cell` listing in `js/listings.js`**

Find:
```js
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
```

Replace with:
```js
    specs: {
      "Configuration": "Single cell",
      "Cell Type": "26650 LiFePO4 (A123)",
      "Nominal Voltage": "3.3V nominal",
      "Capacity": "2.6Ah rated; individually tested cells typically measure a little under that",
      "Source": "TTC transit bus pack module teardown"
    },
    description: "Individually capacity-tested loose cells pulled down from modules. Good for topping up an existing bank or small parallel builds.",
    image: "images/products/a123-cell-photo.jpg",
    imageAlt: "A123/Lithium Werks ANR26650M1B cell with manufacturer spec label: 3.3V, 2.6Ah, 8.58Wh"
  },
```

- [ ] **Step 5: Verify the real photo files exist and the data/render changes are correct**

Run:
```bash
test -f images/products/a123-module-photo.jpg && test -f images/products/a123-cell-photo.jpg && echo "photo files OK"
node -e "
const fs = require('fs'); const vm = require('vm');
const sandbox = {}; vm.createContext(sandbox);
vm.runInContext('var window = this;', sandbox);
vm.runInContext(fs.readFileSync('js/listings.js', 'utf8'), sandbox);
vm.runInContext(fs.readFileSync('js/format.js', 'utf8'), sandbox);
vm.runInContext(fs.readFileSync('js/catalog.js', 'utf8'), sandbox);
const batch1 = sandbox.YRB.LISTINGS.find(l => l.id === 'a123-12s8p-batch1');
console.log(batch1.specs['Nominal Voltage'], '|', batch1.specs['Capacity'], '|', batch1.image);
const cell = sandbox.YRB.LISTINGS.find(l => l.id === '26650-loose-cell');
console.log(cell.specs['Nominal Voltage'], '|', cell.specs['Capacity'], '|', cell.image);
const html = sandbox.YRB.catalog.renderListingCard(batch1);
console.log(html.includes('alt=\"BAE Systems A123 12S8P module, 40V/225A rating label visible\"'));
const bms = sandbox.YRB.LISTINGS.find(l => l.id === 'ttc-bms-board');
const bmsHtml = sandbox.YRB.catalog.renderListingCard(bms);
console.log(bmsHtml.includes('alt=\"\"'));
"
```
Expected:
```
photo files OK
40V | 18–19Ah measured (20Ah original rating) | images/products/a123-module-photo.jpg
3.3V nominal | 2.6Ah rated; individually tested cells typically measure a little under that | images/products/a123-cell-photo.jpg
true
true
```
(The last line confirms the BMS listing — which has no `imageAlt` field — still renders `alt=""`, so the optional-field fallback doesn't break any other listing.)

- [ ] **Step 6: Commit**

```bash
git add js/catalog.js js/listings.js
git commit -m "Correct TTC module/cell specs with real data and swap in real photos"
```

---

### Task 2: Add the Full TTC Battery Pack listing

**Files:**
- Modify: `js/listings.js` (append new listing)
- Modify: `shop.html:40-44` (Category filter select)

**Interfaces:**
- Consumes: `images/products/ttc-full-pack-photo.jpg` (already present), `YRB.catalog.filterListings` (unchanged signature, already supports arbitrary `category` string values)
- Produces: an 8th `YRB.LISTINGS` entry with `category: "packs"`; a new `<option value="packs">` in the Shop category filter

- [ ] **Step 1: Append the new listing to `js/listings.js`**

Find the end of the array (the `chevy-volt-module` object's closing, right before the final `];`):
```js
    description: "Pulled from a Gen 1 Chevy Volt EV battery pack. Not yet capacity-tested on our end — specs shown are typical for this module type, not measured. Different chemistry than our LiFePO4 modules: check your charger/BMS voltage limits before mixing into an existing LiFePO4 bank.",
    image: "images/placeholders/volt-module-diagram.svg"
  }
];
```

Replace with:
```js
    description: "Pulled from a Gen 1 Chevy Volt EV battery pack. Not yet capacity-tested on our end — specs shown are typical for this module type, not measured. Different chemistry than our LiFePO4 modules: check your charger/BMS voltage limits before mixing into an existing LiFePO4 bank.",
    image: "images/placeholders/volt-module-diagram.svg"
  },
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
    image: "images/products/ttc-full-pack-photo.jpg",
    imageAlt: "Open TTC battery pack case showing all 16 A123 modules installed in the rack"
  }
];
```

- [ ] **Step 2: Add the "Full Packs" filter option to `shop.html`**

Find:
```html
          <select id="filter-category">
            <option value="all">All Categories</option>
            <option value="modules">Modules</option>
            <option value="cells">Loose Cells</option>
            <option value="bms">BMS &amp; Electrical</option>
            <option value="hardware">Hardware</option>
          </select>
```

Replace with:
```html
          <select id="filter-category">
            <option value="all">All Categories</option>
            <option value="modules">Modules</option>
            <option value="packs">Full Packs</option>
            <option value="cells">Loose Cells</option>
            <option value="bms">BMS &amp; Electrical</option>
            <option value="hardware">Hardware</option>
          </select>
```

- [ ] **Step 3: Verify the new listing and filter**

Run:
```bash
test -f images/products/ttc-full-pack-photo.jpg && echo "pack photo OK"
node -e "
const fs = require('fs'); const vm = require('vm');
const sandbox = {}; vm.createContext(sandbox);
vm.runInContext('var window = this;', sandbox);
vm.runInContext(fs.readFileSync('js/listings.js', 'utf8'), sandbox);
vm.runInContext(fs.readFileSync('js/format.js', 'utf8'), sandbox);
vm.runInContext(fs.readFileSync('js/catalog.js', 'utf8'), sandbox);
console.log(sandbox.YRB.LISTINGS.length);
const packs = sandbox.YRB.catalog.filterListings(sandbox.YRB.LISTINGS, {category: 'packs'});
console.log(packs.length, packs[0].id, packs[0].price, packs[0].condition);
"
grep -c 'value="packs"' shop.html
```
Expected:
```
pack photo OK
8
1 ttc-full-pack-16s 1000 tested
1
```

- [ ] **Step 4: Commit**

```bash
git add js/listings.js shop.html
git commit -m "Add full 16-module TTC pack listing and Full Packs filter"
```

---

### Task 3: Header tagline on Home, Shop, and Contact pages

**Files:**
- Modify: `css/style.css` (append `.brand__text`, `.brand__tagline`)
- Modify: `index.html:17-20`, `shop.html:17-20`, `contact.html:17-20` (the `.brand` block — identical in all three)

**Interfaces:**
- Consumes: nothing new
- Produces: CSS classes `.brand__text`, `.brand__tagline` for later use (About page in Task 5 reuses the same pattern)

- [ ] **Step 1: Append tagline styles to `css/style.css`**

Find:
```css
.brand__name { font-family: var(--font-heading); font-weight: 600; font-size: 1.1rem; letter-spacing: 0.02em; text-transform: uppercase; }
```

Replace with:
```css
.brand__text { display: flex; flex-direction: column; line-height: 1.15; }
.brand__name { font-family: var(--font-heading); font-weight: 600; font-size: 1.1rem; letter-spacing: 0.02em; text-transform: uppercase; }
.brand__tagline { font-family: var(--font-body); font-size: 0.65rem; font-weight: 400; color: var(--color-text-muted); text-transform: none; letter-spacing: 0; }
```

- [ ] **Step 2: Update the `.brand` markup in `index.html`, `shop.html`, and `contact.html`**

In all three files, find this exact block:
```html
      <a class="brand" href="index.html">
        <img class="brand__mark" src="images/placeholders/brand-mark.svg" alt="" width="28" height="28">
        <span class="brand__name">York Region Battery</span>
      </a>
```

Replace with:
```html
      <a class="brand" href="index.html">
        <img class="brand__mark" src="images/placeholders/brand-mark.svg" alt="" width="28" height="28">
        <span class="brand__text">
          <span class="brand__name">York Region Battery</span>
          <span class="brand__tagline">Salvaged Power. Built to Last.</span>
        </span>
      </a>
```

Apply this identically in all three files. (`about.html` is intentionally NOT touched here — it gets this same pattern baked into its full rewrite in Task 5.)

- [ ] **Step 3: Verify**

Run: `grep -c "brand__tagline" index.html shop.html contact.html css/style.css`
Expected: `1` for each of the 4 files (one tagline span per HTML page, one CSS rule definition — `grep -c` counts matching lines per file when given multiple files).

- [ ] **Step 4: Commit**

```bash
git add css/style.css index.html shop.html contact.html
git commit -m "Add brand tagline to header on Home, Shop, and Contact pages"
```

---

### Task 4: Hero tagline, inspection-stamp mark, and footer/section texture

**Files:**
- Create: `images/placeholders/inspection-stamp.svg`
- Modify: `css/style.css` (hero tagline style, footer texture, section-accent/stamp styles)
- Modify: `index.html` (insert hero tagline line)

**Interfaces:**
- Consumes: nothing new
- Produces: `images/placeholders/inspection-stamp.svg` file path (used by About page in Task 5); CSS classes `.hero__tagline`, `.section-accent`, `.stamp-mark`

- [ ] **Step 1: Create `images/placeholders/inspection-stamp.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="York Region Battery inspection stamp: salvaged and graded">
  <defs>
    <path id="stampTopArc" d="M 30 100 A 70 70 0 0 1 170 100" fill="none"/>
    <path id="stampBottomArc" d="M 170 110 A 70 70 0 0 1 30 110" fill="none"/>
  </defs>
  <circle cx="100" cy="100" r="92" fill="none" stroke="#0a0806" stroke-width="4"/>
  <circle cx="100" cy="100" r="80" fill="none" stroke="#f2871b" stroke-width="2"/>
  <text font-family="sans-serif" font-size="13" font-weight="700" letter-spacing="2" fill="#f2ece1">
    <textPath href="#stampTopArc" startOffset="50%" text-anchor="middle">YORK REGION BATTERY</textPath>
  </text>
  <text font-family="sans-serif" font-size="12" font-weight="700" letter-spacing="2" fill="#f2ece1">
    <textPath href="#stampBottomArc" startOffset="50%" text-anchor="middle">SALVAGED · GRADED</textPath>
  </text>
  <rect x="78" y="88" width="30" height="18" rx="2" fill="#f2871b"/>
  <rect x="108" y="93" width="4" height="8" fill="#f2871b"/>
  <path d="M96 90 L88 100 L93 100 L90 108 L100 96 L95 96 Z" fill="#0a0806"/>
</svg>
```

- [ ] **Step 2: Append hero tagline, footer texture, and section-accent styles to `css/style.css`**

Find:
```css
.hero h1 { font-size: 2.75rem; max-width: 42ch; margin-top: var(--space-xs); }
```

Replace with:
```css
.hero h1 { font-size: 2.75rem; max-width: 42ch; margin-top: var(--space-xs); }
.hero__tagline { font-family: var(--font-heading); font-size: 1.1rem; font-weight: 600; color: var(--color-accent); text-transform: uppercase; letter-spacing: 0.02em; margin: 0 0 var(--space-sm); }
```

Find:
```css
.site-footer { border-top: 1px solid var(--color-border); background-color: var(--color-surface); margin-top: var(--space-xl); padding: var(--space-lg) 0 var(--space-md); }
```

Replace with:
```css
.site-footer { position: relative; border-top: 1px solid var(--color-border); background-color: var(--color-surface); margin-top: var(--space-xl); padding: var(--space-lg) 0 var(--space-md); }
.site-footer::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 6px; background-image: repeating-radial-gradient(circle at 0 0, rgba(242, 135, 27, 0.3) 0, rgba(242, 135, 27, 0.3) 1px, transparent 1px, transparent 6px); background-size: 6px 6px; }
```

Find:
```css
/* ---------- Contact Actions ---------- */
.contact-actions { display: flex; gap: var(--space-sm); margin: var(--space-md) 0; flex-wrap: wrap; }
```

Replace with:
```css
/* ---------- Contact Actions ---------- */
.contact-actions { display: flex; gap: var(--space-sm); margin: var(--space-md) 0; flex-wrap: wrap; }

/* ---------- Section Accent (stamp callout) ---------- */
.section-accent { display: flex; gap: var(--space-md); align-items: flex-start; background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: var(--space-md); clip-path: polygon(0 14px, 100% 0, 100% 100%, 0 100%); margin: var(--space-md) 0; }
.section-accent > div { flex: 1; }
.stamp-mark { flex-shrink: 0; width: 96px; height: 96px; }
```

Find:
```css
@media (max-width: 768px) {
  .site-header__inner { flex-direction: column; align-items: flex-start; gap: var(--space-xs); }
  .site-nav { gap: var(--space-sm); flex-wrap: wrap; }
}
```

Replace with:
```css
@media (max-width: 768px) {
  .site-header__inner { flex-direction: column; align-items: flex-start; gap: var(--space-xs); }
  .site-nav { gap: var(--space-sm); flex-wrap: wrap; }
  .section-accent { flex-direction: column; }
}
```

- [ ] **Step 3: Insert the hero tagline in `index.html`**

Find:
```html
      <p class="eyebrow">Salvaged &middot; Graded &middot; Solar-Ready</p>
      <h1>Reclaimed EV &amp; Transit Battery Modules. Tested Where Marked. Ready for Your Solar Storage Build.</h1>
```

Replace with:
```html
      <p class="eyebrow">Salvaged &middot; Graded &middot; Solar-Ready</p>
      <p class="hero__tagline">Salvaged Power. Built to Last.</p>
      <h1>Reclaimed EV &amp; Transit Battery Modules. Tested Where Marked. Ready for Your Solar Storage Build.</h1>
```

- [ ] **Step 4: Verify**

Run:
```bash
python3 -c "import xml.dom.minidom as m; m.parse('images/placeholders/inspection-stamp.svg')" && echo "stamp SVG OK"
grep -c "hero__tagline" index.html css/style.css
grep -c "section-accent\|stamp-mark" css/style.css
```
Expected:
```
stamp SVG OK
1
1
4
```
(Last line: 4 lines contain `section-accent` or `stamp-mark` — the `.section-accent` rule, the `.section-accent > div` rule, the `.stamp-mark` rule, and the `.section-accent` override inside the mobile media query.)

- [ ] **Step 5: Commit**

```bash
git add images/placeholders/inspection-stamp.svg css/style.css index.html
git commit -m "Add hero tagline, inspection-stamp mark, and footer/section texture"
```

---

### Task 5: About page — new A123/TTC content, expanded sourcing story, and stamp placement

**Files:**
- Modify: `about.html` (full replacement)

**Interfaces:**
- Consumes: `.brand__text`/`.brand__tagline` (Task 3), `.section-accent`/`.stamp-mark` (Task 4), `images/placeholders/inspection-stamp.svg` (Task 4)
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
        <span class="brand__text">
          <span class="brand__name">York Region Battery</span>
          <span class="brand__tagline">Salvaged Power. Built to Last.</span>
        </span>
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

      <h2>Why A123 Cells?</h2>
      <p>A123 Systems pioneered "Nanophosphate" lithium iron phosphate (LiFePO4) cells — a chemistry built for thermal stability and long cycle life rather than squeezing in maximum energy density. That trade-off is exactly why these cells show up in demanding commercial and industrial applications (transit buses, grid storage, power tools) instead of just consumer electronics, and why they're a long-standing favorite in the DIY solar and off-grid community. Lithium Werks later acquired A123's cell technology and continued making the same ANR26650M1B cell under their own name — you'll see both brandings on our modules depending on manufacture date, but it's the same cell.</p>

      <h2>Why These Sources?</h2>
      <p>Transit bus and EV battery packs get retired for reasons that have nothing to do with individual cell health — route changes, vehicle write-offs, fleet and model upgrades. That means a lot of the modules coming out of these packs still have plenty of usable life left, which makes them a strong source of cells for secondary, stationary use like home solar storage, even though they're no longer suitable for the demanding duty cycle of a vehicle.</p>
      <p>That's especially true for our TTC-sourced packs. Toronto's hybrid bus fleet used BAE Systems HybriDrive propulsion — the same system these A123 packs came from — and that hybrid drivetrain had well-documented reliability problems that led many buses to be retired or converted back to diesel well before the battery packs wore out. We can't put an exact cycle count on a module we haven't tested, but it's a big part of why the modules we do test hold up so well: the ones we've measured typically come in at 18–19Ah against a 20Ah original rating.</p>

      <div class="section-accent">
        <img class="stamp-mark" src="images/placeholders/inspection-stamp.svg" alt="" width="96" height="96">
        <div>
          <h2>How We Test &amp; Grade</h2>
          <p>Every module goes through the same process: visual inspection for physical damage, a full voltage check, a controlled capacity discharge test, and a balance check across its series groups. Modules that pass are listed as <strong>Tested &amp; Graded</strong>. Modules we haven't run through the full process yet are listed as <strong>As-Is Salvage</strong> — visually inspected only, priced lower to reflect the added risk and work that falls on the buyer.</p>
        </div>
      </div>

      <h2>Safety Notes</h2>
      <p>LiFePO4 is one of the most thermally stable lithium chemistries available, which is part of why it's a good fit for DIY storage projects. That said, treat any used battery module with care: don't short the terminals, store modules in a cool, dry place, use a BMS appropriate for your series/parallel configuration, and don't mix Tested &amp; Graded and As-Is modules in the same series string without testing the As-Is modules first.</p>
      <p>Not all of our modules are the same chemistry, and that matters for how you handle and charge them. Our TTC A123 modules are LiFePO4. Our Nissan Leaf and Chevy Volt modules are NMC/LMO pouch cells — energy-dense and well-proven in EVs, but less thermally tolerant and less forgiving of overcharge than LiFePO4. Don't charge them with LiFePO4 voltage settings, don't mix chemistries in the same series string, and match your BMS/charger to the specific chemistry of what you're building with.</p>
      <p>The full assembled pack is a different animal from a single module — it's a ~640V string. If you're buying the complete pack, treat it like the high-voltage equipment it is: insulated tools only, no work on a pack in an unknown state without proper PPE, and if you're not already comfortable working around automotive/industrial high voltage, have someone who is handle the teardown or setup.</p>

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

- [ ] **Step 2: Verify**

Run: `grep -c "<h2>" about.html && grep -c "Why A123 Cells\|section-accent\|brand__tagline\|18–19Ah" about.html`
Expected: first command outputs `7` (one new section added: "Why A123 Cells?"); second command outputs a number greater than 0.

- [ ] **Step 3: Commit**

```bash
git add about.html
git commit -m "Add A123/TTC provenance content and inspection-stamp mark to About page"
```

---

### Task 6: Final visual + functional QA pass

**Files:** none created — verification only, using the existing `.claude/launch.json` preview server.

**Interfaces:**
- Consumes: all files from Tasks 1-5

- [ ] **Step 1: Start the preview server and check the header/hero on every page**

Use `preview_start` with name `york-region-battery-static`, then check `/`, `/shop.html`, `/about.html`, `/contact.html`. Confirm: the tagline "Salvaged Power. Built to Last." appears under the wordmark in the header on all 4 pages; the hero on `/` shows the tagline line between the eyebrow and the big headline; neither looks visually broken or overlapping.

- [ ] **Step 2: Verify the real photos render correctly**

On `/shop.html`, confirm the catalog now has 8 cards on initial load. Check that the two A123 module cards and the loose-cell card show real photos (not SVG diagrams) — use `preview_eval` to read each card's `<img src>` and confirm they point to `images/products/...`. Confirm the full-pack card is present with price `$1,000.00` (or similar `Intl.NumberFormat` output) and the "Tested & Graded" badge.

- [ ] **Step 3: Verify the new Full Packs filter**

Select Category = "Full Packs" and confirm exactly 1 card renders (`ttc-full-pack-16s`). Reset and confirm all 8 return.

- [ ] **Step 4: Verify the About page renders correctly**

Load `/about.html`, confirm 7 `<h2>` headings, confirm the inspection-stamp SVG renders next to "How We Test & Grade" without broken layout, confirm no text overlaps the stamp image at both desktop and mobile widths (`preview_resize` with `preset: "mobile"`).

- [ ] **Step 5: Check console/network for errors**

Use `preview_console_logs` with `level: "error"` and `preview_network` with `filter: "failed"` after loading all 4 pages (this will also catch any 404 on the new photo/SVG files if a path was typed wrong). Expected: both empty.

- [ ] **Step 6: Fix any issues found in Steps 1-5, then commit**

If anything is visually broken (stamp text illegible at small size, photo aspect ratio looking cropped oddly inside the fixed-height card image container, mobile overlap on the section-accent flex layout before it collapses to column), fix it directly in the relevant file and re-verify.

```bash
git add -A
git commit -m "Final QA fixes for real photos, full pack listing, and brand flair" --allow-empty
```

(Use `--allow-empty` only if Steps 1-5 found nothing to fix; otherwise commit the real fix with a message describing what was fixed.)

---

## Deployment

No change to the existing deployment approach — same static files, same Cloudflare Pages target.
