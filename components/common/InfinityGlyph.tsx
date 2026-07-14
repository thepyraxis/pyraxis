/**
 * Static infinity-symbol glyph made of scattered dots along a lemniscate
 * path — replaces the old per-frame particle-engine version of this shape.
 * Pure SVG, generated once at render (no useEffect, no rAF); the only
 * motion is a slow CSS opacity pulse on the bright core, which the browser
 * compositor handles for free.
 */

function lemniscatePoint(t: number, a: number) {
  const denom = 1 + Math.sin(t) * Math.sin(t);
  const x = (a * Math.cos(t)) / denom;
  const y = (a * Math.sin(t) * Math.cos(t)) / denom;
  return { x, y };
}

function starCross(x: number, y: number, size: number, opacity: number, key: number) {
  return (
    <g key={`star-${key}`} opacity={opacity}>
      <line x1={x - size} y1={y} x2={x + size} y2={y} stroke="#e9d5ff" strokeWidth="0.8" />
      <line x1={x} y1={y - size} x2={x} y2={y + size} stroke="#e9d5ff" strokeWidth="0.8" />
    </g>
  );
}

export default function InfinityGlyph({ className = "" }: { className?: string }) {
  const w = 900;
  const h = 560;
  const cx = w / 2;
  const cy = 200;
  const a = 320;

  const dots: { x: number; y: number; r: number; o: number }[] = [];
  // Two passes: a tight core trail right on the lemniscate, then a looser
  // halo scattered around it — the reference glyph reads as a dense
  // sparkling band, not a single thin dotted line.
  const N = 420;
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2;
    const { x, y } = lemniscatePoint(t, a);
    // deterministic jitter from index, not Math.random(), so SSR/CSR match
    const jitter = Math.sin(i * 12.9898) * 7;
    dots.push({
      x: Number((cx + x + jitter).toFixed(3)),
      y: Number((cy + y + Math.cos(i * 7.233) * 7).toFixed(3)),
      r: 1 + (i % 5) * 0.5,
      o: 0.4 + (i % 7) * 0.09,
    });
  }
  const HALO = 260;
  for (let i = 0; i < HALO; i++) {
    const t = (i / HALO) * Math.PI * 2;
    const { x, y } = lemniscatePoint(t, a);
    const spread = 14 + (Math.sin(i * 5.13) * 0.5 + 0.5) * 26;
    const jx = Math.sin(i * 33.7) * spread;
    const jy = Math.cos(i * 19.3) * spread;
    dots.push({
      x: Number((cx + x + jx).toFixed(3)),
      y: Number((cy + y + jy).toFixed(3)),
      r: 0.4 + (i % 4) * 0.35,
      o: 0.08 + (i % 5) * 0.05,
    });
  }

  // Bright star-cross glints scattered along the loops, matching the
  // reference photo's sparkle highlights.
  const stars: { x: number; y: number; size: number; o: number }[] = [];
  const S = 22;
  for (let i = 0; i < S; i++) {
    const t = (i / S) * Math.PI * 2 + 0.3;
    const { x, y } = lemniscatePoint(t, a);
    stars.push({
      x: Number((cx + x + Math.sin(i * 9.1) * 10).toFixed(3)),
      y: Number((cy + y + Math.cos(i * 6.4) * 10).toFixed(3)),
      size: 3 + (i % 3) * 1.6,
      o: 0.5 + (i % 4) * 0.12,
    });
  }

  // Wavy particle plane underneath — several sine layers of dots, fading
  // out toward the bottom edge.
  const waveDots: { x: number; y: number; r: number; o: number }[] = [];
  const layers = 5;
  const perLayer = 90;
  for (let l = 0; l < layers; l++) {
    const baseY = 360 + l * 34;
    const amp = 14 + l * 4;
    const freq = 0.018 + l * 0.003;
    const phase = l * 1.7;
    for (let i = 0; i < perLayer; i++) {
      const x = (i / (perLayer - 1)) * w;
      const y = baseY + Math.sin(x * freq + phase) * amp + Math.sin(x * freq * 2.3 + phase) * (amp * 0.3);
      waveDots.push({
        x: Number(x.toFixed(3)),
        y: Number(y.toFixed(3)),
        r: 0.5 + ((i + l) % 4) * 0.3,
        o: Number(((0.28 - l * 0.04) * (0.5 + 0.5 * Math.sin(x * 0.01 + l))).toFixed(4)),
      });
    }
  }

  return (
    <div aria-hidden="true" className={`pointer-events-none ${className}`}>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full">
        <defs>
          <radialGradient id="infinity-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e9d5ff" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path
          d={`M ${cx - a} ${cy} C ${cx - a} ${cy - a * 0.55}, ${cx - a * 0.25} ${cy - a * 0.55}, ${cx} ${cy} C ${cx + a * 0.25} ${cy + a * 0.55}, ${cx + a} ${cy + a * 0.55}, ${cx + a} ${cy} C ${cx + a} ${cy - a * 0.55}, ${cx + a * 0.25} ${cy - a * 0.55}, ${cx} ${cy} C ${cx - a * 0.25} ${cy + a * 0.55}, ${cx - a} ${cy + a * 0.55}, ${cx - a} ${cy}`}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="1"
          opacity="0.25"
        />
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#c4b5fd" opacity={d.o} />
        ))}
        {waveDots.map((d, i) => (
          <circle key={`w-${i}`} cx={d.x} cy={d.y} r={d.r} fill="#a78bfa" opacity={Math.max(d.o, 0)} />
        ))}
        {stars.map((s, i) => starCross(s.x, s.y, s.size, s.o, i))}
        <circle cx={cx} cy={cy} r="26" fill="url(#infinity-core)" className="infinity-core-pulse" />
      </svg>
      <style>{`
        .infinity-core-pulse { animation: infinity-pulse 4s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
        @keyframes infinity-pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @media (prefers-reduced-motion: reduce) {
          .infinity-core-pulse { animation: none; }
        }
      `}</style>
    </div>
  );
}
