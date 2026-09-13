import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  eyebrow,
  action,
  className = "",
}: PageHeaderProps) {
  return (
    <header
      className={className}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "1.5rem",
        marginBottom: "1.75rem",
        flexWrap: "wrap",
      }}
    >
      <div>
        {eyebrow && (
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--wa-green)",
              marginBottom: "0.25rem",
            }}
          >
            {eyebrow}
          </p>
        )}
        <h1
          style={{
            fontFamily: "var(--font-serif, Newsreader, Georgia, serif)",
            fontSize: "2rem",
            fontWeight: 600,
            lineHeight: 1.15,
            color: "var(--wa-ink)",
            letterSpacing: "-0.015em",
            margin: 0,
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--wa-muted)",
              marginTop: "0.35rem",
              marginBottom: 0,
              maxWidth: "640px",
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        )}
      </div>

      {action && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginTop: "0.25rem",
          }}
        >
          {action}
        </div>
      )}
    </header>
  );
}
