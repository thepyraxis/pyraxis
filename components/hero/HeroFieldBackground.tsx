"use client";

import { useEffect, useRef } from "react";

/**
 * Ported straight from reference HTML's WebGL "field" background.
 * Pointer = lens (gaussian mag of sample coords). Click = wave, pool of 5
 * slots (origin+birth-time only), age derived from u_time each frame so
 * waves live their ~2.4s independently and can overlap. New click never
 * kills a live one unless all 5 slots are busy (then steals the one with
 * least life left).
 *
 * Driver hardening kept from source:
 *  - array uniform locations queried as "name[0]" first (bare name
 *    rejected by some drivers -> silently drops uploads if not checked);
 *  - band edge uses 1-smoothstep(lo,hi,x), never a reversed-edge smoothstep;
 *  - wave distance clamped before squaring (true-fp16 mediump GPUs could
 *    overflow age*age to inf/NaN and poison the frame).
 *
 * No-WebGL / prefers-reduced-motion: renders a single static frame (or
 * nothing) instead of animating — never a blocking failure.
 */
export default function HeroFieldBackground({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;

    const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = cv.getContext("webgl", {
        alpha: true,
        antialias: false,
        depth: false,
      });
    } catch {
      gl = null;
    }

    if (!gl) return;

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
      " gl_FragColor=vec4(vec3(topo*vig),topo*vig);",
      "}",
    ].join("\n");

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);

      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.warn("[field shader]", gl!.getShaderInfoLog(s));
        return null;
      }

      return s;
    }

    const v = compile(gl.VERTEX_SHADER, VS);
    const f = compile(gl.FRAGMENT_SHADER, FS);

    if (!v || !f) return;

    const pr = gl.createProgram()!;
    gl.attachShader(pr, v);
    gl.attachShader(pr, f);
    gl.linkProgram(pr);

    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
      console.warn("[field link]", gl.getProgramInfoLog(pr));
      return;
    }

    gl.useProgram(pr);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(pr, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    function locA(name: string) {
      return (
        gl!.getUniformLocation(pr, name + "[0]") ||
        gl!.getUniformLocation(pr, name)
      );
    }

    const uRes = gl.getUniformLocation(pr, "u_resolution");
    const uT = gl.getUniformLocation(pr, "u_time");
    const uMou = gl.getUniformLocation(pr, "u_mouse");
    const uRip = locA("u_rip");
    const uRipT = locA("u_ripT");

    const HOME = { x: 0.5, y: 0.45 };

    const mouse = {
      x: HOME.x,
      y: HOME.y,
    };

    const target = {
      x: HOME.x,
      y: HOME.y,
    };

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

    function nrm(e: PointerEvent) {
      const r = cv!.getBoundingClientRect();

      return {
        x: (e.clientX - r.left) / r.width,
        y: 1 - (e.clientY - r.top) / r.height,
      };
    }

    function render(tSec: number, mx: number, my: number) {
      gl!.uniform1f(uT, tSec);
      gl!.uniform2f(uMou, mx, my);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = cv!.getBoundingClientRect();

      cv!.width = Math.round(rect.width * dpr);
      cv!.height = Math.round(rect.height * dpr);

      gl!.viewport(0, 0, cv!.width, cv!.height);
      gl!.uniform2f(uRes, cv!.width, cv!.height);

      render(0, mouse.x, mouse.y);
    }

    function onPointerMove(e: PointerEvent) {
      const p = nrm(e);

      target.x = p.x;
      target.y = p.y;
      lastMoveAt = performance.now();

      if (RM) {
        mouse.x = p.x;
        mouse.y = p.y;
        render(0, mouse.x, mouse.y);
      }
    }

    function onPointerDown(e: PointerEvent) {
      if (RM) return;

      const p = nrm(e);
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

      if (uRip) {
        gl!.uniform2fv(uRip, ripXY);
      }

      if (uRipT) {
        gl!.uniform1fv(uRipT, ripT);
      }

      rippleEnd = performance.now() + 2400;
    }

    function onMouseLeave() {
      target.x = HOME.x;
      target.y = HOME.y;
    }

    function onPointerUp(e: PointerEvent) {
      if (e.pointerType !== "mouse") {
        target.x = HOME.x;
        target.y = HOME.y;
      }
    }

    if (uRip) {
      gl.uniform2fv(uRip, ripXY);
    }

    if (uRipT) {
      gl.uniform1fv(uRipT, ripT);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    resize();

    cv.addEventListener("pointermove", onPointerMove, {
      passive: true,
    });

    cv.addEventListener("pointerdown", onPointerDown, {
      passive: true,
    });

    cv.addEventListener("mouseleave", onMouseLeave);

    cv.addEventListener("pointerup", onPointerUp, {
      passive: true,
    });

    if (RM) {
      return () => {
        ro.disconnect();

        cv.removeEventListener("pointermove", onPointerMove);
        cv.removeEventListener("pointerdown", onPointerDown);
        cv.removeEventListener("mouseleave", onMouseLeave);
        cv.removeEventListener("pointerup", onPointerUp);
      };
    }

    let last = 0;
    let raf = 0;

    function frame(t: number) {
      raf = requestAnimationFrame(frame);

      const now = performance.now();
      const busy = now - lastMoveAt < 700 || now < rippleEnd;

      if (t - last < (busy ? 0 : 33.3)) return;

      last = t;

      mouse.x += (target.x - mouse.x) * 0.085;
      mouse.y += (target.y - mouse.y) * 0.085;

      render((t - t0) * 0.001, mouse.x, mouse.y);
    }

    function play() {
      if (!raf) {
        raf = requestAnimationFrame(frame);
      }
    }

    function pause() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    function onVisibility() {
      document.hidden ? pause() : play();
    }

    document.addEventListener("visibilitychange", onVisibility);

    play();

    return () => {
      pause();
      ro.disconnect();

      document.removeEventListener("visibilitychange", onVisibility);

      cv.removeEventListener("pointermove", onPointerMove);
      cv.removeEventListener("pointerdown", onPointerDown);
      cv.removeEventListener("mouseleave", onMouseLeave);
      cv.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}