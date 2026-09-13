import React from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  count?: number;
  style?: React.CSSProperties;
}

export function LoadingSkeleton({
  width = "100%",
  height = "1.25rem",
  borderRadius = "var(--wa-radius-sm)",
  className = "",
  count = 1,
  style = {},
}: SkeletonProps) {
  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, i) => (
        <div
          key={i}
          className={`skeleton-shimmer ${className}`}
          style={{
            width,
            height,
            borderRadius,
            backgroundColor: "var(--wa-cream-dark)",
            marginBottom: count > 1 && i < count - 1 ? "0.5rem" : 0,
            ...style,
          }}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">Loading content...</span>
    </>
  );
}

export function CardSkeleton() {
  return (
    <div
      style={{
        padding: "1.25rem",
        background: "var(--wa-white)",
        border: "1px solid var(--wa-border)",
        borderRadius: "var(--wa-radius-md)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
        <LoadingSkeleton width={36} height={36} borderRadius="8px" />
        <div style={{ flex: 1 }}>
          <LoadingSkeleton width="40%" height="0.875rem" />
          <div style={{ height: "0.35rem" }} />
          <LoadingSkeleton width="25%" height="0.75rem" />
        </div>
      </div>
      <LoadingSkeleton width="90%" height="0.875rem" />
      <div style={{ height: "0.5rem" }} />
      <LoadingSkeleton width="65%" height="0.875rem" />
    </div>
  );
}
