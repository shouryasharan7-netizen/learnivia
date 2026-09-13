import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "3rem 1.5rem",
        background: "var(--wa-white)",
        border: "1px dashed var(--wa-border)",
        borderRadius: "var(--wa-radius-md)",
      }}
    >
      {Icon && (
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "10px",
            background: "var(--wa-cream-dark)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--wa-muted)",
            marginBottom: "1rem",
          }}
          aria-hidden="true"
        >
          <Icon size={20} strokeWidth={1.75} />
        </div>
      )}

      <h2
        style={{
          fontFamily: "var(--font-serif, Newsreader, serif)",
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "var(--wa-ink)",
          marginBottom: "0.35rem",
          margin: 0,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--wa-muted)",
          maxWidth: "400px",
          lineHeight: 1.5,
          marginTop: "0.25rem",
          marginBottom: action || secondaryAction ? "1.25rem" : 0,
        }}
      >
        {description}
      </p>

      {(action || secondaryAction) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
