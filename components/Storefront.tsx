"use client";

import {
  Grid2X2,
  List,
  Minus,
  Plus,
  ShoppingCart,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { CSSProperties, FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import type { BrandConfig, Product, Series, StockStatus } from "@/data/types";
import { Diagram } from "./Diagrams";

type StorefrontProps = {
  brand: BrandConfig;
  products: Product[];
};

type ViewMode = "grid" | "list";
type UseFilter = "All" | "Street" | "Drift" | "Track" | "Accessories";
type AvailabilityFilter = "All" | StockStatus;
type SortMode = "featured" | "price-asc" | "price-desc";
type CartLine = {
  product: Product;
  quantity: number;
};
type NotifyFormState = {
  open: boolean;
  email: string;
  error?: string;
  success?: string;
};
type Toast = {
  id: number;
  message: string;
};

const useFilters: UseFilter[] = ["All", "Street", "Drift", "Track", "Accessories"];
const availabilityFilters: AvailabilityFilter[] = [
  "All",
  "In Stock",
  "Built to Order",
  "Out of Stock",
];

const notifyStorageKey = (sku: string) => `preload-storefront-notify:${sku}`;

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

const headlineFromTagline = (tagline: string) => {
  const lower = tagline.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

export default function Storefront({ brand, products }: StorefrontProps) {
  const [chassis, setChassis] = useState("All");
  const [useFilter, setUseFilter] = useState<UseFilter>("All");
  const [availability, setAvailability] = useState<AvailabilityFilter>("All");
  const [sortMode, setSortMode] = useState<SortMode>("featured");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartLines, setCartLines] = useState<CartLine[]>([]);
  const [counterTick, setCounterTick] = useState(false);
  const [notifyForms, setNotifyForms] = useState<Record<string, NotifyFormState>>({});
  const [notifiedSkus, setNotifiedSkus] = useState<Record<string, true>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const accentStyle = { "--accent": brand.accentColor } as CSSProperties;

  const chassisOptions = useMemo(
    () => ["All", ...Array.from(new Set(products.map((product) => product.fitment)))],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const next = products.filter((product) => {
      const matchesChassis = chassis === "All" || product.fitment === chassis;
      const matchesUse =
        useFilter === "All" || product.series.startsWith(useFilter);
      const matchesAvailability =
        availability === "All" || product.stockStatus === availability;

      return matchesChassis && matchesUse && matchesAvailability;
    });

    if (sortMode === "price-asc") {
      return [...next].sort((a, b) => a.price - b.price);
    }

    if (sortMode === "price-desc") {
      return [...next].sort((a, b) => b.price - a.price);
    }

    return next;
  }, [availability, chassis, products, sortMode, useFilter]);

  const cartCount = cartLines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cartLines.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  );

  useEffect(() => {
    const next: Record<string, true> = {};
    products.forEach((product) => {
      if (window.localStorage.getItem(notifyStorageKey(product.sku))) {
        next[product.sku] = true;
      }
    });
    setNotifiedSkus(next);
  }, [products]);

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    setModalQuantity(1);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProduct(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProduct]);

  useEffect(() => {
    if (!counterTick) {
      return;
    }

    const timeout = window.setTimeout(() => setCounterTick(false), 240);
    return () => window.clearTimeout(timeout);
  }, [counterTick]);

  useEffect(() => {
    if (!selectedProduct && !cartOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, selectedProduct]);

  const pushToast = (message: string) => {
    const id = Date.now();
    setToasts((current) => [...current, { id, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  };

  const addToCart = (product: Product, quantity = 1) => {
    if (product.stockStatus === "Out of Stock") {
      return;
    }

    setCartLines((current) => {
      const existing = current.find((line) => line.product.sku === product.sku);
      if (existing) {
        return current.map((line) =>
          line.product.sku === product.sku
            ? { ...line, quantity: line.quantity + quantity }
            : line,
        );
      }

      return [...current, { product, quantity }];
    });

    setCounterTick(true);
    pushToast(`Added ${product.sku} to cart.`);
  };

  const updateLineQuantity = (sku: string, quantity: number) => {
    setCartLines((current) =>
      current
        .map((line) =>
          line.product.sku === sku
            ? { ...line, quantity: Math.max(0, quantity) }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  };

  const setNotifyState = (sku: string, next: Partial<NotifyFormState>) => {
    setNotifyForms((current) => ({
      ...current,
      [sku]: { ...(current[sku] ?? { open: false, email: "" }), ...next },
    }));
  };

  const waitlistCount = (product: Product) =>
    (product.waitlistSeed ?? 0) + (notifiedSkus[product.sku] ? 1 : 0);

  const submitNotify = (event: FormEvent<HTMLFormElement>, product: Product) => {
    event.preventDefault();
    const formState = notifyForms[product.sku];
    const email = formState?.email.trim() ?? "";

    if (!isValidEmail(email)) {
      setNotifyState(product.sku, {
        open: true,
        error: "Enter a valid email.",
        success: undefined,
      });
      return;
    }

    const timestamp = new Date().toISOString();
    const submission = { sku: product.sku, email, timestamp };
    window.localStorage.setItem(
      notifyStorageKey(product.sku),
      JSON.stringify(submission),
    );
    console.log(submission);

    setNotifiedSkus((current) => ({ ...current, [product.sku]: true }));
    setNotifyState(product.sku, {
      open: false,
      email: "",
      error: undefined,
      success: `On the list. We email when ${product.sku} is back.`,
    });
    pushToast(`Waitlist saved for ${product.sku}.`);
  };

  const renderNotifyBlock = (product: Product, compact = false) => {
    const formState = notifyForms[product.sku] ?? {
      open: false,
      email: "",
    };
    const isNotified = Boolean(notifiedSkus[product.sku]);

    if (isNotified) {
      return (
        <div className={compact ? "space-y-2" : "space-y-3"}>
          <button
            type="button"
            disabled
            className="w-full border border-rule bg-rule px-4 py-3 text-sm font-semibold text-muted"
          >
            You're on the list
          </button>
          {formState.success ? (
            <p className="font-mono text-xs leading-5 text-muted">{formState.success}</p>
          ) : null}
        </div>
      );
    }

    return (
      <div className={compact ? "space-y-2" : "space-y-3"}>
        <button
          type="button"
          data-testid={`notify-open-${product.sku}`}
          onClick={() => setNotifyState(product.sku, { open: true })}
          className="w-full border border-[var(--accent)] bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-paper transition-colors hover:bg-ink"
        >
          Notify me
        </button>
        {formState.open ? (
          <form
            className={compact ? "grid gap-2" : "grid gap-3 sm:grid-cols-[1fr_auto]"}
            onSubmit={(event) => submitNotify(event, product)}
          >
            <label className="sr-only" htmlFor={`notify-${product.sku}`}>
              Email for {product.sku}
            </label>
            <input
              id={`notify-${product.sku}`}
              data-testid={`notify-email-${product.sku}`}
              type="text"
              inputMode="email"
              autoComplete="email"
              value={formState.email}
              placeholder="email@example.com"
              onChange={(event) =>
                setNotifyState(product.sku, {
                  email: event.target.value,
                  error: undefined,
                })
              }
              className="min-h-11 border border-rule bg-paper px-3 font-mono text-sm text-ink placeholder:text-muted"
            />
            <button
              type="submit"
              data-testid={`notify-submit-${product.sku}`}
              className="min-h-11 border border-ink px-4 font-mono text-xs uppercase tracking-[0.12em] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Submit
            </button>
            {formState.error ? (
              <p className="font-mono text-xs text-muted sm:col-span-2">
                {formState.error}
              </p>
            ) : null}
          </form>
        ) : null}
      </div>
    );
  };

  return (
    <main style={accentStyle} className="min-h-screen bg-paper text-ink">
      <UtilityBar brand={brand} />
      <Header
        brand={brand}
        cartCount={cartCount}
        counterTick={counterTick}
        onCartOpen={() => setCartOpen(true)}
      />

      <section className="border-b border-rule">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
              {brand.categoryLabel}
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-bold uppercase leading-[0.95] tracking-normal sm:text-7xl lg:text-8xl">
              {headlineFromTagline(brand.tagline)}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
              {brand.subline}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#catalog"
                className="border border-[var(--accent)] bg-[var(--accent)] px-5 py-3 text-center text-sm font-semibold text-paper transition-colors hover:bg-ink"
              >
                Browse catalog
              </a>
              <a
                href="#fitment"
                className="nav-link inline-flex items-center justify-center px-1 py-3 text-sm font-semibold text-ink"
              >
                How fitment works
              </a>
            </div>
          </div>
          <div className="border border-rule bg-paper px-3 py-5 text-ink sm:px-6">
            <Diagram diagramKey={brand.diagramKey} />
          </div>
        </div>
        <div className="border-y border-rule">
          <div className="mx-auto max-w-7xl px-4 py-4 font-mono text-xs uppercase tracking-[0.18em] text-muted sm:px-6 lg:px-8">
            {brand.specTicker}
          </div>
        </div>
      </section>

      <section aria-label="Trust points" className="border-b border-rule">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {brand.trustPoints.map((point) => (
            <div
              key={point}
              className="border-x border-rule px-4 py-5 font-mono text-xs uppercase tracking-[0.18em]"
            >
              {point}
            </div>
          ))}
        </div>
      </section>

      <section id="catalog" className="border-b border-rule">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <SectionHeading number="01" label="Catalog" detail={brand.categoryLabel} />
          <div className="mt-8 border-y border-rule py-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(150px,1fr)_minmax(300px,auto)_minmax(150px,1fr)_minmax(150px,1fr)_auto] lg:items-end">
              <label className="grid gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                  Chassis
                </span>
                <select
                  data-testid="chassis-select"
                  value={chassis}
                  onChange={(event) => setChassis(event.target.value)}
                  className="h-12 border border-rule bg-paper px-3 font-mono text-sm text-ink"
                >
                  {chassisOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === "All" ? "All chassis" : option}
                    </option>
                  ))}
                </select>
              </label>

              <fieldset className="grid gap-2">
                <legend className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                  Use
                </legend>
                <div className="grid grid-cols-2 border border-rule sm:grid-cols-5">
                  {useFilters.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      data-testid={`use-${filter}`}
                      onClick={() => setUseFilter(filter)}
                      className={`min-h-12 border-rule px-3 font-mono text-xs uppercase tracking-[0.08em] transition-colors sm:border-r sm:last:border-r-0 ${
                        useFilter === filter
                          ? "bg-[var(--accent)] text-paper"
                          : "bg-paper text-ink hover:text-[var(--accent)]"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="grid gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                  Availability
                </span>
                <select
                  data-testid="availability-select"
                  value={availability}
                  onChange={(event) =>
                    setAvailability(event.target.value as AvailabilityFilter)
                  }
                  className="h-12 border border-rule bg-paper px-3 font-mono text-sm text-ink"
                >
                  {availabilityFilters.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                  Price sort
                </span>
                <select
                  data-testid="sort-select"
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value as SortMode)}
                  className="h-12 border border-rule bg-paper px-3 font-mono text-sm text-ink"
                >
                  <option value="featured">Catalog order</option>
                  <option value="price-asc">Price low</option>
                  <option value="price-desc">Price high</option>
                </select>
              </label>

              <fieldset className="grid gap-2">
                <legend className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                  View
                </legend>
                <div className="grid h-12 grid-cols-2 border border-rule">
                  <button
                    type="button"
                    data-testid="view-grid"
                    aria-label="Grid view"
                    onClick={() => setViewMode("grid")}
                    className={`grid place-items-center transition-colors ${
                      viewMode === "grid"
                        ? "bg-[var(--accent)] text-paper"
                        : "text-ink hover:text-[var(--accent)]"
                    }`}
                  >
                    <Grid2X2 size={18} strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    data-testid="view-list"
                    aria-label="List view"
                    onClick={() => setViewMode("list")}
                    className={`grid place-items-center border-l border-rule transition-colors ${
                      viewMode === "list"
                        ? "bg-[var(--accent)] text-paper"
                        : "text-ink hover:text-[var(--accent)]"
                    }`}
                  >
                    <List size={19} strokeWidth={1.75} />
                  </button>
                </div>
              </fieldset>
            </div>
          </div>

          <div className="mt-7 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted">
            <SlidersHorizontal size={15} strokeWidth={1.75} />
            {filteredProducts.length} of {products.length} SKUs
          </div>

          {viewMode === "grid" ? (
            <ProductGrid
              products={filteredProducts}
              brand={brand}
              onSelect={setSelectedProduct}
              onAdd={addToCart}
              renderNotifyBlock={renderNotifyBlock}
              waitlistCount={waitlistCount}
            />
          ) : (
            <ProductTable
              products={filteredProducts}
              onSelect={setSelectedProduct}
              onAdd={addToCart}
              renderNotifyBlock={renderNotifyBlock}
              waitlistCount={waitlistCount}
            />
          )}
        </div>
      </section>

      <section id="fitment" className="border-b border-rule">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <SectionHeading number="02" label="Fitment" detail="Specified before dispatch" />
          <div className="mt-8 grid gap-px bg-rule md:grid-cols-3">
            {brand.fitmentSteps.map((step, index) => (
              <div key={step} className="bg-paper p-6">
                <p className="font-mono text-xs text-[var(--accent)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-8 font-display text-2xl uppercase leading-tight">
                  {step}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="support" className="border-b border-rule">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <SectionHeading number="03" label="Support" detail="Questions before checkout" />
          <div className="mt-8 border-y border-rule">
            {brand.faq.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={item.question} className="border-b border-rule last:border-b-0">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${index}`}
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 py-5 text-left"
                    >
                      <span className="font-mono text-xs text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-semibold">{item.question}</span>
                      <span className="font-mono text-xl text-[var(--accent)]">
                        {isOpen ? "-" : "+"}
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${index}`}
                    className="accordion-panel"
                    data-open={isOpen}
                  >
                    <div>
                      <p className="max-w-3xl pb-6 pl-10 leading-7 text-muted">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer brand={brand} onCartOpen={() => setCartOpen(true)} />

      {selectedProduct ? (
        <ProductModal
          product={selectedProduct}
          brand={brand}
          quantity={modalQuantity}
          onQuantityChange={setModalQuantity}
          onClose={() => setSelectedProduct(null)}
          onAdd={() => addToCart(selectedProduct, modalQuantity)}
          renderNotifyBlock={renderNotifyBlock}
          waitlistCount={waitlistCount}
        />
      ) : null}

      <CartDrawer
        open={cartOpen}
        lines={cartLines}
        subtotal={subtotal}
        onClose={() => setCartOpen(false)}
        onQuantityChange={updateLineQuantity}
      />

      <div
        aria-live="polite"
        className="fixed bottom-4 left-4 right-4 z-[70] grid gap-2 sm:left-auto sm:w-96"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="border border-ink bg-paper px-4 py-3 font-mono text-xs uppercase tracking-[0.08em]"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </main>
  );
}

function UtilityBar({ brand }: { brand: BrandConfig }) {
  return (
    <div className="border-b border-rule">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <span>{brand.utilityBarText.left}</span>
        <span>{brand.utilityBarText.right}</span>
      </div>
    </div>
  );
}

function Header({
  brand,
  cartCount,
  counterTick,
  onCartOpen,
}: {
  brand: BrandConfig;
  cartCount: number;
  counterTick: boolean;
  onCartOpen: () => void;
}) {
  return (
    <header className="border-b border-rule bg-paper">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="border border-ink px-4 py-3 transition-colors hover:border-[var(--accent)]"
          aria-label={`${brand.name} home`}
        >
          <span className="block font-display text-2xl font-bold uppercase leading-none tracking-normal">
            {brand.name}
          </span>
          <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            {brand.lockupLine}
          </span>
        </a>
        <nav className="order-3 flex w-full items-center gap-6 font-semibold sm:order-2 sm:w-auto">
          <a className="nav-link" href="#catalog">
            Catalog
          </a>
          <a className="nav-link" href="#fitment">
            Fitment
          </a>
          <a className="nav-link" href="#support">
            Support
          </a>
        </nav>
        <button
          type="button"
          data-testid="open-cart"
          onClick={onCartOpen}
          className="order-2 inline-flex h-12 items-center gap-3 border border-rule px-4 transition-colors hover:border-[var(--accent)] sm:order-3"
          aria-label="Open cart"
        >
          <ShoppingCart size={19} strokeWidth={1.75} />
          <span
            className={`font-mono text-xs ${counterTick ? "counter-tick" : ""}`}
            aria-label={`${cartCount} items in cart`}
          >
            {String(cartCount).padStart(2, "0")}
          </span>
        </button>
      </div>
    </header>
  );
}

function SectionHeading({
  number,
  label,
  detail,
}: {
  number: string;
  label: string;
  detail: string;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-rule pb-5 sm:flex-row sm:items-end sm:justify-between">
      <h2 className="font-display text-4xl uppercase tracking-normal sm:text-5xl">
        <span className="font-mono text-sm text-[var(--accent)]">{number}</span>
        <span className="mx-3 font-mono text-sm text-muted">/</span>
        {label}
      </h2>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
        {detail}
      </p>
    </div>
  );
}

function ProductGrid({
  products,
  brand,
  onSelect,
  onAdd,
  renderNotifyBlock,
  waitlistCount,
}: {
  products: Product[];
  brand: BrandConfig;
  onSelect: (product: Product) => void;
  onAdd: (product: Product) => void;
  renderNotifyBlock: (product: Product, compact?: boolean) => ReactNode;
  waitlistCount: (product: Product) => number;
}) {
  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <article
          key={product.sku}
          data-testid={`product-card-${product.sku}`}
          className="interactive-card flex min-h-[560px] flex-col border border-rule bg-paper"
        >
          <button
            type="button"
            data-testid={`product-diagram-${product.sku}`}
            onClick={() => onSelect(product)}
            className="border-b border-rule p-4 text-left transition-colors hover:text-[var(--accent)]"
          >
            <Diagram diagramKey={brand.diagramKey} compact />
          </button>
          <div className="flex flex-1 flex-col p-4">
            <div className="mb-4 flex items-start justify-between gap-3">
              <span className="font-mono text-xs text-muted">{product.sku}</span>
              <AvailabilityTag product={product} />
            </div>
            <button
              type="button"
              data-testid={`product-open-${product.sku}`}
              onClick={() => onSelect(product)}
              className="text-left text-lg font-semibold leading-6 underline decoration-transparent underline-offset-4 transition-colors hover:text-[var(--accent)] hover:decoration-[var(--accent)]"
            >
              {product.name}
            </button>
            <p className="mt-3 text-sm leading-6 text-muted">{product.fitment}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {product.specChips.slice(0, 3).map((chip) => (
                <span
                  key={chip}
                  className="border border-rule px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-muted"
                >
                  {chip}
                </span>
              ))}
            </div>
            <div className="mt-auto pt-6">
              <div className="mb-4 flex items-end justify-between gap-3">
                <span className="font-mono text-lg">{formatPrice(product.price)}</span>
                {product.leadTime ? (
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                    {product.leadTime}
                  </span>
                ) : null}
              </div>
              {product.stockStatus === "Out of Stock" ? (
                <div className="space-y-3">
                  {renderNotifyBlock(product, true)}
                  <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                    {waitlistCount(product)} on the waitlist
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  data-testid={`add-${product.sku}`}
                  onClick={() => onAdd(product)}
                  className="w-full border border-ink px-4 py-3 text-sm font-semibold transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  Add
                </button>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function ProductTable({
  products,
  onSelect,
  onAdd,
  renderNotifyBlock,
  waitlistCount,
}: {
  products: Product[];
  onSelect: (product: Product) => void;
  onAdd: (product: Product) => void;
  renderNotifyBlock: (product: Product, compact?: boolean) => ReactNode;
  waitlistCount: (product: Product) => number;
}) {
  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="mt-8 overflow-x-auto border border-rule">
      <table className="min-w-[960px] w-full border-collapse bg-paper text-left">
        <thead>
          <tr className="border-b border-rule font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            <th className="px-4 py-4 font-medium">SKU</th>
            <th className="px-4 py-4 font-medium">Product</th>
            <th className="px-4 py-4 font-medium">Fitment</th>
            <th className="px-4 py-4 font-medium">Key spec</th>
            <th className="px-4 py-4 font-medium">Price</th>
            <th className="px-4 py-4 font-medium">Availability</th>
            <th className="px-4 py-4 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.sku} className="border-b border-rule last:border-b-0">
              <td className="px-4 py-4 font-mono text-xs text-muted">{product.sku}</td>
              <td className="px-4 py-4">
                <button
                  type="button"
                  data-testid={`table-open-${product.sku}`}
                  onClick={() => onSelect(product)}
                  className="text-left font-semibold underline decoration-transparent underline-offset-4 transition-colors hover:text-[var(--accent)] hover:decoration-[var(--accent)]"
                >
                  {product.name}
                </button>
              </td>
              <td className="px-4 py-4 text-sm text-muted">{product.fitment}</td>
              <td className="px-4 py-4 font-mono text-xs text-muted">
                {product.specChips.join(" / ")}
              </td>
              <td className="px-4 py-4 font-mono text-sm">
                {formatPrice(product.price)}
              </td>
              <td className="px-4 py-4">
                <div className="space-y-2">
                  <AvailabilityTag product={product} />
                  {product.stockStatus === "Out of Stock" ? (
                    <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                      {waitlistCount(product)} on the waitlist
                    </p>
                  ) : product.leadTime ? (
                    <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                      {product.leadTime}
                    </p>
                  ) : null}
                </div>
              </td>
              <td className="w-64 px-4 py-4">
                {product.stockStatus === "Out of Stock" ? (
                  renderNotifyBlock(product, true)
                ) : (
                  <button
                    type="button"
                    data-testid={`table-add-${product.sku}`}
                    onClick={() => onAdd(product)}
                    className="w-full border border-ink px-4 py-3 text-sm font-semibold transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    Add
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AvailabilityTag({ product }: { product: Product }) {
  if (product.stockStatus === "In Stock") {
    return (
      <span className="inline-flex border border-[var(--accent)] bg-[var(--accent)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-paper">
        In Stock
      </span>
    );
  }

  if (product.stockStatus === "Built to Order") {
    return (
      <span className="inline-flex border border-ink px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em]">
        Built to Order
      </span>
    );
  }

  return (
    <span className="inline-flex border border-rule px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
      Out of Stock
    </span>
  );
}

function ProductModal({
  product,
  brand,
  quantity,
  onQuantityChange,
  onClose,
  onAdd,
  renderNotifyBlock,
  waitlistCount,
}: {
  product: Product;
  brand: BrandConfig;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onClose: () => void;
  onAdd: () => void;
  renderNotifyBlock: (product: Product, compact?: boolean) => ReactNode;
  waitlistCount: (product: Product) => number;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-paper/90 px-4 py-5 backdrop-blur-sm sm:px-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        data-testid="product-modal"
        className="mx-auto grid max-h-[calc(100vh-40px)] max-w-5xl overflow-y-auto border border-ink bg-paper lg:grid-cols-[0.9fr_1.1fr]"
      >
        <div className="border-b border-rule p-5 lg:border-b-0 lg:border-r">
          <Diagram diagramKey={brand.diagramKey} />
        </div>
        <div className="p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                {product.sku}
              </p>
              <h2
                id="product-modal-title"
                className="mt-3 font-display text-3xl uppercase leading-tight sm:text-4xl"
              >
                {product.name}
              </h2>
            </div>
            <button
              type="button"
              data-testid="modal-close"
              onClick={onClose}
              aria-label="Close modal"
              className="grid h-11 w-11 shrink-0 place-items-center border border-rule transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <X size={18} strokeWidth={1.75} />
            </button>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <AvailabilityTag product={product} />
            <span className="font-mono text-lg">{formatPrice(product.price)}</span>
            {product.leadTime ? (
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted">
                {product.leadTime}
              </span>
            ) : null}
          </div>
          <p className="mt-5 leading-7 text-muted">{product.fitment}</p>
          <div className="mt-6 overflow-hidden border border-rule">
            <table className="w-full border-collapse text-left">
              <tbody>
                {product.specTable.map((row) => (
                  <tr key={row.label} className="border-b border-rule last:border-b-0">
                    <th className="w-36 px-4 py-3 align-top font-mono text-[11px] uppercase tracking-[0.14em] text-muted sm:w-48">
                      {row.label}
                    </th>
                    <td className="px-4 py-3 text-sm leading-6">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-7 border-t border-rule pt-6">
            {product.stockStatus === "Out of Stock" ? (
              <div className="space-y-3">
                {renderNotifyBlock(product)}
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">
                  {waitlistCount(product)} on the waitlist
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
                <div className="grid h-12 grid-cols-[44px_56px_44px] border border-rule">
                  <button
                    type="button"
                    data-testid="modal-qty-decrease"
                    aria-label="Decrease quantity"
                    onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                    className="grid place-items-center border-r border-rule transition-colors hover:text-[var(--accent)]"
                  >
                    <Minus size={16} strokeWidth={1.75} />
                  </button>
                  <span className="grid place-items-center font-mono text-sm">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    data-testid="modal-qty-increase"
                    aria-label="Increase quantity"
                    onClick={() => onQuantityChange(quantity + 1)}
                    className="grid place-items-center border-l border-rule transition-colors hover:text-[var(--accent)]"
                  >
                    <Plus size={16} strokeWidth={1.75} />
                  </button>
                </div>
                <button
                  type="button"
                  data-testid="modal-add"
                  onClick={onAdd}
                  className="border border-[var(--accent)] bg-[var(--accent)] px-5 py-3 font-semibold text-paper transition-colors hover:bg-ink"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({
  open,
  lines,
  subtotal,
  onClose,
  onQuantityChange,
}: {
  open: boolean;
  lines: CartLine[];
  subtotal: number;
  onClose: () => void;
  onQuantityChange: (sku: string, quantity: number) => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close cart overlay"
        onClick={onClose}
        className={`absolute inset-0 bg-paper/90 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        data-testid="cart-drawer"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-ink bg-paper transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Cart"
      >
        <div className="flex items-center justify-between border-b border-rule p-5">
          <h2 className="font-display text-3xl uppercase">Cart</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="grid h-11 w-11 place-items-center border border-rule transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {lines.length === 0 ? (
            <p className="p-5 text-muted">No items yet.</p>
          ) : (
            <ul className="divide-y divide-rule">
              {lines.map((line) => (
                <li key={line.product.sku} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs text-muted">
                        {line.product.sku}
                      </p>
                      <h3 className="mt-2 font-semibold leading-6">
                        {line.product.name}
                      </h3>
                    </div>
                    <p className="font-mono text-sm">
                      {formatPrice(line.product.price * line.quantity)}
                    </p>
                  </div>
                  <div className="mt-4 grid w-36 grid-cols-[40px_1fr_40px] border border-rule">
                    <button
                      type="button"
                      aria-label={`Decrease ${line.product.sku}`}
                      onClick={() =>
                        onQuantityChange(line.product.sku, line.quantity - 1)
                      }
                      className="grid h-10 place-items-center border-r border-rule transition-colors hover:text-[var(--accent)]"
                    >
                      <Minus size={15} strokeWidth={1.75} />
                    </button>
                    <span className="grid place-items-center font-mono text-sm">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`Increase ${line.product.sku}`}
                      onClick={() =>
                        onQuantityChange(line.product.sku, line.quantity + 1)
                      }
                      className="grid h-10 place-items-center border-l border-rule transition-colors hover:text-[var(--accent)]"
                    >
                      <Plus size={15} strokeWidth={1.75} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-rule p-5">
          <div className="flex items-center justify-between font-mono text-sm uppercase tracking-[0.12em]">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <button
            type="button"
            disabled
            className="mt-5 w-full border border-rule bg-rule px-5 py-3 font-semibold text-muted"
          >
            Checkout (Demo)
          </button>
        </div>
      </aside>
    </div>
  );
}

function Footer({
  brand,
  onCartOpen,
}: {
  brand: BrandConfig;
  onCartOpen: () => void;
}) {
  const linkTargets: Record<string, string> = {
    Catalog: "#catalog",
    Fitment: "#fitment",
    Support: "#support",
  };

  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1fr_auto_auto] lg:px-8">
        <div>
          <p className="font-display text-5xl uppercase leading-none">{brand.name}</p>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-paper/70">
            {brand.lockupLine}
          </p>
        </div>
        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-paper/70">
            Useful Links
          </h2>
          <ul className="mt-4 grid gap-3">
            {brand.footer.usefulLinks.map((link) => (
              <li key={link}>
                {link === "Cart" ? (
                  <button
                    type="button"
                    onClick={onCartOpen}
                    className="underline decoration-transparent underline-offset-4 transition-colors hover:text-paper/70 hover:decoration-paper/70"
                  >
                    {link}
                  </button>
                ) : (
                  <a
                    href={linkTargets[link] ?? "#"}
                    className="underline decoration-transparent underline-offset-4 transition-colors hover:text-paper/70 hover:decoration-paper/70"
                  >
                    {link}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
        <address className="not-italic">
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-paper/70">
            Mesa AZ
          </h2>
          <p className="mt-4 max-w-56 leading-7 text-paper/80">{brand.footer.address}</p>
          <p className="mt-3 font-mono text-sm text-paper/80">{brand.footer.phone}</p>
          <p className="mt-1 font-mono text-sm text-paper/80">{brand.footer.email}</p>
        </address>
        <p className="border-t border-paper/20 pt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/60 md:col-span-3">
          {brand.footer.smallPrint}
        </p>
      </div>
    </footer>
  );
}

function EmptyState() {
  return (
    <div className="mt-8 border border-rule px-5 py-12 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
        No SKUs match these filters.
      </p>
    </div>
  );
}
