import { getCurrentUser } from "@/lib/auth-user";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ROUTES } from "@/lib/routes";
import {
  User,
  Mail,
  Shield,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Clock,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "My Profile | Learnivia",
  description: "View and manage your Learnivia account profile and settings.",
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin?callbackUrl=/profile");
  }

  const roleLabel = user.isAdmin ? "Administrator" : user.isTutor ? "Volunteer Tutor" : "Student";
  const roleBg = user.isAdmin ? "#FEF3C7" : user.isTutor ? "#ECFDF5" : "#EFF6FF";
  const roleColor = user.isAdmin ? "#92400E" : user.isTutor ? "#065F46" : "#1E3A5F";
  const workspaceHref = user.isAdmin ? "/admin" : user.isTutor ? "/tutor" : "/dashboard";
  const workspaceLabel = user.isAdmin ? "Admin Center" : user.isTutor ? "Tutor Workspace" : "Student Dashboard";

  const initials = (user.name ?? user.email ?? "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--surface-subtle, #F8FAFC)",
        padding: "2.5rem 1.5rem",
        fontFamily: "var(--font-body, Inter, sans-serif)",
      }}
    >
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        {/* Back link */}
        <Link
          href={workspaceHref}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "var(--text-secondary, #475569)",
            textDecoration: "none",
            fontSize: "0.875rem",
            marginBottom: "1.5rem",
          }}
        >
          ← Back to {workspaceLabel}
        </Link>

        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "var(--text-primary, #0C1B33)",
            marginBottom: "2rem",
          }}
        >
          My Profile
        </h1>

        {/* Identity card */}
        <div
          style={{
            background: "var(--surface-raised, #FFFFFF)",
            border: "1px solid var(--border, #E2E8F0)",
            borderRadius: "1rem",
            padding: "2rem",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "var(--primary, #0D9488)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#fff",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "User avatar"}
                width={80}
                height={80}
                style={{ objectFit: "cover" }}
              />
            ) : (
              initials
            )}
          </div>

          {/* Details */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--text-primary, #0C1B33)",
                  margin: 0,
                }}
              >
                {user.name ?? "Learnivia User"}
              </h2>
              <span
                style={{
                  background: roleBg,
                  color: roleColor,
                  padding: "0.2rem 0.65rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                {roleLabel}
              </span>
            </div>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary, #475569)",
                margin: "0.25rem 0 0",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <Mail size={14} aria-hidden="true" />
              {user.email}
            </p>
          </div>
        </div>

        {/* Info rows */}
        <div
          style={{
            background: "var(--surface-raised, #FFFFFF)",
            border: "1px solid var(--border, #E2E8F0)",
            borderRadius: "1rem",
            overflow: "hidden",
            marginBottom: "1.25rem",
          }}
        >
          {[
            {
              icon: User,
              label: "Display Name",
              value: user.name ?? "Not set",
            },
            {
              icon: Mail,
              label: "Email Address",
              value: user.email ?? "—",
            },
            {
              icon: Shield,
              label: "Account Role",
              value: roleLabel,
            },
            ...(user.isTutor
              ? [
                  {
                    icon: GraduationCap,
                    label: "Tutor Status",
                    value: user.tutorProfile?.status ?? "—",
                  },
                  {
                    icon: Clock,
                    label: "Volunteer Hours",
                    value: `${user.tutorProfile?.volunteerHours?.toFixed(1) ?? "0.0"} hrs recorded`,
                  },
                ]
              : []),
          ].map(({ icon: Icon, label, value }, i) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem 1.5rem",
                borderTop: i > 0 ? "1px solid var(--border, #E2E8F0)" : "none",
              }}
            >
              <Icon
                size={18}
                style={{ color: "var(--primary, #0D9488)", flexShrink: 0 }}
                aria-hidden="true"
              />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-secondary, #6B7280)", fontWeight: 600 }}>
                  {label}
                </p>
                <p style={{ margin: 0, fontSize: "0.9375rem", color: "var(--text-primary, #0C1B33)", fontWeight: 500 }}>
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div
          style={{
            background: "var(--surface-raised, #FFFFFF)",
            border: "1px solid var(--border, #E2E8F0)",
            borderRadius: "1rem",
            overflow: "hidden",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border, #E2E8F0)" }}>
            <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary, #0C1B33)" }}>
              Account Actions
            </h3>
          </div>

          {[
            {
              href: ROUTES.auth.forgotPassword,
              icon: Settings,
              label: "Change Password",
              desc: "Request a password reset link via email",
            },
            {
              href: workspaceHref,
              icon: LayoutDashboard,
              label: workspaceLabel,
              desc: "Return to your workspace",
              external: false,
            },
            ...(user.isTutor
              ? [
                  {
                    href: ROUTES.tutor.transcript,
                    icon: GraduationCap,
                    label: "My Service Record",
                    desc: "View verified volunteer hours and transcript",
                  },
                ]
              : []),
            {
              href: ROUTES.safety,
              icon: Shield,
              label: "Platform Safety",
              desc: "Read our safeguarding policies",
            },
          ].map(({ href, icon: Icon, label, desc }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem 1.5rem",
                borderTop: "1px solid var(--border, #E2E8F0)",
                textDecoration: "none",
                color: "inherit",
                transition: "background 0.15s",
              }}
            >
              <Icon
                size={18}
                style={{ color: "var(--primary, #0D9488)", flexShrink: 0 }}
                aria-hidden="true"
              />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary, #0C1B33)" }}>
                  {label}
                </p>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary, #6B7280)" }}>
                  {desc}
                </p>
              </div>
              <ChevronRight size={16} style={{ color: "var(--text-secondary, #6B7280)" }} aria-hidden="true" />
            </Link>
          ))}
        </div>

        {/* Sign out */}
        <div style={{ textAlign: "center", paddingTop: "0.5rem" }}>
          <Link
            href="/api/auth/signout"
            style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary, #6B7280)",
              textDecoration: "underline",
            }}
          >
            Sign out of Learnivia
          </Link>
        </div>
      </div>
    </main>
  );
}
