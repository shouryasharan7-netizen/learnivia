import { Metadata } from "next";
import ForgotPasswordClient from "./ForgotPasswordClient";

export const metadata: Metadata = {
  title: "Reset Password | Learnivia",
  description: "Request a password reset link for your Learnivia account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
