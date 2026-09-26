export default function FindLoading() {
  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            height: 36,
            width: 280,
            background: "var(--wa-cream-dark, #F1F5F9)",
            borderRadius: 8,
            marginBottom: 12,
            opacity: 0.7,
          }}
        />
        <div
          style={{
            height: 18,
            width: 380,
            background: "var(--wa-cream-dark, #F1F5F9)",
            borderRadius: 6,
            opacity: 0.5,
          }}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: "var(--wa-white, #FFFFFF)",
              border: "1px solid var(--wa-border, #E2E8F0)",
              borderRadius: 14,
              padding: "1.5rem",
              boxShadow: "var(--wa-shadow-xs)",
            }}
          >
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "var(--wa-cream-dark, #F1F5F9)",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    height: 16,
                    background: "var(--wa-cream-dark, #F1F5F9)",
                    borderRadius: 6,
                    marginBottom: 8,
                  }}
                />
                <div
                  style={{
                    height: 12,
                    width: "55%",
                    background: "var(--wa-cream-dark, #F1F5F9)",
                    borderRadius: 6,
                  }}
                />
              </div>
            </div>
            <div
              style={{
                height: 12,
                background: "var(--wa-cream-dark, #F1F5F9)",
                borderRadius: 6,
                marginBottom: 8,
              }}
            />
            <div
              style={{
                height: 12,
                width: "75%",
                background: "var(--wa-cream-dark, #F1F5F9)",
                borderRadius: 6,
                marginBottom: 16,
              }}
            />
            <div
              style={{
                height: 38,
                background: "var(--wa-cream-dark, #F1F5F9)",
                borderRadius: 8,
              }}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
