import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// En NextAuth v5 debes extraer handlers:
const { handlers } = NextAuth(authOptions);
export const { GET, POST } = handlers;
