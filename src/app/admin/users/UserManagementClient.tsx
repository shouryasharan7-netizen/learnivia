"use client";

import { useState } from "react";
import { updateUserRole, deleteUserAccount } from "../actions";
import { CheckCircle2, Trash2 } from "lucide-react";

interface SerializedUser {
  id: string;
  name: string | null;
  email: string | null;
  role: "STUDENT" | "TUTOR" | "ADMIN";
  age: number | null;
  grade: string | null;
  curriculum: string | null;
  points: number;
  createdAt: string | null;
  completedSessions: number;
  tutorProfile: {
    status: string;
    volunteerHours: number;
  } | null;
}

interface Props {
  initialUsers: SerializedUser[];
  currentAdminId: string;
}

export default function UserManagementClient({
  initialUsers,
  currentAdminId,
}: Props) {
  const [users, setUsers] = useState<SerializedUser[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<
    "ALL" | "STUDENT" | "TUTOR" | "ADMIN"
  >("ALL");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      (u.name && u.name.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query));
    return matchesRole && matchesQuery;
  });

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  }

  async function handleRoleChange(
    userId: string,
    newRole: "STUDENT" | "TUTOR" | "ADMIN",
  ) {
    setIsUpdating(userId);
    try {
      await updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
      showToast(`User role successfully updated to ${newRole}.`);
    } catch (err: any) {
      alert(err?.message || "Failed to update user role.");
    } finally {
      setIsUpdating(null);
    }
  }

  async function handleDeleteUser(userId: string, userName: string | null) {
    if (
      !confirm(
        `Are you sure you want to permanently delete user "${userName || "User"}"? This will erase all their bookings, points, and records.`,
      )
    ) {
      return;
    }

    setIsUpdating(userId);
    try {
      await deleteUserAccount(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showToast("User account permanently removed.");
    } catch (err: any) {
      alert(err?.message || "Failed to delete user account.");
    } finally {
      setIsUpdating(null);
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "var(--text-primary, #0C1B33)",
            marginBottom: "0.5rem",
          }}
        >
          User Accounts &amp; Access Controls
        </h1>
        <p style={{ color: "var(--text-secondary, #475569)", fontSize: "0.95rem", margin: 0 }}>
          Manage all registered students, volunteer tutors, and platform
          administrators. Modify roles and enforce account standards.
        </p>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div
          style={{
            background: "var(--success-bg, #ECFDF5)",
            border: "1px solid #A7F3D0",
            color: "#065F46",
            padding: "0.75rem 1.25rem",
            borderRadius: "10px",
            marginBottom: "1.5rem",
            fontWeight: 600,
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <CheckCircle2 size={16} aria-hidden="true" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div
        style={{
          background: "var(--surface-raised, #FFFFFF)",
          padding: "1rem 1.25rem",
          borderRadius: "14px",
          border: "1px solid var(--border, #E2E8F0)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {(["ALL", "STUDENT", "TUTOR", "ADMIN"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              style={{
                background: roleFilter === r ? "#0E8345" : "#F1F5F9",
                color: roleFilter === r ? "#FFFFFF" : "#475569",
                border: "none",
                padding: "0.45rem 0.9rem",
                borderRadius: "8px",
                fontSize: "0.8125rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.12s ease",
              }}
            >
              {r === "ALL" ? "All Users" : r + "s"}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "1px solid var(--border, #E2E8F0)",
            fontSize: "0.875rem",
            width: 280,
            outline: "none",
          }}
        />
      </div>

      {/* Users Table */}
      <div
        style={{
          background: "var(--surface-raised, #FFFFFF)",
          borderRadius: "14px",
          border: "1px solid var(--border, #E2E8F0)",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.875rem",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "var(--surface-subtle, #F8FAFC)",
                  borderBottom: "1px solid var(--border, #E2E8F0)",
                  textAlign: "left",
                }}
              >
                <th
                  style={{
                    padding: "0.875rem 1rem",
                    color: "var(--text-secondary, #475569)",
                    fontWeight: 700,
                  }}
                >
                  User
                </th>
                <th
                  style={{
                    padding: "0.875rem 1rem",
                    color: "var(--text-secondary, #475569)",
                    fontWeight: 700,
                  }}
                >
                  Curriculum &amp; Grade
                </th>
                <th
                  style={{
                    padding: "0.875rem 1rem",
                    color: "var(--text-secondary, #475569)",
                    fontWeight: 700,
                  }}
                >
                  Points / Hours
                </th>
                <th
                  style={{
                    padding: "0.875rem 1rem",
                    color: "var(--text-secondary, #475569)",
                    fontWeight: 700,
                  }}
                >
                  Current Role
                </th>
                <th
                  style={{
                    padding: "0.875rem 1rem",
                    color: "var(--text-secondary, #475569)",
                    fontWeight: 700,
                    textAlign: "right",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: "3rem",
                      textAlign: "center",
                      color: "var(--text-secondary, #475569)",
                    }}
                  >
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrentAdmin = u.id === currentAdminId;
                  const isBusy = isUpdating === u.id;

                  return (
                    <tr
                      key={u.id}
                      style={{ borderBottom: "1px solid #F1F5F9" }}
                    >
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <div style={{ fontWeight: 700, color: "var(--text-primary, #0C1B33)" }}>
                          {u.name || "Learner"}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary, #475569)" }}>
                          {u.email}
                        </div>
                        <div
                          style={{
                            fontSize: "0.7rem",
                            color: "var(--text-muted, #94A3B8)",
                            marginTop: "0.15rem",
                          }}
                        >
                          {u.createdAt
                            ? `Joined ${new Date(u.createdAt).toLocaleDateString()}`
                            : "Active Member"}
                        </div>
                      </td>

                      <td style={{ padding: "0.875rem 1rem" }}>
                        <div>
                          {u.curriculum ? `${u.curriculum}` : "General"}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary, #475569)" }}>
                          {u.grade ? `Grade ${u.grade}` : "Grade unspecified"}
                          {u.age ? ` • Age ${u.age}` : ""}
                        </div>
                      </td>

                      <td style={{ padding: "0.875rem 1rem" }}>
                        <div style={{ fontWeight: 700, color: "#0E8345" }}>
                          {u.points} SP
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary, #475569)" }}>
                          {u.completedSessions} sessions
                          {u.tutorProfile &&
                            ` • ${u.tutorProfile.volunteerHours.toFixed(1)} hrs taught`}
                        </div>
                      </td>

                      <td style={{ padding: "0.875rem 1rem" }}>
                        <span
                          style={{
                            background:
                              u.role === "ADMIN"
                                ? "#FEF3C7"
                                : u.role === "TUTOR"
                                  ? "#D1FAE5"
                                  : "#F1F5F9",
                            color:
                              u.role === "ADMIN"
                                ? "#B45309"
                                : u.role === "TUTOR"
                                  ? "#065F46"
                                  : "#475569",
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            padding: "0.25rem 0.65rem",
                            borderRadius: "4px",
                            display: "inline-block",
                          }}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td
                        style={{ padding: "0.875rem 1rem", textAlign: "right" }}
                      >
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          {/* Role Select */}
                          <select
                            disabled={isBusy || isCurrentAdmin}
                            value={u.role}
                            onChange={(e) =>
                              handleRoleChange(
                                u.id,
                                e.target.value as "STUDENT" | "TUTOR" | "ADMIN",
                              )
                            }
                            style={{
                              padding: "0.35rem 0.6rem",
                              borderRadius: "6px",
                              border: "1px solid var(--border, #E2E8F0)",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              background: "var(--surface-raised, #FFFFFF)",
                              cursor: isCurrentAdmin
                                ? "not-allowed"
                                : "pointer",
                            }}
                            title={
                              isCurrentAdmin
                                ? "You cannot modify your own role"
                                : "Change user role"
                            }
                          >
                            <option value="STUDENT">Student</option>
                            <option value="TUTOR">Tutor</option>
                            <option value="ADMIN">Administrator</option>
                          </select>

                          {/* Delete Account */}
                          {!isCurrentAdmin && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              style={{
                                background: "var(--error-bg, #FEF2F2)",
                                color: "var(--error, #DC2626)",
                                border: "1px solid #FCA5A5",
                                padding: "0.35rem 0.65rem",
                                borderRadius: "6px",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                              title="Permanently delete user account"
                            >
                              <Trash2 size={14} aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
