"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  Check,
  ChevronRight,
  ChevronLeft,
  Volume2,
  Video,
  MonitorPlay,
  FileText,
} from "lucide-react";

interface VideoData {
  title: string;
  duration: string;
  embedUrl: string;
  summary: string;
  keyPoints: string[];
}

interface VideoLessonPlayerProps {
  video: VideoData;
  color: string;
  bg: string;
  content: { heading: string; body: string }[];
}

export function VideoLessonPlayer({ video, color, bg, content }: VideoLessonPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [viewMode, setViewMode] = useState<"interactive" | "stream">("stream");
  const [showTranscript, setShowTranscript] = useState(false);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);

  // Total duration parsed to seconds for playback progress simulation
  const durationParts = video.duration.split(":");
  const totalSeconds =
    durationParts.length === 2
      ? parseInt(durationParts[0], 10) * 60 + parseInt(durationParts[1], 10)
      : 225;

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setPlaybackSeconds((prev) => {
          if (prev >= totalSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const currentSlideContent = content[activeSlide] || content[0];

  return (
    <div
      style={{
        borderRadius: "14px",
        overflow: "hidden",
        border: "1px solid var(--wa-border, #E2E8F0)",
        background: "#FFFFFF",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* Player Header Bar */}
      <div
        style={{
          padding: "0.85rem 1.25rem",
          background: bg,
          borderBottom: "1px solid var(--wa-border, #E2E8F0)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "7px",
              background: color,
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Video size={15} />
          </div>
          <span style={{ fontSize: "0.9rem", fontWeight: 700, color }}>
            {video.title}
          </span>
        </div>

        {/* View Mode Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <button
            type="button"
            onClick={() => setViewMode("interactive")}
            aria-pressed={viewMode === "interactive"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.45rem 0.75rem",
              minHeight: "36px",
              borderRadius: "6px",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              border: "1px solid",
              borderColor: viewMode === "interactive" ? color : "var(--wa-border, #CBD5E1)",
              background: viewMode === "interactive" ? color : "var(--wa-white, #FFFFFF)",
              color: viewMode === "interactive" ? "#FFFFFF" : "var(--wa-muted, #475569)",
              transition: "all 0.15s ease",
            }}
          >
            <MonitorPlay size={14} />
            <span>Interactive Visual Lesson</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("stream")}
            aria-pressed={viewMode === "stream"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.45rem 0.75rem",
              minHeight: "36px",
              borderRadius: "6px",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              border: "1px solid",
              borderColor: viewMode === "stream" ? color : "var(--wa-border, #CBD5E1)",
              background: viewMode === "stream" ? color : "var(--wa-white, #FFFFFF)",
              color: viewMode === "stream" ? "#FFFFFF" : "var(--wa-muted, #475569)",
              transition: "all 0.15s ease",
            }}
          >
            <Video size={14} />
            <span>Video Stream</span>
          </button>
        </div>
      </div>

      {/* Screen Area */}
      {viewMode === "interactive" ? (
        /* Interactive Master Lecture Player Screen */
        <div
          style={{
            background: "linear-gradient(145deg, #0F172A 0%, #1E293B 100%)",
            color: "#FFFFFF",
            padding: "2rem 2.25rem",
            position: "relative",
            minHeight: "330px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Top Status inside player */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
              paddingBottom: "0.75rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "0.75rem",
                color: "#93C5FD",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Concept {activeSlide + 1} of {content.length}: {currentSlideContent?.heading}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.75rem",
                  color: "#94A3B8",
                }}
              >
                {formatTime(playbackSeconds)} / {video.duration}
              </span>
              <span
                style={{
                  background: isPlaying ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.1)",
                  color: isPlaying ? "#34D399" : "#CBD5E1",
                  border: isPlaying ? "1px solid #10B981" : "1px solid rgba(255, 255, 255, 0.2)",
                  fontSize: "0.65rem",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "4px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {isPlaying ? "Active Audio" : "Paused"}
              </span>
            </div>
          </div>

          {/* Central Slide Content */}
          <div style={{ padding: "1.75rem 0", maxWidth: "680px" }}>
            <h2
              style={{
                fontSize: "1.35rem",
                fontWeight: 700,
                color: "#FFFFFF",
                marginBottom: "0.75rem",
                fontFamily: "var(--font-serif, 'Times New Roman', serif)",
                lineHeight: 1.25,
              }}
            >
              {currentSlideContent?.heading}
            </h2>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#E2E8F0",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {currentSlideContent?.body}
            </p>

            {/* Simulated Animated Waveform Visualizer */}
            {isPlaying && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginTop: "1.25rem",
                  height: "24px",
                }}
              >
                <Volume2 size={15} color="#38BDF8" style={{ marginRight: "4px" }} />
                {[14, 22, 10, 18, 24, 16, 8, 20, 15, 22, 12, 18, 24, 10].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: "3px",
                      height: `${h}px`,
                      background: "#38BDF8",
                      borderRadius: "2px",
                    }}
                  />
                ))}
                <span style={{ fontSize: "0.72rem", color: "#38BDF8", marginLeft: "6px", fontWeight: 600 }}>
                  Guided lecture narration playing
                </span>
              </div>
            )}
          </div>

          {/* Player Controls Bar */}
          <div
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.12)",
              paddingTop: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            {/* Play/Pause & Scrubber */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? "Pause lecture audio" : "Play lecture audio"}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "var(--wa-crimson, #2563EB)",
                  border: "none",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 10px rgba(37, 99, 235, 0.4)",
                  transition: "transform 0.15s ease",
                }}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: "2px" }} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPlaybackSeconds(0);
                  setIsPlaying(true);
                }}
                title="Restart Lecture"
                aria-label="Restart lecture from beginning"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94A3B8",
                  cursor: "pointer",
                  minWidth: "44px",
                  minHeight: "44px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  transition: "color 0.15s ease",
                }}
              >
                <RotateCcw size={16} />
              </button>

              {/* Accessible Progress Slider */}
              <div
                role="slider"
                tabIndex={0}
                aria-label="Lecture progress"
                aria-valuemin={0}
                aria-valuemax={totalSeconds}
                aria-valuenow={playbackSeconds}
                aria-valuetext={`${formatTime(playbackSeconds)} of ${formatTime(totalSeconds)}`}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    setPlaybackSeconds((prev) => Math.max(0, prev - 5));
                  } else if (e.key === "ArrowRight") {
                    e.preventDefault();
                    setPlaybackSeconds((prev) => Math.min(totalSeconds, prev + 5));
                  } else if (e.key === "Home") {
                    e.preventDefault();
                    setPlaybackSeconds(0);
                  } else if (e.key === "End") {
                    e.preventDefault();
                    setPlaybackSeconds(totalSeconds);
                  }
                }}
                style={{
                  width: "160px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  outline: "none",
                }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  setPlaybackSeconds(Math.round(pct * totalSeconds));
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    background: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "3px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: "100%",
                      transform: `scaleX(${totalSeconds > 0 ? playbackSeconds / totalSeconds : 0})`,
                      transformOrigin: "left",
                      background: "var(--wa-crimson, #38BDF8)",
                      transition: "transform 0.2s linear",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Slide Navigation */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button
                type="button"
                disabled={activeSlide === 0}
                onClick={() => setActiveSlide((prev) => Math.max(0, prev - 1))}
                aria-label="Previous concept slide"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.45rem 0.85rem",
                  minHeight: "44px",
                  borderRadius: "6px",
                  fontSize: "0.775rem",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: activeSlide === 0 ? "#64748B" : "#FFFFFF",
                  cursor: activeSlide === 0 ? "not-allowed" : "pointer",
                }}
              >
                <ChevronLeft size={16} />
                <span>Prev Concept</span>
              </button>
              <button
                type="button"
                disabled={activeSlide === content.length - 1}
                onClick={() => setActiveSlide((prev) => Math.min(content.length - 1, prev + 1))}
                aria-label="Next concept slide"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.45rem 0.85rem",
                  minHeight: "44px",
                  borderRadius: "6px",
                  fontSize: "0.775rem",
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  color: activeSlide === content.length - 1 ? "#64748B" : "#FFFFFF",
                  cursor: activeSlide === content.length - 1 ? "not-allowed" : "pointer",
                  fontWeight: 600,
                }}
              >
                <span>Next Concept</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Video Stream Embed Mode with Fallback Warning & External Link */
        <div style={{ background: "#000000" }}>
          <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9" }}>
            <iframe
              src={video.embedUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="origin"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
                background: "#0F172A",
              }}
            />
          </div>

          {/* Backup link bar below iframe if browser blocks cookies/embed */}
          <div
            style={{
              padding: "0.6rem 1rem",
              background: "#1E293B",
              color: "#E2E8F0",
              fontSize: "0.8rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <span>Showing a blank screen? Your browser or network may block third-party video embeds.</span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <a
                href={video.embedUrl.replace("/embed/", "/watch?v=")}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  color: "#60A5FA",
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
              >
                <span>Watch on YouTube ↗</span>
                <ExternalLink size={13} />
              </a>
              <button
                type="button"
                onClick={() => setViewMode("interactive")}
                style={{
                  background: "#334155",
                  border: "none",
                  color: "#FFFFFF",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
              >
                Switch to Interactive Lesson
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Key Learning Takeaways & Transcript Drawer */}
      <div style={{ padding: "1.25rem 1.4rem", background: "#F8FAFC", borderTop: "1px solid var(--wa-border, #E2E8F0)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.65rem" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748B" }}>
            Essential Lesson Notes for Quiz
          </span>
          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            aria-expanded={showTranscript}
            aria-controls="lecture-notes-drawer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              background: "transparent",
              border: "none",
              color: color,
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              minHeight: "44px",
              padding: "0.35rem 0.5rem",
            }}
          >
            <FileText size={14} />
            <span>{showTranscript ? "Hide Full Notes" : "View Full Notes"}</span>
          </button>
        </div>

        {/* 3 Key Takeaway Pills */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {video.keyPoints.map((point: string, pIdx: number) => (
            <span
              key={pIdx}
              style={{
                fontSize: "0.8rem",
                color: "var(--wa-ink, #1E293B)",
                background: "var(--wa-white, #FFFFFF)",
                padding: "0.4rem 0.85rem",
                borderRadius: "8px",
                border: "1px solid var(--wa-border, #CBD5E1)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontWeight: 500,
                boxShadow: "var(--wa-shadow-xs)",
              }}
            >
              <Check size={13} color={color} strokeWidth={2.5} /> {point}
            </span>
          ))}
        </div>

        {/* Collapsible Full Notes */}
        {showTranscript && (
          <div
            id="lecture-notes-drawer"
            style={{
              marginTop: "1rem",
              padding: "1rem 1.25rem",
              background: "var(--wa-white, #FFFFFF)",
              borderRadius: "8px",
              border: "1px solid var(--wa-border, #E2E8F0)",
              fontSize: "0.875rem",
              color: "var(--wa-text, #334155)",
              lineHeight: 1.65,
            }}
          >
            <div style={{ fontWeight: 700, color: "#0F172A", marginBottom: "0.5rem" }}>
              Comprehensive Lesson Summary:
            </div>
            <p style={{ margin: "0 0 0.75rem" }}>{video.summary}</p>
            {content.map((sec, i) => (
              <div key={i} style={{ marginBottom: "0.5rem" }}>
                <strong>• {sec.heading}:</strong> {sec.body}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
