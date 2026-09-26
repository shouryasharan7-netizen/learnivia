import React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

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
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "3.5rem 2rem",
        background: "var(--wa-white)",
        border: "1px dashed var(--wa-border-strong)",
        borderRadius: "var(--wa-radius-lg)",
        boxShadow: "var(--wa-shadow-sm)",
      }}
    >
      {Icon && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
          style={{
            width: 52,
            height: 52,
            borderRadius: "12px",
            background: "var(--primary-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--primary)",
            marginBottom: "1.25rem",
          }}
          aria-hidden="true"
        >
          <Icon size={24} strokeWidth={1.75} />
        </motion.div>
      )}

      <h2
        style={{
          fontFamily: "var(--font-serif, Newsreader, serif)",
          fontSize: "1.35rem",
          fontWeight: 700,
          color: "var(--wa-ink)",
          marginBottom: "0.5rem",
          margin: 0,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          fontSize: "0.95rem",
          color: "var(--wa-muted)",
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
    </motion.div>
  );
}
