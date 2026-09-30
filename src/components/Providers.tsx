"use client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import type { ReactNode } from "react";
import type { Session } from "next-auth";

export function Providers({
  children,
  session,
}: {
  children: ReactNode;
  session?: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </SessionProvider>
  );
}
