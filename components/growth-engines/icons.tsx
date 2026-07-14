/**
 * Five "manufactured" icons for the Infrastructure Modules row, matching
 * the reference design: brain (AI & Automation), server stack (Scalable
 * Infrastructure), connected nodes (Seamless Integrations), puzzle pieces
 * (Modular & Flexible), shield-check (Secure by Design). Plain stroke
 * functions in an s×s space, sampled into particle points by
 * `GrowthEngineIconCanvas`.
 */

export type IconId = "ai" | "infrastructure" | "integrations" | "modular" | "secure";
export type IconDraw = (ctx: CanvasRenderingContext2D, s: number) => void;

function setStroke(ctx: CanvasRenderingContext2D, s: number) {
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = s * 0.02;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
}

// AI & Automation: a brain — two lobes with an internal fold, smarter
// systems that learn and improve.
const drawAI: IconDraw = (ctx, s) => {
  setStroke(ctx, s);
  const c = s / 2;

  ctx.beginPath();
  ctx.moveTo(c, s * 0.24);
  ctx.bezierCurveTo(c - s * 0.06, s * 0.2, c - s * 0.22, s * 0.22, c - s * 0.26, s * 0.34);
  ctx.bezierCurveTo(c - s * 0.34, s * 0.36, c - s * 0.36, s * 0.48, c - s * 0.28, s * 0.54);
  ctx.bezierCurveTo(c - s * 0.34, s * 0.62, c - s * 0.28, s * 0.72, c - s * 0.18, s * 0.72);
  ctx.bezierCurveTo(c - s * 0.16, s * 0.78, c - s * 0.06, s * 0.8, c, s * 0.74);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(c, s * 0.24);
  ctx.bezierCurveTo(c + s * 0.06, s * 0.2, c + s * 0.22, s * 0.22, c + s * 0.26, s * 0.34);
  ctx.bezierCurveTo(c + s * 0.34, s * 0.36, c + s * 0.36, s * 0.48, c + s * 0.28, s * 0.54);
  ctx.bezierCurveTo(c + s * 0.34, s * 0.62, c + s * 0.28, s * 0.72, c + s * 0.18, s * 0.72);
  ctx.bezierCurveTo(c + s * 0.16, s * 0.78, c + s * 0.06, s * 0.8, c, s * 0.74);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(c, s * 0.3);
  ctx.lineTo(c, s * 0.7);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(c - s * 0.2, s * 0.42);
  ctx.lineTo(c - s * 0.08, s * 0.42);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(c + s * 0.08, s * 0.58);
  ctx.lineTo(c + s * 0.2, s * 0.58);
  ctx.stroke();
};

// Scalable Infrastructure: a stacked server — built to handle more
// without breaking.
const drawInfrastructure: IconDraw = (ctx, s) => {
  setStroke(ctx, s);
  const x = s * 0.24;
  const w = s * 0.52;
  const h = s * 0.16;
  const gap = s * 0.06;
  const r = s * 0.025;

  [s * 0.24, s * 0.24 + h + gap, s * 0.24 + (h + gap) * 2].forEach((y) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x + s * 0.06, y + h / 2, s * 0.014, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + w - s * 0.16, y + h / 2);
    ctx.lineTo(x + w - s * 0.06, y + h / 2);
    ctx.stroke();
  });
};

// Seamless Integrations: connected nodes — connect with the tools you
// use and the ones you'll need.
const drawIntegrations: IconDraw = (ctx, s) => {
  setStroke(ctx, s);
  const c = s / 2;
  const r = s * 0.055;
  const arm = s * 0.24;

  const nodes = [
    { x: c, y: c - arm },
    { x: c, y: c + arm },
    { x: c - arm, y: c },
    { x: c + arm, y: c },
  ];

  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.moveTo(c, c);
    ctx.lineTo(n.x, n.y);
    ctx.stroke();
  });

  ctx.beginPath();
  ctx.rect(c - r, c - r, r * 2, r * 2);
  ctx.stroke();

  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.rect(n.x - r, n.y - r, r * 2, r * 2);
    ctx.stroke();
  });
};

// Modular & Flexible: two interlocking puzzle pieces — add, upgrade, or
// swap modules anytime.
const drawModular: IconDraw = (ctx, s) => {
  setStroke(ctx, s);
  const b = s * 0.16; // half-size of each square block
  const knob = s * 0.06;

  // Piece A — top-left block with an outward knob on its right edge and
  // an inward notch on its bottom edge (so piece B's knob slots in).
  const ax = s * 0.32;
  const ay = s * 0.34;
  ctx.beginPath();
  ctx.moveTo(ax - b, ay - b);
  ctx.lineTo(ax + b, ay - b);
  ctx.lineTo(ax + b, ay - knob * 0.6);
  ctx.arc(ax + b + knob, ay, knob, Math.PI * 0.85, Math.PI * 1.15, true);
  ctx.lineTo(ax + b, ay + knob * 0.6);
  ctx.lineTo(ax + b, ay + b);
  ctx.lineTo(ax - b, ay + b);
  ctx.closePath();
  ctx.stroke();

  // Piece B — bottom-right block, its knob overlapping piece A's notch
  // area to read as interlocked.
  const cx = s * 0.62;
  const cy = s * 0.62;
  ctx.beginPath();
  ctx.moveTo(cx + b, cy + b);
  ctx.lineTo(cx - b, cy + b);
  ctx.lineTo(cx - b, cy + knob * 0.6);
  ctx.arc(cx - b - knob, cy, knob, Math.PI * -0.15, Math.PI * 0.15, true);
  ctx.lineTo(cx - b, cy - knob * 0.6);
  ctx.lineTo(cx - b, cy - b);
  ctx.lineTo(cx + b, cy - b);
  ctx.closePath();
  ctx.stroke();
};

// Secure by Design: a shield with a checkmark — enterprise-grade
// security at every layer.
const drawSecure: IconDraw = (ctx, s) => {
  setStroke(ctx, s);
  const c = s / 2;
  const top = s * 0.2;
  const bottom = s * 0.78;
  const w = s * 0.26;

  ctx.beginPath();
  ctx.moveTo(c, top);
  ctx.lineTo(c + w, top + s * 0.08);
  ctx.lineTo(c + w, s * 0.46);
  ctx.bezierCurveTo(c + w, s * 0.62, c + w * 0.5, bottom - s * 0.04, c, bottom);
  ctx.bezierCurveTo(c - w * 0.5, bottom - s * 0.04, c - w, s * 0.62, c - w, s * 0.46);
  ctx.lineTo(c - w, top + s * 0.08);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(c - s * 0.1, s * 0.46);
  ctx.lineTo(c - s * 0.02, s * 0.54);
  ctx.lineTo(c + s * 0.13, s * 0.36);
  ctx.stroke();
};

export const ICONS: Record<IconId, IconDraw> = {
  ai: drawAI,
  infrastructure: drawInfrastructure,
  integrations: drawIntegrations,
  modular: drawModular,
  secure: drawSecure,
};
