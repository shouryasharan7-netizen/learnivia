import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon | React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className = "",
}: EmptyStateProps) {
  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) {
      return icon;
    }
    if (typeof icon === "function") {
      const IconComponent = icon as any;
      return <IconComponent size={24} strokeWidth={1.75} />;
    }
    return null;
  };

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "3.5rem 2rem",
        background: "var(--wa-white, #FFFFFF)",
        border: "1px dashed var(--wa-border-strong, #CBD5E1)",
        borderRadius: "var(--wa-radius-lg, 12px)",
        boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
      }}
    >
      {icon && (
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "12px",
            background: "var(--primary-light, #ECFDF5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--primary, #059669)",
            marginBottom: "1.25rem",
          }}
          aria-hidden="true"
        >
          {renderIcon()}
        </div>
      )}

      <h2
        style={{
          fontFamily: "var(--font-serif, Newsreader, serif)",
          fontSize: "1.35rem",
          fontWeight: 700,
          color: "var(--wa-ink, #0F172A)",
          marginBottom: "0.5rem",
          margin: 0,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          fontSize: "0.95rem",
          color: "var(--wa-muted, #475569)",
          maxWidth: "420px",
          lineHeight: 1.6,
          marginTop: "0.25rem",
          marginBottom: action || secondaryAction ? "1.5rem" : 0,
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
