"use client";

import React, { useState } from "react";
import { MessageSquare, X, Send, CheckCircle2, Calendar, HelpCircle } from "lucide-react";
import { sendTutorInquiry } from "./actions";
import styles from "./page.module.css";
import Link from "next/link";

interface TutorMessageButtonProps {
  tutorId: string;
  tutorName: string;
  isSignedIn?: boolean;
}

export function TutorMessageButton({
  tutorId,
  tutorName,
  isSignedIn = true,
}: TutorMessageButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("tutorId", tutorId);
    formData.append("subject", subject || "Tutoring Session Inquiry");
    formData.append("message", message);

    try {
      const res = await sendTutorInquiry(formData);
      if (res.success) {
        setSentSuccess(true);
      } else {
        setErrorMsg(res.error || "Failed to send message. Please try again.");
      }
    } catch {
      setErrorMsg("Please sign in to message this tutor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSentSuccess(false);
    setErrorMsg(null);
    setMessage("");
    setSubject("");
  };

  return (
    <>
      <button
        type="button"
        className={styles.messageBtn}
        onClick={() => setIsOpen(true)}
        aria-label={`Send a message to ${tutorName}`}
      >
        <MessageSquare size={15} aria-hidden="true" style={{ marginRight: "0.4rem" }} />
        <span>Message</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="message-modal-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            padding: "1rem",
          }}
          onClick={handleClose}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              maxWidth: "520px",
              width: "100%",
              padding: "1.75rem",
              position: "relative",
              border: "1px solid #E2E8F0",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.25rem",
                borderBottom: "1px solid #F1F5F9",
                paddingBottom: "1rem",
              }}
            >
              <div>
                <h2
                  id="message-modal-title"
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#0F172A",
                    margin: 0,
                  }}
                >
                  Message {tutorName}
                </h2>
                <p
                  style={{
                    margin: "0.25rem 0 0",
                    fontSize: "0.85rem",
                    color: "#64748B",
                  }}
                >
                  Ask a question about availability, curriculum, or session plans.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close message modal"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#94A3B8",
                  padding: "0.4rem",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            {sentSuccess ? (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    backgroundColor: "#DCFCE7",
                    color: "#15803D",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>
                <h3
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "#0F172A",
                    margin: "0 0 0.5rem",
                  }}
                >
                  Message Sent to {tutorName}!
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#475569",
                    lineHeight: 1.5,
                    maxWidth: "380px",
                    margin: "0 auto 1.5rem",
                  }}
                >
                  Your inquiry has been delivered in real time. Mentors typically reply within a few hours.
                </p>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                  <button
                    type="button"
                    onClick={handleClose}
                    style={{
                      padding: "0.6rem 1.25rem",
                      borderRadius: "8px",
                      border: "1px solid #CBD5E1",
                      backgroundColor: "#F8FAFC",
                      color: "#334155",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      cursor: "pointer",
                    }}
                  >
                    Done
                  </button>
                  <a
                    href="#booking-calendar"
                    onClick={handleClose}
                    style={{
                      padding: "0.6rem 1.25rem",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "#15803D",
                      color: "#FFFFFF",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <Calendar size={14} /> Book a Slot Now
                  </a>
                </div>
              </div>
            ) : !isSignedIn ? (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <p style={{ color: "#475569", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                  Please sign in to send direct inquiries and coordinate appointments with verified educators.
                </p>
                <Link
                  href={`/signin?callbackUrl=/tutor/${tutorId}`}
                  style={{
                    display: "inline-block",
                    padding: "0.65rem 1.5rem",
                    backgroundColor: "#15803D",
                    color: "#fff",
                    borderRadius: "8px",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Sign In to Continue
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {errorMsg && (
                  <div
                    style={{
                      backgroundColor: "#FEE2E2",
                      border: "1px solid #FCA5A5",
                      color: "#991B1B",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {errorMsg}
                  </div>
                )}

                <div style={{ marginBottom: "1rem" }}>
                  <label
                    htmlFor="inquiry-subject"
                    style={{
                      display: "block",
                      fontSize: "0.825rem",
                      fontWeight: 600,
                      color: "#334155",
                      marginBottom: "0.35rem",
                    }}
                  >
                    Subject
                  </label>
                  <input
                    id="inquiry-subject"
                    type="text"
                    placeholder="e.g. Question regarding Algebra session or schedule availability"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "8px",
                      border: "1px solid #CBD5E1",
                      fontSize: "0.9rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label
                    htmlFor="inquiry-message"
                    style={{
                      display: "block",
                      fontSize: "0.825rem",
                      fontWeight: 600,
                      color: "#334155",
                      marginBottom: "0.35rem",
                    }}
                  >
                    Your Message <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <textarea
                    id="inquiry-message"
                    required
                    rows={4}
                    placeholder="Hi! I was wondering if you could help with..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "8px",
                      border: "1px solid #CBD5E1",
                      fontSize: "0.9rem",
                      outline: "none",
                      resize: "vertical",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid #F1F5F9",
                  }}
                >
                  <Link
                    href="/homework-help"
                    style={{
                      fontSize: "0.825rem",
                      color: "#64748B",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      textDecoration: "none",
                    }}
                  >
                    <HelpCircle size={14} /> Need quick homework help?
                  </Link>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={handleClose}
                      style={{
                        padding: "0.55rem 1rem",
                        borderRadius: "8px",
                        border: "1px solid #E2E8F0",
                        background: "#fff",
                        color: "#475569",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !message.trim()}
                      style={{
                        padding: "0.55rem 1.25rem",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "#15803D",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        cursor: isSubmitting || !message.trim() ? "not-allowed" : "pointer",
                        opacity: isSubmitting || !message.trim() ? 0.7 : 1,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <Send size={14} />
                      {isSubmitting ? "Sending..." : "Send"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
