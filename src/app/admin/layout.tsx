import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-user";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin?callbackUrl=/admin");
  }

  if (!user.isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div style={{ width: "100%", maxWidth: "1140px", margin: "0 auto" }}>
      {children}
    </div>
  );
}
