/**
 * Four "manufactured" icons matching the reference design's Problem
 * section: person (Missed Leads), calendar (Lost Bookings), clock
 * (No Follow-Up), refresh loop (Weak Retention). Each is a plain
 * function that strokes lines into a given 2D context in an s×s
 * coordinate space — ProblemIconCanvas samples the result into particle
 * points, it never touches an image file.
 */

export type IconDraw = (ctx: CanvasRenderingContext2D, s: number) => void;

function setStroke(ctx: CanvasRenderingContext2D, s: number) {
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = s * 0.02;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
}

// Missed Leads: a person silhouette — the inquiry that never got a reply.
export const drawGhostedLeads: IconDraw = (ctx, s) => {
  setStroke(ctx, s);
  const c = s / 2;
  const headR = s * 0.13;
  const headY = s * 0.32;

  ctx.beginPath();
  ctx.arc(c, headY, headR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(c - s * 0.22, s * 0.72);
  ctx.quadraticCurveTo(c - s * 0.22, s * 0.48, c, s * 0.46);
  ctx.quadraticCurveTo(c + s * 0.22, s * 0.48, c + s * 0.22, s * 0.72);
  ctx.stroke();
};

// Lost Bookings: a calendar grid — the appointment that went elsewhere.
export const drawManualChaos: IconDraw = (ctx, s) => {
  setStroke(ctx, s);
  const x = s * 0.22;
  const y = s * 0.26;
  const w = s * 0.56;
  const h = s * 0.48;
  const r = s * 0.05;

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
  ctx.moveTo(x, y + s * 0.14);
  ctx.lineTo(x + w, y + s * 0.14);
  ctx.stroke();

  [0.3, 0.5, 0.7].forEach((fx) => {
    ctx.beginPath();
    ctx.moveTo(x + w * fx, y - s * 0.05);
    ctx.lineTo(x + w * fx, y + s * 0.06);
    ctx.stroke();
  });

  [0.28, 0.5, 0.72].forEach((fy) => {
    [0.28, 0.5, 0.72].forEach((fx) => {
      ctx.beginPath();
      ctx.arc(x + w * fx, y + h * fy + s * 0.03, s * 0.015, 0, Math.PI * 2);
      ctx.stroke();
    });
  });
};

// No Follow-Up: a clock face — leads going cold while the hands keep moving.
export const drawSlowResponse: IconDraw = (ctx, s) => {
  setStroke(ctx, s);
  const c = s / 2;
  const r = s * 0.3;
  ctx.beginPath();
  ctx.arc(c, c, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(c, c);
  ctx.lineTo(c, c - r * 0.58);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(c, c);
  ctx.lineTo(c + r * 0.42, c + r * 0.24);
  ctx.stroke();
};

// Weak Retention: two curved arrows chasing each other in a loop that
// never quite closes — customers who don't come back around.
export const drawLostRevenue: IconDraw = (ctx, s) => {
  setStroke(ctx, s);
  const c = s / 2;
  const r = s * 0.26;

  ctx.beginPath();
  ctx.arc(c, c, r, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  {
    const ang = Math.PI * 1.85;
    const ax = c + Math.cos(ang) * r;
    const ay = c + Math.sin(ang) * r;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(ax - s * 0.06, ay - s * 0.02);
    ctx.moveTo(ax, ay);
    ctx.lineTo(ax - s * 0.02, ay + s * 0.06);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(c, c, r, Math.PI * 0.15, Math.PI * 0.85);
  ctx.stroke();
  {
    const ang = Math.PI * 0.85;
    const ax = c + Math.cos(ang) * r;
    const ay = c + Math.sin(ang) * r;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(ax + s * 0.06, ay + s * 0.02);
    ctx.moveTo(ax, ay);
    ctx.lineTo(ax + s * 0.02, ay - s * 0.06);
    ctx.stroke();
  }
};
