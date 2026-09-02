"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/providers/AnimationProvider";
import { usePerformanceTierOnly } from "@/providers/PerformanceProvider";

type FieldCanvasProps = {
  /** Section element to watch for visibility (pauses rAF off-screen). */
  sectionRef: React.RefObject<HTMLElement | null>;
  className?: string;
};

/**
 * Ambient WebGL topo field background, shared by Why-PYRAXIS ("How We
 * Build") and Portfolio ("Recent Deployments"). Ported from the standalone
 * NexusNode reference: a simplex-noise field distorted by a
 * pointer-following lens, with click-spawned ripples that age out of a
 * fixed 5-slot pool (no per-click allocation, no GC churn). Rendered in
 * the reference's original neutral white (u_color = 1,1,1) rather than a
 * brand tint.
 *
 * NOTE (Portfolio usage): creative/SIGNATURE_MOTIF.md documents Portfolio
 * as a deliberate "quiet" section (no motif, no purple beyond one CTA
 * link) for page rhythm — this mount is an explicit, requested override
 * of that doc, not an oversight. The white field satisfies that override
 * without adding purple to Portfolio. If Portfolio's "quiet" status is
 * ever restored, remove the mount in Portfolio.tsx rather than deleting
 * this file (Why-PYRAXIS still depends on it).
 *
 * Follows the same lifecycle contract as every other section canvas in
 * this codebase (see HeroLogoCanvas.tsx / GlobeCanvas.tsx): own <canvas>,
 * own IntersectionObserver gate, own rAF loop, full cleanup on unmount.
 * Mobile tier and prefers-reduced-motion both skip WebGL entirely and
 * render nothing — each host section already carries a plain dark
 * background, so "no field" degrades gracefully rather than needing a
 * static fallback.
 */
