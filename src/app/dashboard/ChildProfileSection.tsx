"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Plus, X, GraduationCap, Trash2, FileText } from "lucide-react";
import { createChildProfile, deleteChildProfile } from "@/app/actions/children";

interface ChildProfile {
  id: string;
  firstName: string;
  lastInitial: string;
  grade: string;
  age: number | null;
  learningPreferences?: string | null;
  notes?: string | null;
}

interface ChildProfileSectionProps {
  initialProfiles: ChildProfile[];
}

export default function ChildProfileSection({ initialProfiles }: ChildProfileSectionProps) {
  const [profiles, setProfiles] = useState<ChildProfile[]>(initialProfiles);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastInitial, setLastInitial] = useState("");
  const [grade, setGrade] = useState("Grade 4");
  const [age, setAge] = useState("");
  const [notes, setNotes] = useState("");

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastInitial", lastInitial);
      formData.append("grade", grade);
      formData.append("age", age);
      formData.append("notes", notes);

      const res = await createChildProfile(formData);
      if (res.success && res.profile) {
        setProfiles((prev) => [res.profile as ChildProfile, ...prev]);
        setSuccessMsg(`Added ${res.profile.firstName} ${res.profile.lastInitial} successfully!`);
        setFirstName("");
        setLastInitial("");
        setAge("");
        setNotes("");
        setIsOpen(false);
      } else {
        setErrorMsg(res.error || "Failed to add child profile.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChild = async (childId: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name}'s profile?`)) return;

    try {
      const res = await deleteChildProfile(childId);
      if (res.success) {
        setProfiles((prev) => prev.filter((c) => c.id !== childId));
        setSuccessMsg(`Profile removed.`);
      } else {
        setErrorMsg(res.error || "Failed to remove child profile.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <section
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "16px",
        padding: "1.5rem",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
          marginBottom: "1rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Users size={20} color="var(--color-forest, #234B3B)" />
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
              Parent Hub: Managed Child Profiles (K–10)
            </h2>
          </div>
          <p style={{ color: "#64748B", fontSize: "0.85rem", margin: "0.25rem 0 0 0" }}>
            Safely register your children to book personalized 1-on-1 tutoring sessions and live workshops.
            For minor privacy protection, only First Name + Last Initial are displayed to tutors.
          </p>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            background: isOpen ? "#F1F5F9" : "var(--color-forest, #234B3B)",
            color: isOpen ? "#475569" : "#FFFFFF",
            border: isOpen ? "1px solid #CBD5E1" : "none",
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
            transition: "all 150ms ease",
          }}
        >
          {isOpen ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add Child (K–10)</>}
        </button>
      </div>

      {errorMsg && (
        <div
          style={{
            background: "#FEF2F2",
            border: "1px solid #FCA5A5",
            color: "#B91C1C",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            fontSize: "0.85rem",
            marginBottom: "1rem",
          }}
        >
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div
          style={{
            background: "#F0FDF4",
            border: "1px solid #86EFAC",
            color: "#15803D",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            fontSize: "0.85rem",
            marginBottom: "1rem",
          }}
        >
          {successMsg}
        </div>
      )}

      {/* Add Child Form */}
      {isOpen && (
        <form
          onSubmit={handleAddChild}
          style={{
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "12px",
            padding: "1.25rem",
            marginBottom: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div style={{ fontWeight: 700, color: "#0F172A", fontSize: "0.95rem" }}>
            Add a New Student Profile
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem" }}>
                First Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Maya"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                maxLength={40}
                style={{
                  width: "100%",
                  padding: "0.55rem 0.75rem",
                  borderRadius: "6px",
                  border: "1px solid #CBD5E1",
                  fontSize: "0.9rem",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem" }}>
                Last Initial * (Privacy Protected)
              </label>
              <input
                type="text"
                placeholder="e.g. K"
                value={lastInitial}
                onChange={(e) => setLastInitial(e.target.value)}
                required
                maxLength={2}
                style={{
                  width: "100%",
                  padding: "0.55rem 0.75rem",
                  borderRadius: "6px",
                  border: "1px solid #CBD5E1",
                  fontSize: "0.9rem",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem" }}>
                Grade Level (K–10) *
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.55rem 0.75rem",
                  borderRadius: "6px",
                  border: "1px solid #CBD5E1",
                  fontSize: "0.9rem",
                  background: "#FFFFFF",
                }}
              >
                <option value="Kindergarten">Kindergarten (Age 5–6)</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem" }}>
                Age (Optional)
              </label>
              <input
                type="number"
                min={4}
                max={17}
                placeholder="e.g. 9"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.55rem 0.75rem",
                  borderRadius: "6px",
                  border: "1px solid #CBD5E1",
                  fontSize: "0.9rem",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem" }}>
              Parent Notes & Focus Areas (Shared with tutors)
            </label>
            <textarea
              placeholder="e.g. Needs help with fractions and word problems; learns best with visual examples."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              style={{
                width: "100%",
                padding: "0.55rem 0.75rem",
                borderRadius: "6px",
                border: "1px solid #CBD5E1",
                fontSize: "0.9rem",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "1px solid #CBD5E1",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#64748B",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "#0E8345",
                color: "#FFFFFF",
                border: "none",
                padding: "0.5rem 1.25rem",
                borderRadius: "6px",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Saving..." : "Save Child Profile"}
            </button>
          </div>
        </form>
      )}

      {/* Profiles List */}
      {profiles.length === 0 ? (
        <div
          style={{
            background: "#F8FAFC",
            border: "1px dashed #CBD5E1",
            borderRadius: "10px",
            padding: "1.5rem",
            textAlign: "center",
            color: "#64748B",
            fontSize: "0.9rem",
          }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: "50%", background: "var(--bg-canvas, #F4F0E8)", color: "var(--text-muted, #66716A)", margin: "0 auto 0.75rem auto" }}>
            <GraduationCap size={24} />
          </div>
          <strong>No child profiles registered yet.</strong>
          <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.825rem" }}>
            Add your child's profile above so you can book 1-on-1 tutoring or workshops on their behalf.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {profiles.map((child) => (
            <div
              key={child.id}
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "10px",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "#0E8345",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "0.95rem",
                    }}
                  >
                    {child.firstName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#0F172A" }}>
                      {child.firstName} {child.lastInitial}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.15rem" }}>
                      <span
                        style={{
                          background: "#E6F4EA",
                          color: "#0E8345",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          padding: "0.1rem 0.4rem",
                          borderRadius: "4px",
                        }}
                      >
                        {child.grade}
                      </span>
                      {child.age && (
                        <span style={{ fontSize: "0.75rem", color: "#64748B" }}>
                          Age {child.age}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteChild(child.id, `${child.firstName} ${child.lastInitial}`)}
                  title="Remove child profile"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "none",
                    border: "none",
                    color: "#94A3B8",
                    cursor: "pointer",
                    padding: "0.2rem 0.4rem",
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {child.notes && (
                <p
                  style={{
                    margin: "0.25rem 0 0 0",
                    fontSize: "0.8rem",
                    color: "#475569",
                    background: "#FFFFFF",
                    padding: "0.4rem 0.6rem",
                    borderRadius: "6px",
                    border: "1px solid #E2E8F0",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <FileText size={13} style={{ flexShrink: 0 }} /> {child.notes}
                </p>
              )}

              <div style={{ marginTop: "auto", paddingTop: "0.5rem" }}>
                <Link
                  href={`/find?grade=${encodeURIComponent(child.grade)}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#0E8345",
                    textDecoration: "none",
                  }}
                >
                  Find {child.grade} Tutors →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
