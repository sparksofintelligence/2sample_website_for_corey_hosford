import type { CatalogConfig, Product, SpecRow, StockStatus } from "./types";

const brakeSpecTable = (
  rotorSize: string,
  padCompound: string,
  hardware: string,
): SpecRow[] => [
  { label: "Rotor size", value: rotorSize },
  { label: "Pad compound", value: padCompound },
  { label: "Heat range", value: "Street to repeated high-load stops" },
  { label: "Construction", value: "High-carbon rotor rings, billet brackets, plated hardware" },
  { label: "Included hardware", value: hardware },
];

const product = (
  sku: string,
  name: string,
  series: Product["series"],
  fitment: string,
  specChips: string[],
  price: number,
  stockStatus: StockStatus,
  specTable: SpecRow[],
  extra: Pick<Product, "leadTime" | "waitlistSeed"> = {},
): Product => ({
  sku,
  name,
  series,
  fitment,
  specChips,
  price,
  stockStatus,
  specTable,
  ...extra,
});

export const catalogConfig: CatalogConfig = {
  lockupLine: "Brake Supply",
  tagline: "BRAKE SYSTEMS, SPECIFIED.",
  subline:
    "An independent rotor, pad, and brake hardware specialist. Matched to your chassis, documented like it matters.",
  categoryLabel: "Brake systems",
  trustPoints: [
    "48H DISPATCH",
    "FITMENT CHECKED",
    "THERMAL NOTES",
    "CHASSIS-SPECIFIC",
  ],
  fitmentSteps: [
    "Send chassis and wheel size",
    "We match rotor diameter and pad range",
    "Ships in 48h or built to order",
  ],
  faq: [
    {
      question: "Can you confirm wheel clearance before ordering?",
      answer:
        "Yes. Send chassis, wheel size, offset, and intended use. We check the catalog match before you buy.",
    },
    {
      question: "How do I choose pad compound?",
      answer:
        "Street compounds prioritize cold response. Drift and Track compounds add thermal headroom for repeated stops.",
    },
    {
      question: "How difficult is installation?",
      answer:
        "Most kits are designed for experienced home installers or professional shops. Bedding instructions are included.",
    },
    {
      question: "What is covered by warranty and service?",
      answer:
        "Rotor hats, brackets, and caliper hardware carry a limited defect warranty. Pads and rotor rings are service items.",
    },
    {
      question: "How do shipping and waitlist notices work?",
      answer:
        "In-stock brake items dispatch from Mesa in 48 hours. Built-to-order items show lead time. Waitlist notices are sent when a SKU returns.",
    },
  ],
  diagramKey: "brake",
  specTicker:
    "ROTOR DIAMETERS 280-355 MM · PAD RANGES STREET TO TRACK · HARDWARE CHECKED · BEDDING NOTES INCLUDED",
};

export const products: Product[] = [
  product(
    "PL-BR-S13-F",
    "Street front brake kit 240SX S13",
    "Street Series",
    "240SX S13",
    ["296 mm", "Street pad", "Front axle"],
    549,
    "In Stock",
    brakeSpecTable("296 mm front", "Low-dust street compound", "Front rotors, pads, lines, bracket hardware"),
  ),
  product(
    "PL-BR-S14-F",
    "Street front brake kit 240SX S14",
    "Street Series",
    "240SX S14",
    ["296 mm", "Street pad", "Front axle"],
    569,
    "In Stock",
    brakeSpecTable("296 mm front", "Low-dust street compound", "Front rotors, pads, lines, bracket hardware"),
  ),
  product(
    "PL-BR-Z33-F",
    "Street front brake kit 350Z Z33",
    "Street Series",
    "350Z Z33",
    ["324 mm", "Street pad", "Front axle"],
    689,
    "Out of Stock",
    brakeSpecTable("324 mm front", "Low-dust street compound", "Front rotors, pads, lines, bracket hardware"),
    { waitlistSeed: 11 },
  ),
  product(
    "PL-BR-Z34-F",
    "Street front brake kit 370Z Z34",
    "Street Series",
    "370Z Z34",
    ["332 mm", "Street pad", "Front axle"],
    729,
    "In Stock",
    brakeSpecTable("332 mm front", "Low-dust street compound", "Front rotors, pads, lines, bracket hardware"),
  ),
  product(
    "PL-BR-ZN8-F",
    "Street front brake kit GR86 BRZ 2022+",
    "Street Series",
    "GR86 BRZ 2022+",
    ["315 mm", "Street pad", "Front axle"],
    649,
    "In Stock",
    brakeSpecTable("315 mm front", "Low-dust street compound", "Front rotors, pads, lines, bracket hardware"),
  ),
  product(
    "PL-BR-MNA-F",
    "Street front brake kit Miata NA NB",
    "Street Series",
    "Miata NA NB",
    ["280 mm", "Street pad", "Front axle"],
    499,
    "In Stock",
    brakeSpecTable("280 mm front", "Low-dust street compound", "Front rotors, pads, lines, bracket hardware"),
  ),
  product(
    "PL-BR-DR-S13",
    "Drift rear handbrake rotor kit S13",
    "Drift Series",
    "240SX S13 rear",
    ["Dual caliper", "Rear axle", "Drift pad"],
    829,
    "In Stock",
    brakeSpecTable("300 mm rear", "Drift lock compound", "Rear rotors, adapter brackets, line kit, fasteners"),
  ),
  product(
    "PL-BR-DR-S14",
    "Drift rear handbrake rotor kit S14",
    "Drift Series",
    "240SX S14 rear",
    ["Dual caliper", "Rear axle", "Drift pad"],
    849,
    "Out of Stock",
    brakeSpecTable("300 mm rear", "Drift lock compound", "Rear rotors, adapter brackets, line kit, fasteners"),
    { waitlistSeed: 7 },
  ),
  product(
    "PL-BR-TR-SCH",
    "Track 2-piece front brake system S-chassis",
    "Track Series",
    "S13 S14",
    ["330 mm", "2-piece", "Track pad"],
    1450,
    "Built to Order",
    brakeSpecTable("330 mm front 2-piece", "Endurance track compound", "Rotor rings, hats, brackets, pads, setup sheet"),
    { leadTime: "3-5 weeks" },
  ),
  product(
    "PL-BR-TR-ZN8",
    "Track thermal front brake system GR86 BRZ",
    "Track Series",
    "GR86 BRZ",
    ["345 mm", "Duct ready", "Track pad"],
    1590,
    "In Stock",
    brakeSpecTable("345 mm front", "Endurance track compound", "Rotors, brackets, pads, duct plates, setup sheet"),
  ),
  product(
    "PL-BR-AC-LINE",
    "Stainless brake line kit universal",
    "Accessories",
    "Universal metric",
    ["Line set", "DOT hose", "Metric ends"],
    129,
    "Built to Order",
    brakeSpecTable("N/A", "N/A", "Four-line hose set, clips, crush washers, fitment notes"),
    { leadTime: "3-5 weeks" },
  ),
  product(
    "PL-BR-AC-BED",
    "Pad bedding and service pack",
    "Accessories",
    "PRELOAD brake kits",
    ["Service pack", "Bedding card", "Hardware"],
    79,
    "In Stock",
    brakeSpecTable("N/A", "N/A", "Bedding card, hardware pack, rotor marking paint"),
  ),
];
