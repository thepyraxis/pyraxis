"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Glowing topographic wave/terrain background for "The Real Problem"
 * section. Faithful port of the reference doc's vanilla-JS Three.js scene
 * (points grid + concentric rings driven by the same GLSL wave function,
 * scroll-linked camera flyover, scroll-linked opacity fade).
 *
 * NOTE — deliberate override: MASTER_MOTION_BIBLE Part A §4 / Part B
 * "Lighting Rules" states Problem earns zero glow ("the section is
 * deliberately the least attractive-looking in the site"). This
 * component is an explicit, admin-approved exception to that rule for
 * this one visual — added on direct instruction, not a violation to be
 * "fixed" later. If revisiting section tone, start here.
 */

const WAVE_FN_GLSL = `
  float getWave(vec3 p, float time) {
    float h = 0.0;
    h += sin(p.x * 0.10 + time * 0.5) * 3.0;
    h += sin(p.z * 0.15 - time * 0.4) * 2.5;
    h += sin((p.x + p.z) * 0.20 + time * 0.6) * 1.5;
    h += sin((p.x - p.z) * 0.30 - time * 0.7) * 1.0;
    return h;
  }
`;

type ProblemWaveBackgroundProps = {
  sectionRef: React.RefObject<HTMLElement | null>;
  className?: string;
};

export default function ProblemWaveBackground({ sectionRef, className }: ProblemWaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    let isVisible = false;
    let raf = 0;
    let destroyed = false;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(65, canvas.clientWidth / canvas.clientHeight || 1, 0.1, 1000);
    camera.position.set(0, 12, 40);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    const clock = new THREE.Clock();

    const size = 300;
    const res = 140;

    const terrainGeo = new THREE.PlaneGeometry(size, size, res - 1, res - 1);
    terrainGeo.rotateX(-Math.PI / 2);

    const terrainMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        varying float vElevation;
        varying vec3 vPos;
        ${WAVE_FN_GLSL}
        void main() {
          vec3 pos = position;
          pos.y = getWave(pos, uTime);
          vElevation = pos.y;
          vPos = pos;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = (3.0 * 50.0 / -mvPosition.z) * uPixelRatio;
        }
      `,
      fragmentShader: `
        precision highp float;
        varying float vElevation;
        varying vec3 vPos;
        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float dist = length(uv);
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, dist);

          vec3 darkViolet = vec3(0.02, 0.0, 0.08);
          vec3 purple = vec3(0.2, 0.1, 0.6);
          vec3 magenta = vec3(0.482, 0.380, 1.0);
          vec3 white = vec3(0.9, 0.85, 1.0);

          vec3 col = mix(darkViolet, purple, smoothstep(-1.0, 2.0, vElevation));
          col = mix(col, magenta, smoothstep(2.0, 5.0, vElevation));
          col = mix(col, white, smoothstep(5.0, 7.0, vElevation));

          float centerDist = length(vPos.xz);
          float centerGlow = 1.0 - smoothstep(0.0, 30.0, centerDist);
          col += vec3(0.4, 0.3, 0.9) * centerGlow;

          float fog = smoothstep(30.0, 120.0, length(vPos.xz));
          col = mix(col, vec3(0.02, 0.02, 0.02), fog);
          alpha *= (1.0 - fog);

          gl_FragColor = vec4(col, alpha * 0.8);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const terrainPoints = new THREE.Points(terrainGeo, terrainMaterial);
    const terrainGroup = new THREE.Group();
    terrainGroup.position.y = -5;
    terrainGroup.add(terrainPoints);

    const ringCount = 10;
    const ringSegments = 64;
    const ringPositions: number[] = [];
    for (let r = 1; r <= ringCount; r++) {
      const radius = r * 4.0;
      for (let i = 0; i < ringSegments; i++) {
        const angle1 = (i / ringSegments) * Math.PI * 2;
        const angle2 = ((i + 1) / ringSegments) * Math.PI * 2;
        ringPositions.push(Math.cos(angle1) * radius, 0, Math.sin(angle1) * radius);
        ringPositions.push(Math.cos(angle2) * radius, 0, Math.sin(angle2) * radius);
      }
    }

    const ringGeo = new THREE.BufferGeometry();
    ringGeo.setAttribute("position", new THREE.Float32BufferAttribute(ringPositions, 3));

    const ringMaterial = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        uniform float uTime;
        varying float vDist;
        varying float vRadius;
        ${WAVE_FN_GLSL}
        void main() {
          vec3 pos = position;
          pos.y = getWave(pos, uTime);
          vDist = length(pos.xz);
          vRadius = length(position.xz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying float vDist;
        varying float vRadius;
        uniform float uTime;
        void main() {
          float pulse = sin(uTime * 1.0 - vRadius * 0.2) * 0.5 + 0.5;
          vec3 color = mix(vec3(0.482, 0.380, 1.0), vec3(1.0, 1.0, 1.0), 1.0 - smoothstep(0.0, 30.0, vDist));
          float alpha = (1.0 - smoothstep(10.0, 40.0, vDist)) * pulse * 0.8;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const terrainRings = new THREE.LineSegments(ringGeo, ringMaterial);
    terrainGroup.add(terrainRings);
    scene.add(terrainGroup);

    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0]?.isIntersecting ?? false;
    }, { threshold: 0, rootMargin: "100px 0px 100px 0px" });
    observer.observe(section);

    const onResize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight || 1;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const glow = glowRef.current;
    let scrollScheduled = false;
    const applyScroll = () => {
      scrollScheduled = false;
      const vh = window.innerHeight;
      const rect = section.getBoundingClientRect();

      if (rect.top < vh && rect.bottom > 0) {
        const progress = Math.min(1, Math.max(0, (vh - rect.top) / (rect.height + vh)));
        camera.position.y = 12 - progress * 18;
        camera.position.z = 40 - progress * 25;
        camera.lookAt(0, 0, 0);

        if (glow) {
          glow.style.opacity = String(progress * 0.7);
          glow.style.transform = `translate(-50%, -50%) scale(${0.8 + progress * 0.3})`;
        }
        canvas.style.opacity = String(Math.min(1, progress * 1.5));
      } else {
        canvas.style.opacity = "0";
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
      const elapsed = clock.getElapsedTime() * 0.2;
      if (terrainMaterial.uniforms.uTime) terrainMaterial.uniforms.uTime.value = elapsed;
      if (ringMaterial.uniforms.uTime) ringMaterial.uniforms.uTime.value = elapsed;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      terrainGeo.dispose();
      terrainMaterial.dispose();
      ringGeo.dispose();
      ringMaterial.dispose();
      renderer.dispose();
    };
  }, [sectionRef]);

  return (
    <>
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[80vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 opacity-0 will-change-[opacity,transform]"
        style={{
          background: "radial-gradient(circle, rgba(123,97,255,0.10) 0%, transparent 60%)",
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        role="presentation"
        className={`pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000 ease-linear ${className ?? ""}`}
      />
    </>
  );
}
