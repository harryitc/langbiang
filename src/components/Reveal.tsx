"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: number;
  /** animate direct children instead of the wrapper itself */
  childrenStagger?: boolean;
  once?: boolean;
  id?: string;
};

export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  y = 35,
  stagger = 0.1,
  childrenStagger = false,
  once = true,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const el = ref.current;
      if (!el) return;

      const targets = childrenStagger
        ? (Array.from(el.children) as HTMLElement[])
        : [el];

      // Đặt GPU hint tạm thời để animation mượt 60-120 FPS
      gsap.set(targets, { opacity: 0, y, willChange: "transform, opacity" });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay,
        stagger: childrenStagger ? stagger : 0,
        ease: "power2.out",
        onComplete: () => {
          // Xóa willChange để giải phóng bộ nhớ GPU sau khi hiện xong
          gsap.set(targets, { clearProps: "willChange" });
        },
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
          once,
        },
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref as never} className={className} id={id}>
      {children}
    </Tag>
  );
}

