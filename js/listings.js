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
