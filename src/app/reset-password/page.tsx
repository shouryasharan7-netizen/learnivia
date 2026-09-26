import { Suspense } from "react";
import { Metadata } from "next";
import ResetPasswordClient from "./ResetPasswordClient";

export const metadata: Metadata = {
  title: "Set New Password | Learnivia",
  description: "Set a new password for your Learnivia account.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#FAF8F5",
          }}
        >
          <div style={{ color: "#78716C", fontSize: "0.95rem" }}>
            Loading...
          </div>
        </div>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
}
