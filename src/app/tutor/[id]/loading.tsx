export default function TutorProfileLoading() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <div style={{ display: "flex", gap: "2rem", flexDirection: "column" }}>
        {/* Header Skeleton */}
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", paddingBottom: "2rem", borderBottom: "1px solid var(--wa-border, #E2E8F0)" }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: "var(--wa-cream-dark, #F1F5F9)",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                height: 32,
                width: 250,
                background: "var(--wa-cream-dark, #F1F5F9)",
                borderRadius: 8,
                marginBottom: 12,
              }}
            />
            <div
              style={{
                height: 18,
                width: 400,
                background: "var(--wa-cream-dark, #F1F5F9)",
                borderRadius: 6,
              }}
            />
          </div>
        </div>

        {/* Content Skeleton */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
          <div>
            <div
              style={{
                height: 24,
                width: 150,
                background: "var(--wa-cream-dark, #F1F5F9)",
                borderRadius: 6,
                marginBottom: 16,
              }}
            />
            <div
              style={{
                height: 14,
                width: "100%",
                background: "var(--wa-cream-dark, #F1F5F9)",
                borderRadius: 6,
                marginBottom: 8,
              }}
            />
            <div
              style={{
                height: 14,
                width: "100%",
                background: "var(--wa-cream-dark, #F1F5F9)",
                borderRadius: 6,
                marginBottom: 8,
              }}
            />
            <div
              style={{
                height: 14,
                width: "80%",
                background: "var(--wa-cream-dark, #F1F5F9)",
                borderRadius: 6,
              }}
            />
          </div>
          <div
            style={{
              background: "var(--wa-white, #FFFFFF)",
              border: "1px solid var(--wa-border, #E2E8F0)",
              borderRadius: 14,
              padding: "1.5rem",
              height: 250,
            }}
          >
            <div
              style={{
                height: 20,
                width: "60%",
                background: "var(--wa-cream-dark, #F1F5F9)",
                borderRadius: 6,
                marginBottom: 20,
              }}
            />
            <div
              style={{
                height: 48,
                width: "100%",
                background: "var(--wa-cream-dark, #F1F5F9)",
                borderRadius: 8,
                marginBottom: 12,
              }}
            />
            <div
              style={{
                height: 48,
                width: "100%",
                background: "var(--wa-cream-dark, #F1F5F9)",
                borderRadius: 8,
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
