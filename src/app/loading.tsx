export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        width: "100%",
        padding: "2rem",
      }}
    >
      <div
        className="learnivia-loader"
        style={{
          width: "40px",
          height: "40px",
          border: "3px solid var(--surface-subtle)",
          borderTopColor: "var(--primary)",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "1rem",
        }}
      />
      <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>
        Loading content...
      </p>
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
