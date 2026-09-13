"use client";

import { useState } from "react";
import styles from "./page.module.css";

interface ShareTranscriptButtonProps {
  tutorId: string;
  token: string;
}

export default function ShareTranscriptButton({ tutorId, token }: ShareTranscriptButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://learnivia-green.vercel.app";
    const shareableUrl = `${origin}/tutor/${tutorId}/transcript?token=${token}`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareableUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shareableUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy transcript link:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        background: copied ? "#065F46" : "#0E8345",
        color: "white",
        border: "none",
        borderRadius: "8px",
        padding: "0.6rem 1.1rem",
        fontSize: "0.85rem",
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      title="Copy a verifiable link for school counselors without requiring login"
    >
      {copied ? "✓ Verifiable Link Copied!" : "🔗 Share Verifiable Link"}
    </button>
  );
}
