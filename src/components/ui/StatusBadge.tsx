import React from "react";
import {
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  XCircle,
  ShieldAlert,
} from "lucide-react";

export type StatusType =
  | "confirmed"
  | "completed"
  | "pending"
  | "waiting"
  | "scheduled"
  | "held"
  | "canceled"
  | "suspended"
  | "verified";

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className = "" }: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  let text = label;
  let bg = "#F5F2EB";
  let color = "#44403C";
  let borderColor = "#E7E2D9";
  let Icon = Clock;

  switch (normalized) {
    case "confirmed":
    case "approved":
    case "verified":
      text = text || "Confirmed";
      bg = "#EAF2EE";
      color = "#1B4D3E";
      borderColor = "#C6DEC6";
      Icon = CheckCircle2;
      break;
    case "completed":
      text = text || "Completed";
      bg = "#EAF2EE";
      color = "#1B4D3E";
      borderColor = "#C6DEC6";
      Icon = CheckCircle2;
      break;
    case "pending":
    case "waiting":
      text = text || "Pending";
      bg = "#FEF3C7";
      color = "#92400E";
      borderColor = "#FDE68A";
      Icon = Clock;
      break;
    case "scheduled":
    case "held":
      text = text || "Scheduled";
      bg = "#EFF6FF";
      color = "#1E3A5F";
      borderColor = "#DBEAFE";
      Icon = Calendar;
      break;
    case "canceled":
    case "cancelled":
    case "rejected":
      text = text || "Canceled";
      bg = "#F5F5F4";
      color = "#78716C";
      borderColor = "#E7E5E4";
      Icon = XCircle;
      break;
    case "suspended":
    case "flagged":
      text = text || "Suspended";
      bg = "#FEF2F2";
      color = "#991B1B";
      borderColor = "#FECACA";
      Icon = ShieldAlert;
      break;
    default:
      text = text || status;
      bg = "#F5F2EB";
      color = "#44403C";
      borderColor = "#E7E2D9";
      Icon = AlertCircle;
      break;
  }

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.2rem 0.55rem",
        borderRadius: "8px",
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.01em",
        background: bg,
        color: color,
        border: `1px solid ${borderColor}`,
        lineHeight: 1.3,
        whiteSpace: "nowrap",
      }}
    >
      <Icon size={12} strokeWidth={2} aria-hidden="true" />
      <span>{text}</span>
    </span>
  );
}
