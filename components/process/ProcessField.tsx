"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/providers/AnimationProvider";

/**
 * Ported 1:1 (shader + wave-pool logic) from the reference landing page's
 * `<canvas id="bg">` field: a simplex-noise topographic field warped by a
 * pointer-following "lens" (gaussian magnification of the sampling
 * coordinates) and click-triggered ripples. The reference ran this as a
 * full-page fixed background with `window` pointer listeners; here it's
 * re-scoped to a single section per this project's pattern (compare
 * `components/problem/ProblemWaveBackground.tsx`, also a faithful port of
 * an external reference scene, also IO-gated to its own section):
 *  - listeners attach to the section element, not `window`, so the field
 *    only reacts to the pointer while it's actually over this scene;
 *  - `IntersectionObserver` pauses the rAF loop when the section is off
 *    screen, matching every other canvas in this codebase;
 *  - `prefers-reduced-motion` (via the shared `AnimationProvider`, not a
 *    local `matchMedia` check) drops the rAF loop and click-ripples
 *    entirely, mirroring the reference's own `RM` branch: pointer moves
 *    still redraw a single static frame directly, nothing animates on its
 *    own.
 *
 * Driver-hardening notes carried over unchanged from the reference (see
 * inline comments below): array-uniform locations queried as "name[0]"
 * first, the wave band edge uses `1 - smoothstep` to avoid reversed-edge
 * UB, and wave distance is clamped before squaring to avoid mediump
 * fp16 overflow.
 */

const RIPS = 5; // must match the shader's array size

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
  " vec2 vc=(uv-vec2(0.5,0.55))*vec2(u_resolution.x/u_resolution.y,1.0);",
  " float vig=smoothstep(1.05,0.32,length(vc));",
  " vig*=mix(0.5,1.0,smoothstep(0.0,0.22,uv.y));",
  " gl_FragColor=vec4(vec3(topo*vig),1.0);",
  "}",
].join("\n");

type ProcessFieldProps = {
  sectionRef: React.RefObject<HTMLElement | null>;
  className?: string;
};

export default function ProcessField({ sectionRef, className }: ProcessFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const reducedRef = useRef(prefersReducedMotion);
  reducedRef.current = prefersReducedMotion;

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false });
    } catch {
      gl = null;
    }
    if (!gl) return;
    const ctx = gl;

    function compile(type: number, src: string): WebGLShader | null {
      const s = ctx.createShader(type);
      if (!s) return null;
      ctx.shaderSource(s, src);
      ctx.compileShader(s);
      if (!ctx.getShaderParameter(s, ctx.COMPILE_STATUS)) {
        console.warn("[process field shader]", ctx.getShaderInfoLog(s));
        return null;
      }
      return s;
    }
    const vs = compile(ctx.VERTEX_SHADER, VS);
    const fs = compile(ctx.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    const program = ctx.createProgram();
    if (!program) return;
    ctx.attachShader(program, vs);
    ctx.attachShader(program, fs);
    ctx.linkProgram(program);
    if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
      console.warn("[process field link]", ctx.getProgramInfoLog(program));
      return;
    }
    ctx.useProgram(program);

    const buf = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buf);
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), ctx.STATIC_DRAW);
    const posLoc = ctx.getAttribLocation(program, "a_position");
    ctx.enableVertexAttribArray(posLoc);
    ctx.vertexAttribPointer(posLoc, 2, ctx.FLOAT, false, 0, 0);

    // array uniform locations: try the "[0]" form first — some drivers
    // reject the bare array name and would silently drop uploads
    function locA(name: string): WebGLUniformLocation | null {
      return ctx.getUniformLocation(program, `${name}[0]`) || ctx.getUniformLocation(program, name);
    }
    const uRes = ctx.getUniformLocation(program, "u_resolution");
    const uT = ctx.getUniformLocation(program, "u_time");
    const uMou = ctx.getUniformLocation(program, "u_mouse");
    const uRip = locA("u_rip");
    const uRipT = locA("u_ripT");

    const HOME = { x: 0.5, y: 0.45 };
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

    function nrm(clientX: number, clientY: number) {
      const rect = canvas!.getBoundingClientRect();
      return { x: (clientX - rect.left) / rect.width, y: 1 - (clientY - rect.top) / rect.height };
    }

    function render(tSec: number, mx: number, my: number) {
      ctx.uniform1f(uT, tSec);
      ctx.uniform2f(uMou, mx, my);
      ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4);
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas!.clientWidth * dpr);
      const h = Math.round(canvas!.clientHeight * dpr);
      if (canvas!.width !== w) canvas!.width = w;
      if (canvas!.height !== h) canvas!.height = h;
      ctx.viewport(0, 0, canvas!.width, canvas!.height);
      ctx.uniform2f(uRes, canvas!.width, canvas!.height);
      render(0, mouse.x, mouse.y);
    }

    const onPointerMove = (e: PointerEvent) => {
      const p = nrm(e.clientX, e.clientY);
      target.x = p.x;
      target.y = p.y;
      lastMoveAt = performance.now();
      if (reducedRef.current) {
        mouse.x = p.x;
        mouse.y = p.y;
        render(0, mouse.x, mouse.y);
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (reducedRef.current) return; // the wave is decoration; the lens is not
      const p = nrm(e.clientX, e.clientY);
      const now = (performance.now() - t0) * 0.001;
      // claim a free slot; if all five are alive, retire the one closest
      // to having finished anyway
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
    };

    const onPointerLeave = () => {
      target.x = HOME.x;
      target.y = HOME.y;
    };

    const onResize = () => resize();

    section.addEventListener("pointermove", onPointerMove, { passive: true });
    section.addEventListener("pointerdown", onPointerDown, { passive: true });
    section.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", onResize);

    if (uRip) ctx.uniform2fv(uRip, ripXY);
    if (uRipT) ctx.uniform1fv(uRipT, ripT);
    resize();

    let raf = 0;
    let visible = false;
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0, rootMargin: "400px 0px 400px 0px" },
    );
    io.observe(section);

    if (!reducedRef.current) {
      let last = 0;
      const frame = (t: number) => {
        raf = requestAnimationFrame(frame);
        if (!visible) return;
        const now = performance.now();
        // full rate only while being touched — a laggy lens reads as
        // broken, the glacial drift is fine at 30
        const busy = now - lastMoveAt < 700 || now < rippleEnd;
        if (t - last < (busy ? 0 : 33.3)) return;
        last = t;
        mouse.x += (target.x - mouse.x) * 0.085;
        mouse.y += (target.y - mouse.y) * 0.085;
        render((t - t0) * 0.001, mouse.x, mouse.y);
      };
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerdown", onPointerDown);
      section.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      ctx.deleteBuffer(buf);
      ctx.deleteProgram(program);
      ctx.deleteShader(vs);
      ctx.deleteShader(fs);
    };
    // sectionRef is a stable ref object; prefersReducedMotion is tracked
    // via reducedRef so toggling it mid-session doesn't tear the GL
    // context down and rebuild it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      role="presentation"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ""}`}
    />
  );
}
