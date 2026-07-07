export type DiagramKey = "coilover" | "brake";

export type Series =
  | "Street Series"
  | "Drift Series"
  | "Track Series"
  | "Accessories";

export type StockStatus = "In Stock" | "Built to Order" | "Out of Stock";

export type SpecRow = {
  label: string;
  value: string;
};

export type Product = {
  sku: string;
  name: string;
  series: Series;
  fitment: string;
  specChips: string[];
  price: number;
  stockStatus: StockStatus;
  leadTime?: string;
  waitlistSeed?: number;
  specTable: SpecRow[];
};

export type BrandConfig = {
  name: string;
  lockupLine: string;
  tagline: string;
  subline: string;
  accentColor: string;
  categoryLabel: string;
  utilityBarText: {
    left: string;
    right: string;
  };
  trustPoints: string[];
  fitmentSteps: string[];
  faq: {
    question: string;
    answer: string;
  }[];
  footer: {
    usefulLinks: string[];
    address: string;
    phone: string;
    email: string;
    smallPrint: string;
  };
  diagramKey: DiagramKey;
  specTicker: string;
};

export type CatalogConfig = Partial<
  Pick<
    BrandConfig,
    | "lockupLine"
    | "tagline"
    | "subline"
    | "categoryLabel"
    | "trustPoints"
    | "fitmentSteps"
    | "faq"
    | "diagramKey"
    | "specTicker"
  >
>;
