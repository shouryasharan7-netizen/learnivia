"use client";

import React, { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus cancel button by default for safety on destructive dialogs
    cancelBtnRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "rgba(28, 25, 23, 0.45)",
        backdropFilter: "blur(2px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "var(--wa-white)",
          border: "1px solid var(--wa-border)",
          borderRadius: "var(--wa-radius-lg)",
          boxShadow: "var(--wa-shadow-lg)",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "0.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            {isDestructive && (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  background: "#FEF2F2",
                  color: "#B91C1C",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-hidden="true"
              >
                <AlertTriangle size={17} strokeWidth={2} />
              </div>
            )}
            <h3
              id="confirm-dialog-title"
              style={{
                fontFamily: "var(--font-serif, Newsreader, serif)",
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "var(--wa-ink)",
                margin: 0,
              }}
            >
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close dialog"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--wa-muted)",
              cursor: "pointer",
              padding: "0.25rem",
              borderRadius: "4px",
            }}
          >
            <X size={16} />
          </button>
        </div>

        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--wa-text)",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "0.65rem",
            marginTop: "0.5rem",
          }}
        >
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            style={{
              padding: "0.55rem 1rem",
              borderRadius: "var(--wa-radius-sm)",
              border: "1px solid var(--wa-border)",
              background: "var(--wa-white)",
              color: "var(--wa-ink)",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              padding: "0.55rem 1rem",
              borderRadius: "var(--wa-radius-sm)",
              border: "none",
              background: isDestructive ? "#B91C1C" : "var(--wa-green)",
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
