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
      <g opacity="0.55" stroke="currentColor" strokeWidth="1">
        <rect x="48" y="28" width="264" height="464" />
        <path d="M64 74 H296" />
        <path d="M64 442 H296" />
        <path d="M82 28 V492" strokeDasharray="4 8" />
        <path d="M278 28 V492" strokeDasharray="4 8" />
      </g>

      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M139 56 H221 L235 78 H125 Z" />
        <path d="M152 40 H208 L221 56 H139 Z" />
        <circle cx="152" cy="62" r="4" />
        <circle cx="180" cy="57" r="4" />
        <circle cx="208" cy="62" r="4" />
        <path d="M152 40 V26" />
        <path d="M180 35 V20" />
        <path d="M208 40 V26" />

        <path d="M180 78 V438" />
        <rect x="162" y="112" width="36" height="250" />
        <path d="M154 114 H206" />
        <path d="M154 358 H206" />
        <path d="M156 362 H204 V410 H156 Z" />
        <path d="M150 372 H210" />
        <path d="M150 382 H210" />
        <path d="M150 392 H210" />
        <path d="M150 402 H210" />

        <path d="M135 310 H225 V327 H135 Z" />
        <path d="M141 330 H219 V345 H141 Z" />
        <path d="M139 318 H221" />
        <path d="M148 337 H212" />

        <path d="M160 410 H200 L214 450 H146 Z" />
        <path d="M146 450 V482" />
        <path d="M214 450 V482" />
        <circle cx="180" cy="466" r="18" />
        <circle cx="180" cy="466" r="7" />
      </g>

      <g stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M127 123 C145 104 215 104 233 123 C215 142 145 142 127 123 Z" />
        <path d="M127 149 C145 130 215 130 233 149 C215 168 145 168 127 149 Z" />
        <path d="M127 175 C145 156 215 156 233 175 C215 194 145 194 127 175 Z" />
        <path d="M127 201 C145 182 215 182 233 201 C215 220 145 220 127 201 Z" />
        <path d="M127 227 C145 208 215 208 233 227 C215 246 145 246 127 227 Z" />
        <path d="M127 253 C145 234 215 234 233 253 C215 272 145 272 127 253 Z" />
        <path d="M127 279 C145 260 215 260 233 279 C215 298 145 298 127 279 Z" />
      </g>

      <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <path d="M236 135 H303" />
        <path d="M226 236 H303" />
        <path d="M222 321 H303" />
        <path d="M216 466 H303" />
      </g>
      <g className="font-mono text-[17px] text-ink">
        <text x="311" y="140" fill="currentColor">1</text>
        <text x="311" y="241" fill="currentColor">2</text>
        <text x="311" y="326" fill="currentColor">3</text>
        <text x="311" y="471" fill="currentColor">4</text>
      </g>
      {!compact && (
        <g className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          <text x="72" y="510" fill="currentColor">1 Spring</text>
          <text x="148" y="510" fill="currentColor">2 Damper</text>
          <text x="232" y="510" fill="currentColor">3 Collar</text>
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
      <g opacity="0.55" stroke="currentColor" strokeWidth="1">
        <rect x="44" y="28" width="272" height="464" />
        <path d="M62 82 H298" />
        <path d="M62 438 H298" />
        <path d="M88 28 V492" strokeDasharray="4 8" />
        <path d="M280 28 V492" strokeDasharray="4 8" />
      </g>

      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="166" cy="260" r="126" />
        <circle cx="166" cy="260" r="101" />
        <circle cx="166" cy="260" r="55" />
        <circle cx="166" cy="260" r="20" />
        <circle cx="166" cy="205" r="8" />
        <circle cx="218" cy="243" r="8" />
        <circle cx="198" cy="305" r="8" />
        <circle cx="134" cy="305" r="8" />
        <circle cx="114" cy="243" r="8" />
        <path d="M118 170 C144 153 186 151 215 168" />
        <path d="M92 214 C86 240 87 281 96 307" />
        <path d="M218 350 C188 369 145 370 116 352" />
        <path d="M240 219 C249 246 248 282 238 309" />
        <path d="M133 135 L152 188" />
        <path d="M209 135 L190 188" />
        <path d="M71 261 H129" />
        <path d="M203 261 H260" />
        <path d="M132 385 L151 333" />
        <path d="M210 385 L190 333" />
      </g>

      <g stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M246 141 C296 168 323 219 318 271 C313 326 280 371 230 390 L205 340 C236 327 255 297 258 263 C260 229 244 198 215 182 Z" />
        <path d="M236 202 C254 217 264 239 263 264 C262 289 249 312 229 326" />
        <path d="M273 183 L295 193" />
        <path d="M291 329 L269 340" />
      </g>

      <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <path d="M271 172 H326" />
        <path d="M232 260 H326" />
        <path d="M216 351 H326" />
      </g>
      <g className="font-mono text-[17px] text-ink">
        <text x="333" y="177" fill="currentColor">1</text>
        <text x="333" y="265" fill="currentColor">2</text>
        <text x="333" y="356" fill="currentColor">3</text>
      </g>
      {!compact && (
        <g className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          <text x="76" y="510" fill="currentColor">1 Caliper</text>
          <text x="165" y="510" fill="currentColor">2 Rotor</text>
          <text x="248" y="510" fill="currentColor">3 Hub</text>
        </g>
      )}
    </svg>
  );
}
