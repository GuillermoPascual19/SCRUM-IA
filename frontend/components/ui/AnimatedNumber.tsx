"use client";

import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

interface Props {
  value: number;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({ value, duration = 0.8, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => { el.textContent = String(Math.round(v)); },
    });
    return controls.stop;
  }, [value, duration]);

  return <span ref={ref} className={className}>0</span>;
}
