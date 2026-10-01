"use client";

import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { softDeleteUser } from "../actions";

interface DeleteUserModalProps {
  userId: string;
  userName: string | null;
  onClose: () => void;
  onDeleted: () => void;
}

const REASONS = [
  "Policy violation",
  "Impersonation / Fraud",
  "Safeguarding concern",
  "Duplicate account",
  "User requested removal",
  "Other",
] as const;

export function DeleteUserModal({
  userId,
  userName,
  onClose,
  onDeleted,
}: DeleteUserModalProps) {
  const [typed, setTyped] = useState("");
  const [reason, setReason] = useState<string>(REASONS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayName = userName || "this user";
  const confirmed = typed.trim().toLowerCase() === displayName.trim().toLowerCase();

  async function handleConfirm() {
    if (!confirmed) return;
    setLoading(true);
    setError(null);
    try {
      await softDeleteUser(userId, reason);
      onDeleted();
    } catch (err: any) {
      setError(err?.message || "Failed to deactivate account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          padding: "2rem",
          width: "100%",
          maxWidth: "460px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#6B7280",
            padding: "4px",
            display: "flex",
          }}
        >
          <X size={18} />
        </button>

        {/* Warning icon */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "#FEF2F2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.25rem",
          }}
        >
          <AlertTriangle size={24} color="#DC2626" aria-hidden="true" />
        </div>

        <h2
          id="delete-modal-title"
          style={{
            fontSize: "1.125rem",
            fontWeight: 800,
            color: "#0C1B33",
            marginBottom: "0.5rem",
          }}
        >
          Deactivate Account
        </h2>
        <p style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "1.5rem", lineHeight: 1.6 }}>
          You are about to deactivate{" "}
          <strong style={{ color: "#0C1B33" }}>{displayName}</strong>.
          Their data is preserved — this is a soft delete. Type their name below to confirm.
        </p>

        {/* Reason selector */}
        <label
          htmlFor="delete-reason"
          style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#374151", marginBottom: "0.35rem" }}
        >
          Reason for deactivation
        </label>
        <select
          id="delete-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem 0.75rem",
            borderRadius: "8px",
            border: "1px solid #D1D5DB",
            fontSize: "0.875rem",
            marginBottom: "1.25rem",
            background: "#FFFFFF",
          }}
        >
          {REASONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        {/* Name confirmation input */}
        <label
          htmlFor="confirm-name"
          style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#374151", marginBottom: "0.35rem" }}
        >
          Type <strong>{displayName}</strong> to confirm
        </label>
        <input
          id="confirm-name"
          type="text"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder={displayName}
          autoComplete="off"
          style={{
            width: "100%",
            padding: "0.55rem 0.75rem",
            borderRadius: "8px",
            border: `1.5px solid ${confirmed ? "#0D9488" : "#D1D5DB"}`,
            fontSize: "0.9rem",
            marginBottom: "1.5rem",
            outline: "none",
            boxSizing: "border-box",
            background: confirmed ? "#F0FDFA" : "#FFFFFF",
            transition: "border-color 0.15s",
          }}
        />

        {error && (
          <p style={{ color: "#DC2626", fontSize: "0.8125rem", marginBottom: "1rem" }}>
            {error}
          </p>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "0.55rem 1.25rem",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              background: "#FFFFFF",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#374151",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!confirmed || loading}
            style={{
              padding: "0.55rem 1.25rem",
              borderRadius: "8px",
              border: "none",
              background: confirmed && !loading ? "#DC2626" : "#F3F4F6",
              color: confirmed && !loading ? "#FFFFFF" : "#9CA3AF",
              fontSize: "0.875rem",
              fontWeight: 700,
              cursor: confirmed && !loading ? "pointer" : "not-allowed",
              transition: "background 0.15s",
            }}
          >
            {loading ? "Deactivating…" : "Deactivate Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
