import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// NextAuth v5: exporta los handlers así (sin destructuring)
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
