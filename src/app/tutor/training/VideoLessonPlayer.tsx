"use client";

import React from "react";

interface VideoData {
  title: string;
  duration: string;
  embedUrl: string;
  summary: string;
  keyPoints: string[];
}

interface VideoLessonPlayerProps {
  video: VideoData;
  color?: string;
  bg?: string;
  content?: { heading: string; body: string }[];
}

export function VideoLessonPlayer({ video }: VideoLessonPlayerProps) {
  return (
    <div
      style={{
        borderRadius: "14px",
        overflow: "hidden",
        border: "1px solid var(--wa-border, #E2E8F0)",
        background: "#000000",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        width: "100%",
        aspectRatio: "16 / 9",
        position: "relative",
      }}
    >
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
        }}
      />
    </div>
  );
}
