"use client";

import { useEffect, useRef } from "react";

type HeroLogoCanvasProps = {
  logoSrc: string;
  className?: string;
  /** Gate for the reveal. Defaults to true (mark shows as soon as it loads).
   *  Pass false to hold it fully hidden until the caller flips this true. */
  startReveal?: boolean;
};

/**
 * Logo canvas matching the original vanilla-JS reference 1:1: the mark is
 * drawn crisp and whole every frame (no entrance animation, no flash, no
 * idle/ambient trickle). The ONLY particle behavior is mouse-hover erosion —
 * dust peels off the mark's surface near the cursor and drifts away, exactly
 * like `logoErosionCanvas` / `ErosionParticle` in the reference `script.js`.
 * With no mouse nearby, nothing spawns — the mark just sits there, static.
 */
export default function HeroLogoCanvas({ logoSrc, className, startReveal = true }: HeroLogoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const startRevealRef = useRef(startReveal);
  useEffect(() => {
    startRevealRef.current = startReveal;
  }, [startReveal]);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const lctxEl = canvasEl.getContext("2d", { willReadFrequently: true });
    if (!lctxEl) return;
    const canvas = canvasEl;
    const lctx = lctxEl;

    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    let mx = -9999;
    let my = -9999;
    let mouseInitialized = false;
    let canvasActive = true;
    let raf = 0;
    let destroyed = false;
    let cleanupResize: (() => void) | null = null;
    let getRect: () => { left: number; top: number; width: number; height: number } = () => ({
      left: 0,
      top: 0,
      width: 1,
      height: 1,
    });

    const logoImg = new Image();
    logoImg.src = logoSrc;

    let logoData: ImageData | null = null;

    // ---- hover-driven erosion particles only (matches reference ErosionParticle) ----
    type ErosionParticle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      decay: number;
      r: number;
      g: number;
      b: number;
    };
    let logoParticles: ErosionParticle[] = [];
    const MAX_LOGO_PARTICLES = 100;

    function spawnErosionParticle(x: number, y: number, r: number, g: number, b: number) {
      logoParticles.push({
        x,
        y,
        vx: Math.random() * -1.0 - 0.4,
        vy: Math.random() * -0.8 - 1.2,
        size: Math.random() * 1.5 + 0.5,
        life: 1.0,
        decay: Math.random() * 0.008 + 0.003,
        r,
        g,
        b,
      });
    }

    // Perf: the hover glow is a fixed-radius, fixed-color radial gradient —
    // its only per-frame variable is position. Instead of calling
    // createRadialGradient()/fillRect() on the full canvas every frame (GC
    // churn + a large fill), pre-render it once to a small offscreen sprite
    // and blit that sprite with drawImage each frame. Same visual result
    // (source-atop still masks it to the logo's drawn pixels), far cheaper.
    const GLOW_RADIUS = 65;
    const glowSprite = document.createElement("canvas");
    glowSprite.width = GLOW_RADIUS * 2;
    glowSprite.height = GLOW_RADIUS * 2;
    const glowCtx = glowSprite.getContext("2d");
    if (glowCtx) {
      const glowGradient = glowCtx.createRadialGradient(
        GLOW_RADIUS,
        GLOW_RADIUS,
        0,
        GLOW_RADIUS,
        GLOW_RADIUS,
        GLOW_RADIUS
      );
      glowGradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
      glowGradient.addColorStop(0.5, "rgba(139, 92, 246, 0.25)");
      glowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      glowCtx.fillStyle = glowGradient;
      glowCtx.fillRect(0, 0, glowSprite.width, glowSprite.height);
    }

    function onMouseMove(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
      mouseInitialized = true;
    }
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          canvasActive = entry.isIntersecting;
        });
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    // No entrance animation — the mark is drawn crisp and whole the instant
    // startReveal flips true. If false, stay "waiting" (nothing drawn) until
    // the caller (Hero.tsx) flips it.
    type Phase = "waiting" | "complete";
    let phase: Phase = "waiting";

    logoImg.onload = () => {
      if (destroyed) return;
      const MARGIN_SCALE = 1 / 1.6;

      let rectLeft = 0;
      let rectTop = 0;
      let rectWidth = 1;
      let rectHeight = 1;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      function sizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        rectWidth = rect.width || 1;
        rectHeight = rect.height || 1;
        canvas.width = Math.round(rectWidth * dpr);
        canvas.height = Math.round(rectHeight * dpr);
        canvas.style.width = `${rectWidth}px`;
        canvas.style.height = `${rectHeight}px`;
        rectLeft = rect.left;
        rectTop = rect.top;
      }
      sizeCanvas();

      const offscreen = document.createElement("canvas");
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      const octx = offscreen.getContext("2d");
      const scale =
        Math.min(canvas.width / logoImg.width, canvas.height / logoImg.height) * 0.94 * MARGIN_SCALE;
      const x = (canvas.width - logoImg.width * scale) / 2;
      const y = (canvas.height - logoImg.height * scale) / 2;
      octx?.drawImage(logoImg, x, y, logoImg.width * scale, logoImg.height * scale);
      logoData = octx?.getImageData(0, 0, canvas.width, canvas.height) ?? null;

      function updateRect() {
        const rect = canvas.getBoundingClientRect();
        rectLeft = rect.left;
        rectTop = rect.top;
      }
      function onResize() {
        sizeCanvas();
      }
      window.addEventListener("resize", onResize);
      window.addEventListener("scroll", updateRect, { passive: true });
      cleanupResize = () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", updateRect);
      };
      getRect = () => ({ left: rectLeft, top: rectTop, width: rectWidth, height: rectHeight });

      if (startRevealRef.current) {
        phase = "complete";
      }

      animateLogo();
    };
    logoImg.onerror = () => {
      console.warn("Logo image failed to load. Erosion effect disabled.");
      canvas.style.display = "none";
    };

    function animateLogo() {
      if (destroyed) return;
      if (!canvasActive) {
        raf = requestAnimationFrame(animateLogo);
        return;
      }

      const rect = getRect();
      const canvasMX = (mx - rect.left) * (canvas.width / rect.width);
      const canvasMY = (my - rect.top) * (canvas.height / rect.height);
      const logoScale =
        Math.min(canvas.width / logoImg.width, canvas.height / logoImg.height) * 0.94 * (1 / 1.6);
      const centerX = (canvas.width - logoImg.width * logoScale) / 2;
      const centerY = (canvas.height - logoImg.height * logoScale) / 2;

      lctx.clearRect(0, 0, canvas.width, canvas.height);

      if (phase === "waiting") {
        if (startRevealRef.current) {
          phase = "complete";
        } else {
          // Nothing drawn at all — mark stays fully hidden until touched.
          raf = requestAnimationFrame(animateLogo);
          return;
        }
      }

      // Crisp static frame every frame — no entrance animation, no flash.
      lctx.drawImage(logoImg, centerX, centerY, logoImg.width * logoScale, logoImg.height * logoScale);

      const hovering =
        !isTouchDevice &&
        mouseInitialized &&
        canvasMX > 0 &&
        canvasMX < canvas.width &&
        canvasMY > 0 &&
        canvasMY < canvas.height;

      if (hovering) {
        lctx.save();
        lctx.globalCompositeOperation = "source-atop";
        lctx.drawImage(glowSprite, canvasMX - GLOW_RADIUS, canvasMY - GLOW_RADIUS);
        lctx.restore();

        for (let i = 0; i < 3; i++) {
          if (logoParticles.length < MAX_LOGO_PARTICLES && logoData) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 65;
            const px = Math.floor(canvasMX + Math.cos(angle) * dist);
            const py = Math.floor(canvasMY + Math.sin(angle) * dist);
            if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
              const index = (py * canvas.width + px) * 4;
              const data = logoData.data;
              const alphaAtPixel = data[index + 3];
              if (alphaAtPixel !== undefined && alphaAtPixel > 100) {
                spawnErosionParticle(
                  px,
                  py,
                  data[index] ?? 255,
                  data[index + 1] ?? 255,
                  data[index + 2] ?? 255
                );
              }
            }
          }
        }
      }

      for (let i = logoParticles.length - 1; i >= 0; i--) {
        const p = logoParticles[i];
        if (!p) continue;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) {
          logoParticles.splice(i, 1);
        } else {
          lctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.life})`;
          lctx.fillRect(p.x, p.y, p.size, p.size);
        }
      }

      raf = requestAnimationFrame(animateLogo);
    }

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
      cleanupResize?.();
      logoParticles = [];
    };
  }, [logoSrc]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" role="presentation" />;
}
