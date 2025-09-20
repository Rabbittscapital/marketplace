import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { compare } from "bcryptjs";

export const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(creds) {
        const email = (creds?.email || "").toString().toLowerCase();
        const pass = (creds?.password || "").toString();
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        const ok = await compare(pass, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role } as any;
      }
    })
  ],
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) (token as any).role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      (session as any).role = (token as any).role;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};
