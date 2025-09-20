import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Crea el handler de NextAuth...
const handler = NextAuth(authOptions);

// ...y reexpórtalo con los métodos que Next.js espera:
export { handler as GET, handler as POST };
