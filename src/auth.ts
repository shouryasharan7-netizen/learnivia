import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    ...authConfig.providers,
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const email = (credentials.email as string).trim().toLowerCase();
        const user = await prisma.user.findUnique({
          where: { email },
          include: { tutorProfile: true },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password as string, user.password);
        if (!isValid) return null;

        // Auto-elevate designated admin if needed
        const isAdminEmail =
          email === "shouryasharan7@gmail.com" ||
          email === "ahmedashfaqfarooqui@gmail.com" ||
          (process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()).includes(email) ?? false);

        if (isAdminEmail && user.role !== "ADMIN") {
          return await prisma.user.update({
            where: { id: user.id },
            data: { role: "ADMIN" },
          });
        }

        return user;
      },
    }),
  ],
  events: {
    async signIn({ user }) {
      if (user.email) {
        const normalizedEmail = user.email.trim().toLowerCase();
        const isAdminEmail =
          normalizedEmail === "shouryasharan7@gmail.com" ||
          normalizedEmail === "ahmedashfaqfarooqui@gmail.com" ||
          (process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()).includes(normalizedEmail) ?? false);

        if (isAdminEmail) {
          try {
            await prisma.user.updateMany({
              where: { email: normalizedEmail },
              data: { role: "ADMIN" },
            });
          } catch (e) {
            console.error("Failed to elevate admin role on sign in:", e);
          }
        }
      }
    },
  },
});
