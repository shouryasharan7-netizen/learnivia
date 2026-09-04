import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-user";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin?callbackUrl=/admin");
  }

  if (!user.isAdmin) {
    redirect("/dashboard");
  }

  const navItems = [
    { href: "/admin", label: "Overview & Health", icon: "📊" },
    { href: "/admin/users", label: "Users & Roles", icon: "👥" },
    { href: "/admin/applications", label: "Tutor Applications", icon: "📝" },
    { href: "/admin/tutors", label: "Tutors & Transcripts", icon: "🎓" },
    { href: "/admin/sessions", label: "Sessions & Workshops", icon: "📅" },
    { href: "/admin/reports", label: "Safety & Incident Reports", icon: "🛡️" },
    { href: "/admin/moderation", label: "Content & Moderation", icon: "💬" },
    { href: "/admin/stories", label: "Community Stories", icon: "📖" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 68px)", background: "#F8FAFC" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 280,
          background: "#FFFFFF",
          borderRight: "1px solid #E2E8F0",
          padding: "2rem 1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
            <span style={{ fontSize: "1.25rem" }}>🛡️</span>
            <span style={{ fontSize: "1rem", fontWeight: 800, color: "#0F172A", letterSpacing: "0.02em" }}>
              Admin Center
            </span>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#64748B", margin: 0 }}>
            Master system control &amp; safeguarding
          </p>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem", flex: 1 }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.7rem 0.875rem",
                borderRadius: "10px",
                color: "#1E293B",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                transition: "all 0.15s ease",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "1rem" }}>
          <div style={{ fontSize: "0.75rem", color: "#64748B", marginBottom: "0.5rem" }}>
            Signed in as <strong>{user.name || user.email}</strong>
          </div>
          <Link
            href="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.8125rem",
              color: "#0E8345",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            ← Return to Learner Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2.5rem 3rem", overflowY: "auto" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>{children}</div>
      </main>
    </div>
  );
}
