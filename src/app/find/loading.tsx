export default function FindLoading() {
  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ height: 40, width: 280, background: "#e8f4fc", borderRadius: 8, marginBottom: 12, animation: "pulse 1.5s ease-in-out infinite" }} />
        <div style={{ height: 20, width: 400, background: "#e8f4fc", borderRadius: 8, animation: "pulse 1.5s ease-in-out infinite" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", animation: "pulse 1.5s ease-in-out infinite" }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#e8f4fc", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 18, background: "#e8f4fc", borderRadius: 6, marginBottom: 8 }} />
                <div style={{ height: 14, width: "60%", background: "#e8f4fc", borderRadius: 6 }} />
              </div>
            </div>
            <div style={{ height: 14, background: "#e8f4fc", borderRadius: 6, marginBottom: 8 }} />
            <div style={{ height: 14, width: "80%", background: "#e8f4fc", borderRadius: 6, marginBottom: 16 }} />
            <div style={{ height: 40, background: "#e8f4fc", borderRadius: 8 }} />
          </div>
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </main>
  );
}
