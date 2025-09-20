export { auth as middleware } from "next-auth";

export const config = {
  matcher: ["/marketplace", "/project/:path*", "/unit/:path*", "/admin/:path*"]
};
