"use client";

import React, { useRef, useEffect } from "react";
import type { CurriculumLevel } from "./CurriculumScrubber";

interface Props {
  level: CurriculumLevel;
  onSelectSubject?: (subject: string) => void;
}

interface Node {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  tutorsCount: number;
}

interface Packet {
  startNode: Node;
  endNode: Node;
  progress: number;
  speed: number;
}

export function KnowledgeReactorCanvas({ level, onSelectSubject }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 420);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 420;
    };
    window.addEventListener("resize", handleResize);

    // Initial Subject Nodes
    const subjects: Node[] = [
      { id: "math", name: "Calculus & Algebra", x: width * 0.25, y: height * 0.35, vx: 0.2, vy: -0.15, radius: 24, color: "#2DD4BF", tutorsCount: 18 },
      { id: "physics", name: "AP Physics C", x: width * 0.75, y: height * 0.3, vx: -0.2, vy: 0.2, radius: 22, color: "#38BDF8", tutorsCount: 12 },
      { id: "cs", name: "Python & Algorithms", x: width * 0.45, y: height * 0.75, vx: 0.15, vy: -0.1, radius: 26, color: "#34D399", tutorsCount: 15 },
      { id: "chem", name: "Chemistry & Bio", x: width * 0.8, y: height * 0.7, vx: -0.1, vy: -0.2, radius: 20, color: "#FBBF24", tutorsCount: 10 },
      { id: "writing", name: "Rhetoric & Literature", x: width * 0.15, y: height * 0.7, vx: 0.1, vy: 0.15, radius: 21, color: "#F472B6", tutorsCount: 14 },
    ];

    // Central Core Hub
    const coreHub: Node = {
      id: "core",
      name: "LEARNIVIA CORE",
      x: width * 0.5,
      y: height * 0.45,
      vx: 0,
      vy: 0,
      radius: 36,
      color: "#059669",
      tutorsCount: 69,
    };

    // Packets of learning energy
    const packets: Packet[] = [];
    const packetSpeedMultiplier = level === "OLYMPIAD" ? 1.8 : level === "BALANCED" ? 1.0 : 0.6;

    for (let i = 0; i < 8; i++) {
      const target = subjects[i % subjects.length];
      packets.push({
        startNode: coreHub,
        endNode: target,
        progress: Math.random(),
        speed: (0.005 + Math.random() * 0.005) * packetSpeedMultiplier,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      subjects.forEach((sub) => {
        const dx = clickX - sub.x;
        const dy = clickY - sub.y;
        if (Math.sqrt(dx * dx + dy * dy) <= sub.radius + 10) {
          if (onSelectSubject) onSelectSubject(sub.name);
        }
      });
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);

    // Animation Loop
    let angle = 0;
    const render = () => {
      angle += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Blueprint Grid Background Lines
      ctx.strokeStyle = "rgba(45, 212, 191, 0.05)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update & Draw Connection Lines
      subjects.forEach((sub) => {
        // Subtle drift physics
        sub.x += sub.vx;
        sub.y += sub.vy;
        if (sub.x < 50 || sub.x > width - 50) sub.vx *= -1;
        if (sub.y < 50 || sub.y > height - 50) sub.vy *= -1;

        // Mouse repulsion
        const mdx = sub.x - mouseX;
        const mdy = sub.y - mouseY;
        const dist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (dist < 80) {
          sub.x += (mdx / dist) * 1.5;
          sub.y += (mdy / dist) * 1.5;
        }

        // Draw spring connection to Core Hub
        ctx.beginPath();
        ctx.moveTo(coreHub.x, coreHub.y);
        ctx.lineTo(sub.x, sub.y);
        ctx.strokeStyle = "rgba(45, 212, 191, 0.2)";
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Update & Draw Flowing Energy Packets
      packets.forEach((p) => {
        p.progress += p.speed;
        if (p.progress >= 1) p.progress = 0;

        const px = p.startNode.x + (p.endNode.x - p.startNode.x) * p.progress;
        const py = p.startNode.y + (p.endNode.y - p.startNode.y) * p.progress;

        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#2DD4BF";
        ctx.shadowColor = "#2DD4BF";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Core Hub
      ctx.beginPath();
      ctx.arc(coreHub.x, coreHub.y, coreHub.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(13, 148, 136, 0.15)";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#2DD4BF";
      ctx.stroke();

      // Core Hub Center Text
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 9px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("PEER REACTOR", coreHub.x, coreHub.y - 5);
      ctx.fillStyle = "#2DD4BF";
      ctx.fillText("[ 100% ONLINE ]", coreHub.x, coreHub.y + 8);

      // Draw Subject Nodes
      subjects.forEach((sub) => {
        const isHovered = Math.hypot(mouseX - sub.x, mouseY - sub.y) <= sub.radius + 8;

        ctx.beginPath();
        ctx.arc(sub.x, sub.y, sub.radius + (isHovered ? 4 : 0), 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? "rgba(45, 212, 191, 0.25)" : "rgba(15, 23, 42, 0.8)";
        ctx.fill();
        ctx.lineWidth = isHovered ? 2.5 : 1.5;
        ctx.strokeStyle = sub.color;
        ctx.stroke();

        // Node Title
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 11px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(sub.name, sub.x, sub.y + sub.radius + 14);

        // Coordinates & Active Tutors
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.font = "9px ui-monospace, monospace";
        ctx.fillText(`${sub.tutorsCount} Verified Tutors`, sub.x, sub.y + sub.radius + 26);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
    };
  }, [level, onSelectSubject]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        borderRadius: "14px",
        overflow: "hidden",
        background: "radial-gradient(ellipse at center, rgba(30, 41, 59, 0.9) 0%, #020617 100%)",
        border: "1px solid rgba(45, 212, 191, 0.3)",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* Blueprint Header Ticker */}
      <div
        style={{
          padding: "0.6rem 1rem",
          borderBottom: "1px dashed rgba(45, 212, 191, 0.3)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "ui-monospace, monospace",
          fontSize: "0.72rem",
          color: "rgba(255, 255, 255, 0.7)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#2DD4BF",
              boxShadow: "0 0 8px #2DD4BF",
            }}
          />
          <span style={{ color: "#2DD4BF", fontWeight: 700 }}>
            [ LIVE KNOWLEDGE REACTOR • REVISION 2.4 ]
          </span>
        </div>
        <div>INTERACTIVE MESH: HOVER NODES TO ENGAGE</div>
      </div>

      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "420px" }} />
    </div>
  );
}
