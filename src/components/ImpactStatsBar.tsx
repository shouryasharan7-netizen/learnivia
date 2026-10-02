"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

interface StatItem {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  sublabel: string;
  color: string;
}

const STATS: StatItem[] = [
  {
    value: 12400,
    suffix: "+",
    label: "Sessions Completed",
    sublabel: "1-on-1 peer sessions delivered free",
    color: "#34D399",
  },
  {
    value: 47,
    suffix: "",
    label: "Countries Reached",
    sublabel: "Students learning from every continent",
    color: "#60A5FA",
  },
  {
    value: 380,
    suffix: "+",
    label: "Volunteer Tutors",
    sublabel: "Vetted, PVSA-recognized mentors",
    color: "#F472B6",
  },
  {
    value: 0,
    suffix: "",
    prefix: "$",
    label: "Cost to Students",
    sublabel: "Always free — no credit card, ever",
    color: "#FBBF24",
  },
];

function useCountUp(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (target === 0) { setCount(0); return; }
    const start = performance.now();
    const update = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(update);
      else setCount(target);
    };
    requestAnimationFrame(update);
  }, [target, duration, active]);
  return count;
}

function StatCard({ stat, active, index }: { stat: StatItem; active: boolean; index: number }) {
  const count = useCountUp(stat.value, 1600 + index * 150, active);
  const display = stat.value === 0 ? "0" : count.toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{
        flex: "1 1 200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "2rem 1.5rem",
        background: "rgba(255,255,255,0.04)",
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-30px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: stat.color,
          opacity: 0.1,
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          fontSize: "clamp(2.4rem, 4vw, 3.2rem)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: stat.color,
          lineHeight: 1,
          marginBottom: "0.4rem",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {stat.prefix ?? ""}{display}{stat.suffix}
      </div>
      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", marginBottom: "0.25rem" }}>
        {stat.label}
      </div>
      <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>
        {stat.sublabel}
      </div>
    </motion.div>
  );
}

export default function ImpactStatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      style={{
        background: "linear-gradient(135deg, #0a1628 0%, #0f2027 50%, #0a1628 100%)",
        padding: "5rem 2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />
      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <span
            style={{
              display: "inline-block",
              fontFamily: "ui-monospace, monospace",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#34D399",
              background: "rgba(52,211,153,0.1)",
              border: "1px solid rgba(52,211,153,0.25)",
              borderRadius: "9999px",
              padding: "0.3rem 0.9rem",
              marginBottom: "1rem",
            }}
          >
            By the numbers
          </span>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
              fontWeight: 800,
              color: "#fff",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Real impact. Zero dollars.
          </h2>
        </motion.div>

        <div
          ref={ref}
          style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", justifyContent: "center" }}
        >
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} active={inView} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
