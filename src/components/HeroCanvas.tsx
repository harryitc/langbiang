"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Nền Three.js cho Hero:
 * - Vầng trăng phát sáng
 * - Đom đóm / bụi sáng lơ lửng
 * - Lá & cánh hoa bay nhẹ
 * - Parallax theo con trỏ
 */
export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.z = 14;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // ---------- Vầng trăng ----------
    const moon = new THREE.Mesh(
      new THREE.CircleGeometry(2.4, 64),
      new THREE.MeshBasicMaterial({ color: 0xfff4cf, transparent: true, opacity: 0.95 })
    );
    moon.position.set(6, 4.5, -6);
    group.add(moon);

    // hào quang trăng
    const glowMat = new THREE.SpriteMaterial({
      map: makeGlowTexture(),
      color: 0xfff0c0,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glow = new THREE.Sprite(glowMat);
    glow.scale.set(14, 14, 1);
    glow.position.copy(moon.position);
    group.add(glow);

    // ---------- Đom đóm / bụi sáng ----------
    const fireflyCount = reduce ? 40 : 120;
    const fgeo = new THREE.BufferGeometry();
    const fpos = new Float32Array(fireflyCount * 3);
    const fspeed: number[] = [];
    for (let i = 0; i < fireflyCount; i++) {
      fpos[i * 3] = (Math.random() - 0.5) * 34;
      fpos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      fpos[i * 3 + 2] = (Math.random() - 0.5) * 12;
      fspeed.push(0.15 + Math.random() * 0.5);
    }
    fgeo.setAttribute("position", new THREE.BufferAttribute(fpos, 3));
    const firefly = new THREE.Points(
      fgeo,
      new THREE.PointsMaterial({
        size: 0.28,
        map: makeGlowTexture(),
        color: 0xfff2a8,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    group.add(firefly);

    // ---------- Lá / cánh hoa bay ----------
    const leafCount = reduce ? 14 : 40;
    const leaves: { mesh: THREE.Mesh; rot: number; drift: number }[] = [];
    const leafGeo = new THREE.CircleGeometry(0.22, 8);
    const leafColors = [0x7cc34a, 0x5cb85c, 0xa8e0f0, 0xffffff, 0xf5a623];
    for (let i = 0; i < leafCount; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: leafColors[i % leafColors.length],
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide,
      });
      const m = new THREE.Mesh(leafGeo, mat);
      m.position.set(
        (Math.random() - 0.5) * 34,
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 8
      );
      m.scale.setScalar(0.5 + Math.random() * 1.4);
      group.add(m);
      leaves.push({
        mesh: m,
        rot: (Math.random() - 0.5) * 0.04,
        drift: 0.01 + Math.random() * 0.03,
      });
    }

    // ---------- Parallax ----------
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer);

    const clock = new THREE.Clock();
    let frame = 0;

    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // firefly twinkle + drift
      const pos = fgeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < fireflyCount; i++) {
        const y = pos.getY(i) + Math.sin(t * fspeed[i] + i) * 0.006;
        pos.setY(i, y);
        pos.setX(i, pos.getX(i) + Math.cos(t * fspeed[i] + i) * 0.004);
      }
      pos.needsUpdate = true;
      (firefly.material as THREE.PointsMaterial).opacity =
        0.6 + Math.sin(t * 2) * 0.25;

      // leaves fall + rotate
      for (const l of leaves) {
        l.mesh.position.y -= l.drift;
        l.mesh.position.x += Math.sin(t + l.mesh.position.y) * 0.006;
        l.mesh.rotation.z += l.rot;
        if (l.mesh.position.y < -12) {
          l.mesh.position.y = 12;
          l.mesh.position.x = (Math.random() - 0.5) * 34;
        }
      }

      // parallax smoothing
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      group.rotation.y = pointer.x * 0.12;
      group.rotation.x = pointer.y * 0.08;
      camera.position.x = pointer.x * 0.8;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      leafGeo.dispose();
      fgeo.dispose();
      if (renderer.domElement.parentNode === mount)
        mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-0"
    />
  );
}

/** Tạo texture tròn phát sáng bằng canvas gradient */
function makeGlowTexture(): THREE.Texture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,244,207,0.9)");
  grad.addColorStop(1, "rgba(255,244,207,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}
