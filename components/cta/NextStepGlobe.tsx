"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Real WebGL globe for CTA ("The Next Step"). This is a faithful port of
 * the reference doc's vanilla-JS globe (window-level drag, scroll-zoom,
 * fade-in-on-load) into a React/Next component — same structure, same
 * math, not a reinterpretation.
 *
 * Color table below is a STARTING POINT set by the admin (Arpan), not a
 * locked rule. The admin can edit MAIN / HIGHLIGHT / OUTER_GLOW / SHADOW
 * directly, any time, no spec/bible sign-off needed — no doc in this
 * project should ever block a direct color edit here again.
 *
 *   Main       #403090  -> base landGlow color (doc's uColor)
 *   Highlight  #7860F0  -> lit-side boost (doc's `lit` term)
 *   Outer glow #8A6BFF  -> fresnel rim glow (doc's rim term)
 *   Dark shadow#181830  -> base void/ocean color (doc's darkVoid)
 *   Background #000000  -> page background behind canvas (canvas is alpha:true)
 */

const MAIN = 0x403090;
const HIGHLIGHT = 0x7860f0;
const OUTER_GLOW = 0x8a6bff;
const SHADOW = 0x181830;

type NextStepGlobeProps = {
  sectionRef: React.RefObject<HTMLElement | null>;
  className?: string;
};

export default function NextStepGlobe({ sectionRef, className }: NextStepGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    let isVisible = false;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let baseRotX = 0;
    let baseRotY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let mouseOffsetX = 0;
    let mouseOffsetY = 0;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let raf = 0;
    let destroyed = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight || 1, 0.1, 100);
    camera.position.z = 8.0;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    const clock = new THREE.Clock();

    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = "anonymous";
    const earthTexture = textureLoader.load("https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg");

    const globeGeo = new THREE.SphereGeometry(1.6, 48, 48);
    const globeMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(MAIN) },
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
        uniform vec3 uColor;
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

          vec3 darkVoid = uShadow;
          vec3 landGlow = uColor * 0.45 + vec3(0.05, 0.05, 0.1);
          vec3 col = mix(darkVoid, landGlow, landMask);

          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float fresnel = 1.0 - max(dot(vNormal, viewDir), 0.0);
          fresnel = pow(fresnel, 2.5);
          col += uGlow * fresnel * 1.1;

          vec3 lightDir = normalize(vec3(0.5, 0.3, 1.0));
          float lit = max(dot(vNormal, lightDir), 0.0);
          col += uHighlight * 0.05 * lit * landMask;

          float pulse = sin(uTime * 0.5) * 0.03 + 0.97;
          col *= pulse;

          gl_FragColor = vec4(col, 1.0);
        }
      `,
      transparent: true,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    const atmGeo = new THREE.SphereGeometry(1.85, 48, 48);
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

    const revealTimer = window.setTimeout(() => {
      canvas.classList.add("opacity-100");
      canvas.classList.remove("opacity-0");
    }, 300);

    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0]?.isIntersecting ?? false;
    }, { threshold: 0 });
    observer.observe(section);

    const onMouseMoveGlobal = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMoveGlobal);

    const onMouseDown = (e: MouseEvent) => {
      if (!isVisible) return;
      const target = e.target as HTMLElement;
      if (target.closest("a, button")) return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      document.body.style.userSelect = "none";
      document.body.style.cursor = "grabbing";
    };
    const onMouseMoveDrag = (e: MouseEvent) => {
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
      if (isDragging) {
        isDragging = false;
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      }
    };
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMoveDrag);
    window.addEventListener("mouseup", onMouseUp);

    const onTouchStart = (e: TouchEvent) => {
      if (!isVisible || !e.touches[0]) return;
      const target = e.target as HTMLElement;
      if (target.closest("a, button")) return;
      isDragging = true;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
      document.body.style.userSelect = "none";
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
      document.body.style.userSelect = "";
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    const onResize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight || 1;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let scrollScheduled = false;
    const applyScroll = () => {
      scrollScheduled = false;
      const vh = window.innerHeight;
      const rect = section.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        const progress = Math.min(1, Math.max(0, (vh - rect.top) / (rect.height + vh)));
        camera.position.z = 8.0 - progress * 3.5;
      }
    };
    const onScroll = () => {
      if (scrollScheduled) return;
      scrollScheduled = true;
      requestAnimationFrame(applyScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    applyScroll();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (destroyed || !isVisible) return;

      const elapsed = clock.getElapsedTime();

      if (isDragging) {
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

      targetRotY = baseRotY + mouseOffsetY;
      targetRotX = baseRotX + mouseOffsetX;
      currentRotY += (targetRotY - currentRotY) * 0.15;
      currentRotX += (targetRotX - currentRotX) * 0.15;
      globe.rotation.y = currentRotY;
      globe.rotation.x = currentRotX;

      camera.position.x = Math.sin(elapsed * 0.1) * 0.15;
      camera.position.y = Math.cos(elapsed * 0.08) * 0.1;
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
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMouseMoveGlobal);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMoveDrag);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      globeGeo.dispose();
      globeMat.dispose();
      atmGeo.dispose();
      atmMat.dispose();
      earthTexture.dispose();
      renderer.dispose();
    };
  }, [sectionRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      role="presentation"
      className={`pointer-events-none opacity-0 transition-opacity duration-[2000ms] ease-out ${className ?? ""}`}
    />
  );
}
