"use client";

import React, { useRef, useState } from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { springs } from "@/lib/motion";

interface SpotlightCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(13, 104, 59, 0.12)",
  style,
  ...props
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -3, transition: springs.snappy }}
      style={{
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
      className={className}
      {...props}
    >
      {/* 21st.dev Dynamic Spotlight Halo */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          opacity,
          transition: "opacity 300ms ease",
          background: `radial-gradient(450px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
          zIndex: 1,
        }}
        aria-hidden="true"
      />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </motion.div>
  );
}
