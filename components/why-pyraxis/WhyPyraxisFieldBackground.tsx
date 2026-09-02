"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/providers/AnimationProvider";

/**
 * Interactive contour-line field for the Why-PYRAXIS section background.
 * Ported from the standalone NexusNode reference page (raw WebGL, no
 * three.js): a single fullscreen triangle running one fragment shader that
 * draws simplex-noise contour bands, tinted to the site's purple accent
 * instead of the reference's monochrome white.
 *
 * The pointer is a lens — sampling coordinates are magnified inside a
 * gaussian falloff around a smoothed cursor position, so contour bands
 * crowd and brighten toward it. A click drops an outward-travelling ripple
 * that displaces the bands for ~2.4s and then is gone.
 *
 * Deliberately conservative after the ProblemWaveBackground incident (a
 * three.js scene that kept rendering full-scene geometry every frame
 * regardless of visibility hung the page on weaker GPUs):
 *  - raw WebGL fullscreen-quad shader, not a scene graph — one draw call
 *    per frame, no geometry, no textures.
 *  - IntersectionObserver gates the rAF loop off entirely once the section
 *    scrolls out of view, not just faded via opacity.
 *  - tab-hidden pauses the loop (visibilitychange).
 *  - full frame rate only while the pointer is actively moving over the
 *    section or a ripple is alive; otherwise throttled to 30fps, since the
 *    idle drift is glacial.
 *  - DPR capped at 2.
 *  - reduced motion: no rAF loop at all — a single static frame, redrawn
 *    only on pointer move (direct manipulation, not autonomous motion),
 *    and no click ripple.
 * Gated behind desktop tier only via ResponsiveCanvas at the call site.
 */

const VS = "attribute vec2 a_position;void main(){gl_Position=vec4(a_position,0.,1.);}";

const FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_ripple;
uniform float u_rippleT;
uniform vec3 u_tint;
vec3 permute(vec3 x){return mod(((x*34.0)+1.0)*x,289.0);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod(i,289.0);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m;m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;vec3 h=abs(x)-0.5;vec3 ox=floor(x+0.5);
  vec3 a0=x-ox;m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution;
  vec2 st=uv;st.x*=u_resolution.x/u_resolution.y;
  vec2 m=u_mouse;m.x*=u_resolution.x/u_resolution.y;
  vec2 rp=u_ripple;rp.x*=u_resolution.x/u_resolution.y;
  vec2 toM=st-m;
  float inf=exp(-dot(toM,toM)*5.0);
  vec2 lens=m+toM*(1.0+inf*0.55);
  float age=u_time-u_rippleT;
  float amp=clamp(1.0-age/2.4,0.0,1.0);
  vec2 toR=st-rp;
  float w=(length(toR)-age*0.32)*16.0;
  float ring=exp(-w*w)*amp;
  vec2 np=lens*1.4+vec2(u_time*0.015,u_time*0.025);
  float n=snoise(np)*0.5+0.5+ring*0.85;
  float tri=abs(fract(n*10.0)-0.5)*2.0;
  float topo=smoothstep(0.02,0.0,tri)*0.40;
  topo*=1.0+inf*1.4+ring*1.6;
  vec2 vc=(uv-vec2(0.5,0.55))*vec2(u_resolution.x/u_resolution.y,1.0);
  float vig=smoothstep(1.05,0.32,length(vc));
  vig*=mix(0.5,1.0,smoothstep(0.0,0.22,uv.y));
  float a=topo*vig;
  gl_FragColor=vec4(u_tint*a, a);
}
`;

type Props = {
  sectionRef: React.RefObject<HTMLElement | null>;
  className?: string;
};

export default function WhyPyraxisFieldBackground({ sectionRef, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, depth: false });
    if (!gl) return;

    function compile(type: number, src: string) {
      const s = gl!.createShader(type);
      if (!s) return null;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) return null;
      return s;
    }
    const v = compile(gl.VERTEX_SHADER, VS);
    const f = compile(gl.FRAGMENT_SHADER, FS);
    if (!v || !f) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, v);
    gl.attachShader(program, f);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uRipple = gl.getUniformLocation(program, "u_ripple");
    const uRippleT = gl.getUniformLocation(program, "u_rippleT");
    const uTint = gl.getUniformLocation(program, "u_tint");
    // Site accent (purple-400/500 family), normalized 0-1.
    gl.uniform3f(uTint, 0.482, 0.38, 1.0);

    const HOME = { x: 0.5, y: 0.45 };
    const mouse = { x: HOME.x, y: HOME.y };
    const target = { x: HOME.x, y: HOME.y };
    const t0 = performance.now();
    let lastMoveAt = -1e9;
    let rippleEnd = 0;
    let isVisible = false;
    let destroyed = false;
    let raf = 0;
    let last = 0;

    function nrm(clientX: number, clientY: number) {
      const rect = section!.getBoundingClientRect();
      return {
        x: (clientX - rect.left) / rect.width,
        y: 1 - (clientY - rect.top) / rect.height,
      };
    }

    function render(tSec: number, mx: number, my: number) {
      gl!.uniform1f(uTime, tSec);
      gl!.uniform2f(uMouse, mx, my);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas!.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas!.clientHeight * dpr));
      canvas!.width = w;
      canvas!.height = h;
      gl!.viewport(0, 0, w, h);
      gl!.uniform2f(uRes, w, h);
      render(0, mouse.x, mouse.y);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    window.addEventListener("resize", resize);

    const onPointerMove = (e: PointerEvent) => {
      const p = nrm(e.clientX, e.clientY);
      target.x = p.x;
      target.y = p.y;
      lastMoveAt = performance.now();
      if (reducedMotion) {
        mouse.x = p.x;
        mouse.y = p.y;
        render((performance.now() - t0) * 0.001, mouse.x, mouse.y);
      }
    };
    section.addEventListener("pointermove", onPointerMove, { passive: true });

    const onPointerDown = (e: PointerEvent) => {
      if (reducedMotion) return;
      const p = nrm(e.clientX, e.clientY);
      gl!.uniform2f(uRipple, p.x, p.y);
      gl!.uniform1f(uRippleT, (performance.now() - t0) * 0.001);
      rippleEnd = performance.now() + 2400;
    };
    section.addEventListener("pointerdown", onPointerDown, { passive: true });

    const onPointerLeave = () => {
      target.x = HOME.x;
      target.y = HOME.y;
    };
    section.addEventListener("pointerleave", onPointerLeave);

    // Seed a dead ripple so the first frame doesn't render a live wave.
    gl.uniform2f(uRipple, HOME.x, HOME.y);
    gl.uniform1f(uRippleT, -1000);
    resize();

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0, rootMargin: "200px 0px 200px 0px" },
    );
    observer.observe(section);

    function frame(t: number) {
      raf = requestAnimationFrame(frame);
      if (destroyed || reducedMotion || !isVisible) return;
      const now = performance.now();
      const busy = now - lastMoveAt < 700 || now < rippleEnd;
      if (t - last < (busy ? 0 : 33.3)) return;
      last = t;
      mouse.x += (target.x - mouse.x) * 0.085;
      mouse.y += (target.y - mouse.y) * 0.085;
      render((t - t0) * 0.001, mouse.x, mouse.y);
    }

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf && !reducedMotion) {
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    if (!reducedMotion) {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      observer.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerdown", onPointerDown);
      section.removeEventListener("pointerleave", onPointerLeave);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
      gl.deleteShader(v);
      gl.deleteShader(f);
    };
  }, [sectionRef, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      role="presentation"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ""}`}
    />
  );
}