export default function FieldCanvas({ sectionRef, className }: FieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const tier = usePerformanceTierOnly();
  const skip = reducedMotion || tier === "mobile";

  useEffect(() => {
    if (skip) return;
    const canvasEl = canvasRef.current;
    const sectionEl = sectionRef.current;
    if (!canvasEl || !sectionEl) return;
    const canvas = canvasEl;
    const section = sectionEl;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl", { alpha: true, antialias: false, depth: false });
    } catch {
      gl = null;
    }
    if (!gl) return;
    const ctx = gl;

    const RIPS = 5;

    const VS = "attribute vec2 a_position;void main(){gl_Position=vec4(a_position,0.,1.);}";
    const FS = [
      "#ifdef GL_FRAGMENT_PRECISION_HIGH",
      "precision highp float;",
      "#else",
      "precision mediump float;",
      "#endif",
      "uniform vec2 u_resolution;",
      "uniform float u_time;",
      "uniform vec2 u_mouse;",
      "uniform vec3 u_color;",
      "uniform vec2 u_rip[5];",
      "uniform float u_ripT[5];",
      "vec3 permute(vec3 x){return mod(((x*34.0)+1.0)*x,289.0);}",
      "float snoise(vec2 v){",
      " const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);",
      " vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);",
      " vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);",
      " vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod(i,289.0);",
      " vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));",
      " vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);",
      " m=m*m;m=m*m;",
      " vec3 x=2.0*fract(p*C.www)-1.0;vec3 h=abs(x)-0.5;vec3 ox=floor(x+0.5);",
      " vec3 a0=x-ox;m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);",
      " vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;",
      " return 130.0*dot(m,g);",
      "}",
      "void main(){",
      " vec2 uv=gl_FragCoord.xy/u_resolution;",
      " vec2 st=uv;st.x*=u_resolution.x/u_resolution.y;",
      " vec2 m=u_mouse;m.x*=u_resolution.x/u_resolution.y;",
      " vec2 toM=st-m;",
      " float inf=exp(-dot(toM,toM)*5.0);",
      " vec2 lens=m+toM*(1.0+inf*0.55);",
      " float ring=0.0;",
      " for(int i=0;i<5;i++){",
      "  float age=u_time-u_ripT[i];",
      "  float amp=clamp(1.0-age/2.4,0.0,1.0);",
      "  vec2 rp=u_rip[i];rp.x*=u_resolution.x/u_resolution.y;",
      "  vec2 toR=st-rp;",
      "  float w=clamp((length(toR)-age*0.32)*16.0,-40.0,40.0);",
      "  ring+=exp(-w*w)*amp;",
      " }",
      " ring=min(ring,1.5);",
      " vec2 np=lens*1.4+vec2(u_time*0.015,u_time*0.025);",
      " float n=snoise(np)*0.5+0.5+ring*0.85;",
      " float tri=abs(fract(n*10.0)-0.5)*2.0;",
      " float band=1.0-smoothstep(0.0,0.02,tri);",
      " float topo=band*0.40;",
      " topo*=1.0+inf*1.4+ring*1.6;",
      " vec2 vc=(uv-vec2(0.5,0.5))*vec2(u_resolution.x/u_resolution.y,1.0);",
      " float vig=smoothstep(1.05,0.32,length(vc));",
      " gl_FragColor=vec4(u_color*topo*vig,topo*vig);",
      "}",
    ].join("\n");

    function compile(type: number, src: string) {
      const s = ctx.createShader(type);
      if (!s) return null;
      ctx.shaderSource(s, src);
      ctx.compileShader(s);
      if (!ctx.getShaderParameter(s, ctx.COMPILE_STATUS)) {
        console.warn("[why-pyraxis field shader]", ctx.getShaderInfoLog(s));
        return null;
      }
      return s;
    }

    const v = compile(ctx.VERTEX_SHADER, VS);
    const f = compile(ctx.FRAGMENT_SHADER, FS);
    if (!v || !f) return;
    const program = ctx.createProgram();
    if (!program) return;
    ctx.attachShader(program, v);
    ctx.attachShader(program, f);
    ctx.linkProgram(program);
    if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
      console.warn("[why-pyraxis field link]", ctx.getProgramInfoLog(program));
      return;
    }
    ctx.useProgram(program);

    const buf = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buf);
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), ctx.STATIC_DRAW);
    const posLoc = ctx.getAttribLocation(program, "a_position");
    ctx.enableVertexAttribArray(posLoc);
    ctx.vertexAttribPointer(posLoc, 2, ctx.FLOAT, false, 0, 0);

    ctx.enable(ctx.BLEND);
    ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);

    function locA(name: string) {
      return ctx.getUniformLocation(program, `${name}[0]`) || ctx.getUniformLocation(program, name);
    }
    const uRes = ctx.getUniformLocation(program, "u_resolution");
    const uT = ctx.getUniformLocation(program, "u_time");
    const uMou = ctx.getUniformLocation(program, "u_mouse");
    const uColor = ctx.getUniformLocation(program, "u_color");
    const uRip = locA("u_rip");
    const uRipT = locA("u_ripT");

    ctx.uniform3f(uColor, 1, 1, 1);

    const HOME = { x: 0.5, y: 0.5 };
    const mouse = { x: HOME.x, y: HOME.y };
    const target = { x: HOME.x, y: HOME.y };
    const t0 = performance.now();
    let lastMoveAt = -1e9;
    let rippleEnd = 0;

    const ripXY = new Float32Array(RIPS * 2);
    const ripT = new Float32Array(RIPS);
    for (let i = 0; i < RIPS; i++) {
      ripT[i] = -1000;
      ripXY[i * 2] = HOME.x;
      ripXY[i * 2 + 1] = HOME.y;
    }

    let canvasActive = false;
    let raf = 0;
    let destroyed = false;

    function render(tSec: number, mx: number, my: number) {
      ctx.uniform1f(uT, tSec);
      ctx.uniform2f(uMou, mx, my);
      ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4);
    }

    const dpr = Math.min(window.devicePixelRatio || 1, tier === "desktop" ? 1.5 : 1);
    function resize() {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = w;
      canvas.height = h;
      ctx.viewport(0, 0, w, h);
      ctx.uniform2f(uRes, w, h);
      render(0, mouse.x, mouse.y);
    }

    function nrmFromSection(clientX: number, clientY: number) {
      const rect = section.getBoundingClientRect();
      return {
        x: (clientX - rect.left) / rect.width,
        y: 1 - (clientY - rect.top) / rect.height,
      };
    }

    function onPointerMove(e: PointerEvent) {
      const p = nrmFromSection(e.clientX, e.clientY);
      target.x = p.x;
      target.y = p.y;
      lastMoveAt = performance.now();
    }

    function onPointerDown(e: PointerEvent) {
      const p = nrmFromSection(e.clientX, e.clientY);
      const now = (performance.now() - t0) * 0.001;
      let idx = 0;
      let leastRemaining = Infinity;
      for (let i = 0; i < RIPS; i++) {
        if (ripT[i]! < now - 3.0) {
          idx = i;
          break;
        }
        const rem = ripT[i]! + 2.4 - now;
        if (rem < leastRemaining) {
          leastRemaining = rem;
          idx = i;
        }
      }
      ripXY[idx * 2] = p.x;
      ripXY[idx * 2 + 1] = p.y;
      ripT[idx] = now;
      if (uRip) ctx.uniform2fv(uRip, ripXY);
      if (uRipT) ctx.uniform1fv(uRipT, ripT);
      rippleEnd = performance.now() + 2400;
    }

    function onLeave() {
      target.x = HOME.x;
      target.y = HOME.y;
    }

    section.addEventListener("pointermove", onPointerMove, { passive: true });
    section.addEventListener("pointerdown", onPointerDown, { passive: true });
    section.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("resize", resize);

    const io = new IntersectionObserver(([entry]) => {
      canvasActive = !!entry?.isIntersecting;
    }, { threshold: 0 });
    io.observe(section);

    if (uRip) ctx.uniform2fv(uRip, ripXY);
    if (uRipT) ctx.uniform1fv(uRipT, ripT);
    resize();

    let last = 0;
    function frame(t: number) {
      raf = requestAnimationFrame(frame);
      if (!canvasActive) return;
      const now = performance.now();
      const busy = now - lastMoveAt < 700 || now < rippleEnd;
      if (t - last < (busy ? 0 : 33.3)) return;
      last = t;
      mouse.x += (target.x - mouse.x) * 0.085;
      mouse.y += (target.y - mouse.y) * 0.085;
      render((t - t0) * 0.001, mouse.x, mouse.y);
    }
    raf = requestAnimationFrame(frame);

    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf && !destroyed) {
        raf = requestAnimationFrame(frame);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerdown", onPointerDown);
      section.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
    };
  }, [skip, sectionRef, tier]);

  if (skip) return null;

  return <canvas ref={canvasRef} className={className} aria-hidden="true" role="presentation" />;
}
