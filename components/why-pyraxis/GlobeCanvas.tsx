"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/providers/AnimationProvider";
import { usePerformanceTierOnly } from "@/providers/PerformanceProvider";

/**
 * Glowing purple wireframe-style Earth for the Why-PYRAXIS ("How We Build")
 * section. Ported 1:1 from the standalone Room-09 reference (vanilla
 * Three.js + custom GLSL) into this codebase's canvas-component pattern
 * (see HeroLogoCanvas.tsx): own <canvas>, own IntersectionObserver gate,
 * cleanup on unmount.
 *
 * NOTE: this is the one section in the app with a real WebGL canvas — every
 * other effect here runs on the shared 2D ParticleEngine
 * (ai/context/09-particle-engine.md: "sections never mount their own
 * canvas"). A rotating textured sphere needs actual 3D, so it's a deliberate,
 * isolated exception rather than an extension of that engine.
 *
 * Drag-to-rotate: the globe is the pointer target, not the overlay text.
 * WhyPyraxis.tsx sets the text wrapper to pointer-events-none (except its
 * CTA link) so drags anywhere in the section — including "through" the
 * headline — reach this canvas.
 */

const MAIN = 0x7b61ff; // globe base (uColor)
const MID = 0x7b61ff; // mid-tone
const HIGHLIGHT = 0x7b61ff; // highlight
const OUTER_GLOW = 0x7b61ff; // atmosphere/rim (uColor)
const SHADOW = 0x030305; // near-black void, ~vec3(0.01,0.01,0.02)

type GlobeCanvasProps = {
  /** Section element to watch for scroll progress + visibility. */
  sectionRef: React.RefObject<HTMLElement | null>;
  className?: string;
};

export default function GlobeCanvas({ sectionRef, className }: GlobeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const tier = usePerformanceTierOnly();

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const isLowTier = tier === "mobile";
    const segments = isLowTier ? 32 : 48;

    let isVisible = false;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let baseRotX = 0;
    let baseRotY = 0;
    let mouseOffsetX = 0;
    let mouseOffsetY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let raf = 0;
    let destroyed = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight || 1, 0.1, 100);
    camera.position.z = 8.0;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowTier ? 1 : 1.5));
    const clock = new THREE.Clock();

    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = "anonymous";
    const earthTexture = textureLoader.load("https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg");

    const globeGeo = new THREE.SphereGeometry(1.9, segments, segments);
    const globeMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMain: { value: new THREE.Color(MAIN) },
        uMid: { value: new THREE.Color(MID) },
        uHighlight: { value: new THREE.Color(HIGHLIGHT) },
        uGlow: { value: new THREE.Color(OUTER_GLOW) },
        uShadow: { value: new THREE.Color(SHADOW) },
        uTexture: { value: earthTexture },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uMain;
        uniform vec3 uMid;
        uniform vec3 uHighlight;
        uniform vec3 uGlow;
        uniform vec3 uShadow;
        uniform sampler2D uTexture;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main() {
          vec3 mapColor = texture2D(uTexture, vUv).rgb;
          float luminance = (mapColor.r + mapColor.g + mapColor.b) / 3.0;
          float landMask = smoothstep(0.15, 0.4, luminance);

          vec3 col = mix(vec3(0.01, 0.01, 0.02), uMain, landMask);

          vec3 lightDir = normalize(vec3(0.5, 0.3, 1.0));
          float lit = max(dot(vNormal, lightDir), 0.0);
          col = mix(col, uMid, lit * landMask * 0.6);

          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float fresnel = 1.0 - max(dot(vNormal, viewDir), 0.0);
          float fresnelPow = pow(fresnel, 2.5);
          col += mix(uHighlight, uGlow, fresnel) * fresnelPow * 1.1;

          float pulse = sin(uTime * 0.5) * 0.03 + 0.97;
          col *= pulse;

          gl_FragColor = vec4(col, 1.0);
        }
      `,
      transparent: true,
    });

    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    const atmGeo = new THREE.SphereGeometry(2.15, segments, segments);
    const atmMat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(OUTER_GLOW) } },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.5);
          gl_FragColor = vec4(uColor, 1.0) * intensity * 0.6;
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
    const atmosphere = new THREE.Mesh(atmGeo, atmMat);
    scene.add(atmosphere);

    const sizeRenderer = () => {
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    sizeRenderer();
    canvas.classList.add("opacity-0");
    const revealTimer = window.setTimeout(() => {
      canvas.classList.remove("opacity-0");
    }, 300);

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = !!entry?.isIntersecting;
    }, { threshold: 0 });
    observer.observe(section);

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const onMouseDown = (e: MouseEvent) => {
      if (!isVisible) return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onDragMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      baseRotY += dx * 0.005;
      baseRotX += dy * 0.005;
      baseRotX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, baseRotX));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseUp = () => {
      isDragging = false;
    };
    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onMouseUp);

    // Touch drag parity (canvas already has pointer-events-auto).
    const onTouchStart = (e: TouchEvent) => {
      if (!isVisible || !e.touches[0]) return;
      isDragging = true;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !e.touches[0]) return;
      const dx = e.touches[0].clientX - prevMouseX;
      const dy = e.touches[0].clientY - prevMouseY;
      baseRotY += dx * 0.005;
      baseRotX += dy * 0.005;
      baseRotX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, baseRotX));
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };
    const onTouchEnd = () => {
      isDragging = false;
    };
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);

    const onResize = () => sizeRenderer();
    window.addEventListener("resize", onResize);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (destroyed) return;
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      if (reducedMotion) {
        mouseOffsetX += (0 - mouseOffsetX) * 0.1;
        mouseOffsetY += (0 - mouseOffsetY) * 0.1;
      } else if (isDragging) {
        mouseOffsetX += (0 - mouseOffsetX) * 0.1;
        mouseOffsetY += (0 - mouseOffsetY) * 0.1;
      } else {
        baseRotY += 0.0015;
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (mouseX - cx) / cx;
        const dy = (mouseY - cy) / cy;
        mouseOffsetY += (dx * 0.5 - mouseOffsetY) * 0.1;
        mouseOffsetX += (dy * 0.3 - mouseOffsetX) * 0.1;
      }

      const targetRotY = baseRotY + mouseOffsetY;
      const targetRotX = baseRotX + mouseOffsetX;
      currentRotY += (targetRotY - currentRotY) * 0.15;
      currentRotX += (targetRotX - currentRotX) * 0.15;
      globe.rotation.y = currentRotY;
      globe.rotation.x = currentRotX;

      if (!reducedMotion) {
        camera.position.x = Math.sin(elapsed * 0.1) * 0.15;
        camera.position.y = Math.cos(elapsed * 0.08) * 0.1;
      }

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh && rect.bottom > 0) {
        const progress = Math.min(1, Math.max(0, (vh - rect.top) / (rect.height + vh)));
        camera.position.z = 8.0 - progress * 3.5;
      }
      camera.lookAt(0, 0, 0);

      if (globeMat.uniforms.uTime) globeMat.uniforms.uTime.value = elapsed;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      clearTimeout(revealTimer);
      observer.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousemove", onDragMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      globeGeo.dispose();
      globeMat.dispose();
      atmGeo.dispose();
      atmMat.dispose();
      earthTexture.dispose();
      renderer.dispose();
    };
  }, [sectionRef, reducedMotion, tier]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      role="presentation"
      className={`pointer-events-auto cursor-grab touch-none transition-opacity duration-[2000ms] ease-out active:cursor-grabbing ${className ?? ""}`}
    />
  );
}
