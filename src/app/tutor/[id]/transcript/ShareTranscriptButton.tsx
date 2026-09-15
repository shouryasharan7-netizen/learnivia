"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { Link2, Check } from "lucide-react";

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
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shareableUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch {
      window.prompt("Copy this verifiable transcript link:", shareableUrl);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={styles.shareBtn}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        background: copied ? "var(--wa-forest)" : "var(--wa-forest)",
        color: "var(--wa-paper)",
        border: "none",
        borderRadius: "6px",
        padding: "0.55rem 1rem",
        fontSize: "0.85rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
      title="Copy a verifiable link for school counselors without requiring login"
    >
      {copied ? (
        <>
          <Check size={14} aria-hidden="true" />
          <span>Verifiable Link Copied!</span>
        </>
      ) : (
        <>
          <Link2 size={14} aria-hidden="true" />
          <span>Share Verifiable Link</span>
        </>
      )}
    </button>
  );
}
