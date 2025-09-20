import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// En NextAuth v5, NextAuth devuelve un objeto con los handlers
const authHandler = NextAuth(authOptions);

export const { GET, POST } = authHandler;
