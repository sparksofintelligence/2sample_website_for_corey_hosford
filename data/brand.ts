import type { BrandConfig } from "./types";

export const brandConfig: BrandConfig = {
  name: "PRELOAD",
  lockupLine: "Suspension Supply",
  tagline: "SUSPENSION, SPECIFIED.",
  subline:
    "An independent coilover and suspension specialist. Matched to your chassis, documented like it matters.",
  accentColor: "#1F3BFF",
  categoryLabel: "Coilover systems",
  utilityBarText: {
    left: "Independent specialist. Ships from Mesa, AZ.",
    right: "Fitment line: (480) 555-0139",
  },
  trustPoints: [
    "48H DISPATCH",
    "FITMENT CHECKED",
    "REBUILD PROGRAM",
    "CHASSIS-SPECIFIC",
  ],
  fitmentSteps: [
    "Send chassis and use",
    "We match spring rates and damping",
    "Ships in 48h or built to order",
  ],
  faq: [
    {
      question: "Can you help confirm fitment before ordering?",
      answer:
        "Yes. Send chassis, wheel size, tire size, intended ride height, and primary use. We confirm the closest catalog match before you buy.",
    },
    {
      question: "How do I choose spring rates?",
      answer:
        "Use the series as the first filter. Street keeps daily compliance, Drift adds rotation support, and Track prioritizes control at sustained pace.",
    },
    {
      question: "How difficult is installation?",
      answer:
        "Most kits are designed for experienced home installers or professional shops. Alignment is required after install.",
    },
    {
      question: "What is covered by warranty and rebuilds?",
      answer:
        "Dampers carry a limited defect warranty. Wear items are serviceable through the rebuild program with documented inspection notes.",
    },
    {
      question: "How do shipping and waitlist notices work?",
      answer:
        "In-stock items dispatch from Mesa in 48 hours. Built-to-order items show lead time. Waitlist notices are sent when a SKU returns.",
    },
  ],
  footer: {
    usefulLinks: ["Catalog", "Fitment", "Support", "Cart"],
    address: "1842 E Baseline Road, Mesa, AZ 85204",
    phone: "(480) 555-0139",
    email: "support@preloadsupply.test",
    smallPrint: "Demo storefront. Product data illustrative.",
  },
  diagramKey: "coilover",
  specTicker:
    "SPRING RATES 6K-14K · DAMPING 32-WAY · HEIGHT ADJ -1.5 TO -3.0 IN · REBUILD PROGRAM AVAILABLE",
};
