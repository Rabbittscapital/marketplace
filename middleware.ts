// middleware.ts (v4)
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/proyectos/:path*", "/unidad/:path*"]
};
