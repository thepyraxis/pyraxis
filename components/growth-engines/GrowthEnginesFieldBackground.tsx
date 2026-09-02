"use client";

import { useEffect, useRef } from "react";

/**
 * Pointer-reactive topographic field for "Infrastructure Modules", ported
 * from the reference doc's raw-WebGL hero background (lens distortion +
 * click ripple pool driven by a single fragment shader). Kept as plain
 * WebGL rather than three.js — the source is a full-screen shader with no
 * geometry to speak of, so a scene graph buys nothing here.
 *
 * `sectionRef` here is the section's *sticky, viewport-height* wrapper,
 * not the tall scroll-track `<section>` that reserves the pinned scroll
 * distance — sticky counts as a positioned element, so it's already the
 * right containing block for an inset-0 canvas, and using it (rather than
 * the multi-screen-tall outer section) keeps the canvas exactly
 * viewport-sized instead of stretching over the whole scroll-jacked rail.
 *
 * Same hardening as the reference:
 *  - array uniform locations are queried as "name[0]" first, since some
 *    drivers reject the bare array name and would silently drop uploads;
 *  - the band edge uses 1-smoothstep(lo,hi,x) to avoid reversed-edge
 *    smoothstep, which is undefined behaviour in GLSL;
 *  - wave distance is clamped before squaring so mediump/fp16 GPUs can't
 *    overflow age math to inf/NaN and poison the frame.
 *
 * Ripples are a fixed pool of 5 slots (origin, birth-time) written once
 * per click; age is derived from u_time every frame so concurrent waves
 * superpose and a new click never restarts a live one.
 */

const RIPS = 5;

const VS =
  "attribute vec2 a_position;void main(){gl_Position=vec4(a_position,0.,1.);}";

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

type GrowthEnginesFieldBackgroundProps = {
  sectionRef: React.RefObject<HTMLElement | null>;
  className?: string;
};

export default function GrowthEnginesFieldBackground({
  sectionRef,
  className,
}: GrowthEnginesFieldBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let gl: WebGLRenderingContext | null = null;

    try {
      gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        depth: false,
      });
    } catch {
      gl = null;
    }

    if (!gl) return;

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);

      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.warn("[growth field shader]", gl!.getShaderInfoLog(s));
        return null;
      }

      return s;
    }

    const v = compile(gl.VERTEX_SHADER, VS);
    const f = compile(gl.FRAGMENT_SHADER, FS);

    if (!v || !f) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, v);
    gl.attachShader(program, f);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("[growth field link]", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const locA = (name: string) =>
      gl!.getUniformLocation(program, `${name}[0]`) ||
      gl!.getUniformLocation(program, name);

    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uT = gl.getUniformLocation(program, "u_time");
    const uMou = gl.getUniformLocation(program, "u_mouse");
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

    if (uRip) gl.uniform2fv(uRip, ripXY);
    if (uRipT) gl.uniform1fv(uRipT, ripT);

    function nrm(clientX: number, clientY: number) {
      const rect = canvas!.getBoundingClientRect();

      return {
        x: (clientX - rect.left) / rect.width,
        y: 1 - (clientY - rect.top) / rect.height,
      };
    }

    function render(tSec: number, mx: number, my: number) {
      gl!.uniform1f(uT, tSec);
      gl!.uniform2f(uMou, mx, my);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas!.getBoundingClientRect();

      canvas!.width = Math.round(rect.width * dpr);
      canvas!.height = Math.round(rect.height * dpr);

      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);

      render(0, mouse.x, mouse.y);
    }

    let isVisible = false;

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false;
      },
      {
        threshold: 0,
        rootMargin: "200px 0px 200px 0px",
      },
    );

    observer.observe(section);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const onPointerMove = (e: PointerEvent) => {
      const p = nrm(e.clientX, e.clientY);

      target.x = p.x;
      target.y = p.y;

      lastMoveAt = performance.now();

      if (reduceMotion) {
        mouse.x = p.x;
        mouse.y = p.y;
        render(0, mouse.x, mouse.y);
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (reduceMotion) return;

      const p = nrm(e.clientX, e.clientY);
      const now = (performance.now() - t0) * 0.001;

      let idx = 0;
      let leastRemaining = Infinity;

      for (let i = 0; i < RIPS; i++) {
        const rippleTime = ripT[i] ?? -1000;

        if (rippleTime < now - 3.0) {
          idx = i;
          break;
        }

        const rem = rippleTime + 2.4 - now;

        if (rem < leastRemaining) {
          leastRemaining = rem;
          idx = i;
        }
      }

      ripXY[idx * 2] = p.x;
      ripXY[idx * 2 + 1] = p.y;
      ripT[idx] = now;

      if (uRip) gl!.uniform2fv(uRip, ripXY);
      if (uRipT) gl!.uniform1fv(uRipT, ripT);

      rippleEnd = performance.now() + 2400;
    };

    const onPointerLeave = () => {
      target.x = HOME.x;
      target.y = HOME.y;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") {
        target.x = HOME.x;
        target.y = HOME.y;
      }
    };

    section.addEventListener("pointermove", onPointerMove, {
      passive: true,
    });

    section.addEventListener("pointerdown", onPointerDown, {
      passive: true,
    });

    section.addEventListener("pointerleave", onPointerLeave);

    section.addEventListener("pointerup", onPointerUp, {
      passive: true,
    });

    resize();

    let raf = 0;
    let last = 0;
    let destroyed = false;

    function frame(t: number) {
      raf = requestAnimationFrame(frame);

      if (destroyed || !isVisible) return;

      const now = performance.now();
      const busy = now - lastMoveAt < 700 || now < rippleEnd;

      if (t - last < (busy ? 0 : 33.3)) return;

      last = t;

      mouse.x += (target.x - mouse.x) * 0.085;
      mouse.y += (target.y - mouse.y) * 0.085;

      render((t - t0) * 0.001, mouse.x, mouse.y);
    }

    if (!reduceMotion) {
      const play = () => {
        if (!raf) raf = requestAnimationFrame(frame);
      };

      const pause = () => {
        cancelAnimationFrame(raf);
        raf = 0;
      };

      const onVisibility = () =>
        document.hidden ? pause() : play();

      document.addEventListener(
        "visibilitychange",
        onVisibility,
      );

      play();

      return () => {
        destroyed = true;
        cancelAnimationFrame(raf);

        document.removeEventListener(
          "visibilitychange",
          onVisibility,
        );

        observer.disconnect();
        window.removeEventListener("resize", onResize);

        section.removeEventListener(
          "pointermove",
          onPointerMove,
        );

        section.removeEventListener(
          "pointerdown",
          onPointerDown,
        );

        section.removeEventListener(
          "pointerleave",
          onPointerLeave,
        );

        section.removeEventListener(
          "pointerup",
          onPointerUp,
        );
      };
    }

    return () => {
      destroyed = true;
      observer.disconnect();
      window.removeEventListener("resize", onResize);

      section.removeEventListener(
        "pointermove",
        onPointerMove,
      );

      section.removeEventListener(
        "pointerdown",
        onPointerDown,
      );

      section.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );

      section.removeEventListener(
        "pointerup",
        onPointerUp,
      );
    };
  }, [sectionRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      role="presentation"
      className={`pointer-events-none absolute inset-0 -z-10 h-full w-full ${
        className ?? ""
      }`}
    />
  );
}