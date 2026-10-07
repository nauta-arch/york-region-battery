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
      "Nominal Voltage": "40V",
      "Capacity": "18–19Ah measured (20Ah original rating)",
      "Source": "TTC transit bus pack (16S, ~640V nominal)"
    },
    description: "Pulled from a TTC transit bus battery pack, this 12S8P module has been capacity-tested and balance-checked across all 12 series groups. Ready to drop into a solar storage bank.",
    image: "images/products/a123-module-photo.jpg",
    imageAlt: "BAE Systems A123 12S8P module, 40V/225A rating label visible"
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
      "Nominal Voltage": "40V",
      "Capacity": "Not yet capacity-tested (20Ah original rating)",
      "Source": "TTC transit bus pack (16S, ~640V nominal)"
    },
    description: "Visually inspected and voltage-checked but not yet capacity-tested — priced accordingly. Great if you're comfortable testing/grading cells yourself.",
    image: "images/products/a123-module-photo.jpg",
    imageAlt: "BAE Systems A123 12S8P module, 40V/225A rating label visible"
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
      "Nominal Voltage": "3.3V nominal",
      "Capacity": "2.6Ah rated; individually tested cells typically measure a little under that",
      "Source": "TTC transit bus pack module teardown"
    },
    description: "Individually capacity-tested loose cells pulled down from modules. Good for topping up an existing bank or small parallel builds.",
    image: "images/products/a123-cell-photo.jpg",
    imageAlt: "A123/Lithium Werks ANR26650M1B cell with manufacturer spec label: 3.3V, 2.6Ah, 8.58Wh"
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
