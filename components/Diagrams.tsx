import type { DiagramKey } from "@/data/types";

type DiagramProps = {
  diagramKey: DiagramKey;
  compact?: boolean;
};

export function Diagram({ diagramKey, compact = false }: DiagramProps) {
  if (diagramKey === "brake") {
    return <BrakeDiagram compact={compact} />;
  }

  return <CoiloverDiagram compact={compact} />;
}

function CoiloverDiagram({ compact }: { compact: boolean }) {
  return (
    <svg
      viewBox="0 0 360 520"
      role="img"
      aria-label="Technical coilover diagram"
      className={compact ? "h-44 w-full" : "h-full min-h-[360px] w-full"}
      fill="none"
    >
      <rect x="72" y="32" width="216" height="456" stroke="currentColor" strokeWidth="1.5" />
      <line x1="180" y1="52" x2="180" y2="468" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M147 112 C219 128 141 150 213 166 C141 182 219 204 147 220 C219 236 141 258 213 274 C141 290 219 312 147 328"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect x="146" y="58" width="68" height="56" stroke="currentColor" strokeWidth="1.5" />
      <rect x="158" y="332" width="44" height="92" stroke="currentColor" strokeWidth="1.5" />
      <line x1="132" y1="345" x2="228" y2="345" stroke="currentColor" strokeWidth="1.5" />
      <line x1="136" y1="364" x2="224" y2="364" stroke="currentColor" strokeWidth="1.5" />
      <path d="M154 424 H206 L226 468 H134 Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="180" cy="468" r="14" stroke="currentColor" strokeWidth="1.5" />
      <path d="M250 128 H302" stroke="currentColor" strokeWidth="1.5" />
      <path d="M236 246 H302" stroke="currentColor" strokeWidth="1.5" />
      <path d="M232 354 H302" stroke="currentColor" strokeWidth="1.5" />
      <g className="font-mono text-[17px] text-ink">
        <text x="309" y="133" fill="currentColor">1</text>
        <text x="309" y="251" fill="currentColor">2</text>
        <text x="309" y="359" fill="currentColor">3</text>
      </g>
      {!compact && (
        <g className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          <text x="86" y="504" fill="currentColor">1 Spring</text>
          <text x="160" y="504" fill="currentColor">2 Damper</text>
          <text x="244" y="504" fill="currentColor">3 Collar</text>
        </g>
      )}
    </svg>
  );
}

function BrakeDiagram({ compact }: { compact: boolean }) {
  return (
    <svg
      viewBox="0 0 360 520"
      role="img"
      aria-label="Technical brake diagram"
      className={compact ? "h-44 w-full" : "h-full min-h-[360px] w-full"}
      fill="none"
    >
      <rect x="72" y="32" width="216" height="456" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="180" cy="260" r="116" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="180" cy="260" r="70" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="180" cy="260" r="16" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M243 160 C286 184 304 236 293 285 C286 316 267 342 241 358 L220 318 C240 304 252 283 252 260 C252 236 239 214 218 201 Z"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M123 198 L237 322" stroke="currentColor" strokeWidth="1.5" />
      <path d="M237 198 L123 322" stroke="currentColor" strokeWidth="1.5" />
      <path d="M180 144 V376" stroke="currentColor" strokeWidth="1.5" />
      <path d="M64 260 H296" stroke="currentColor" strokeWidth="1.5" />
      <path d="M267 178 H318" stroke="currentColor" strokeWidth="1.5" />
      <path d="M268 260 H318" stroke="currentColor" strokeWidth="1.5" />
      <path d="M240 354 H318" stroke="currentColor" strokeWidth="1.5" />
      <g className="font-mono text-[17px] text-ink">
        <text x="326" y="183" fill="currentColor">1</text>
        <text x="326" y="265" fill="currentColor">2</text>
        <text x="326" y="359" fill="currentColor">3</text>
      </g>
      {!compact && (
        <g className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          <text x="78" y="504" fill="currentColor">1 Caliper</text>
          <text x="165" y="504" fill="currentColor">2 Rotor</text>
          <text x="248" y="504" fill="currentColor">3 Bracket</text>
        </g>
      )}
    </svg>
  );
}
