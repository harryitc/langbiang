"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor "đom đóm":
 * - Chấm sáng vàng bám sát con trỏ
 * - Vòng tròn bám theo có độ trễ (lerp)
 * - Vệt sparkle lấp lánh kéo theo khi di chuyển
 * - Phình to khi rê qua link / nút
 * Tự tắt trên thiết bị cảm ứng & khi prefers-reduced-motion.
 */
export default function Cursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isFine = window.matchMedia("(pointer: fine)").matches;
    if (isTouch || reduce || !isFine) return;

    const canvas = canvasRef.current!;
    const ring = ringRef.current!;
    const dot = dotRef.current!;
    const ctx = canvas.getContext("2d")!;

    document.body.classList.add("has-custom-cursor");

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const mouse = { x: w / 2, y: h / 2, px: w / 2, py: h / 2 };
    const ringPos = { x: w / 2, y: h / 2 };
    let hovering = false;
    let visible = false;

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      max: number;
      size: number;
      hue: number;
    };
    const particles: P[] = [];

    const colors = [
      [255, 242, 168], // vàng trăng
      [124, 195, 74], // xanh lá
      [168, 224, 240], // xanh trời
      [245, 166, 35], // cam nắng
    ];

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) {
        visible = true;
        ringPos.x = mouse.x;
        ringPos.y = mouse.y;
        ring.style.opacity = "1";
        dot.style.opacity = "1";
      }
      const dx = mouse.x - mouse.px;
      const dy = mouse.y - mouse.py;
      const speed = Math.hypot(dx, dy);
      // sinh sparkle theo tốc độ di chuyển
      const count = Math.min(4, Math.floor(speed / 6));
      for (let i = 0; i < count; i++) {
        const c = colors[(Math.random() * colors.length) | 0];
        particles.push({
          x: mouse.x + (Math.random() - 0.5) * 8,
          y: mouse.y + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2 - 0.3,
          life: 0,
          max: 45 + Math.random() * 30,
          size: 1.5 + Math.random() * 2.5,
          hue: (c[0] << 16) | (c[1] << 8) | c[2],
        });
      }
      mouse.px = mouse.x;
      mouse.py = mouse.y;
    };

    const onOver = (e: Event) => {
      const t = (e.target as HTMLElement).closest(
        'a, button, input, textarea, select, [role="button"]'
      );
      hovering = !!t;
    };

    const onLeave = () => {
      ring.style.opacity = "0";
      dot.style.opacity = "0";
      visible = false;
    };
    const onDown = () => ring.classList.add("cursor-down");
    const onUp = () => ring.classList.remove("cursor-down");

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);

      // ring lerp
      ringPos.x += (mouse.x - ringPos.x) * 0.16;
      ringPos.y += (mouse.y - ringPos.y) * 0.16;
      const scale = hovering ? 1.9 : 1;
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%) scale(${scale})`;
      dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%, -50%)`;

      // particles
      ctx.clearRect(0, 0, w, h);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.012; // rơi nhẹ
        p.vx *= 0.98;
        const t = p.life / p.max;
        if (t >= 1) {
          particles.splice(i, 1);
          continue;
        }
        const alpha = Math.sin((1 - t) * Math.PI) * 0.9;
        const r = (p.hue >> 16) & 255;
        const g = (p.hue >> 8) & 255;
        const b = p.hue & 255;
        const size = p.size * (1 - t * 0.5);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 3);
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[10010]"
      />
      <div
        ref={ringRef}
        aria-hidden
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[10011] h-9 w-9 rounded-full border-2 border-leaf-deep/70 opacity-0 mix-blend-multiply transition-[opacity,border-color] duration-200"
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[10012] h-2 w-2 rounded-full bg-sun opacity-0 shadow-[0_0_10px_3px_rgba(245,166,35,0.7)]"
      />
    </>
  );
}
