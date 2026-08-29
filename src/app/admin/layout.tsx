import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 68px)", background: "var(--color-cream)" }}>
      {/* Sidebar */}
      <aside style={{ width: 260, background: "white", borderRight: "1px solid var(--color-border)", padding: "2rem 1.5rem" }}>
        <h2 style={{ fontSize: "0.875rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-navy)", marginBottom: "1.5rem" }}>
          Admin Panel
        </h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Link href="/admin/applications" style={{ padding: "0.75rem 1rem", borderRadius: "0.5rem", color: "var(--color-text)", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem" }}>
            Applications
          </Link>
          <Link href="/admin/sessions" style={{ padding: "0.75rem 1rem", borderRadius: "0.5rem", color: "var(--color-text)", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem" }}>
            All Sessions &amp; Workshops
          </Link>
          <Link href="/admin/tutors" style={{ padding: "0.75rem 1rem", borderRadius: "0.5rem", color: "var(--color-text)", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem" }}>
            Tutors &amp; Transcripts
          </Link>
          <Link href="/admin/reports" style={{ padding: "0.75rem 1rem", borderRadius: "0.5rem", color: "var(--color-text)", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem" }}>
            🛡️ Safety Reports
          </Link>
          <Link href="/admin/stories" style={{ padding: "0.75rem 1rem", borderRadius: "0.5rem", color: "var(--color-text)", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem" }}>
            Stories
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
