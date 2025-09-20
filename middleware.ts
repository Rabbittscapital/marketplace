export { default } from "next-auth/middleware";
export const config = {
  matcher: ["/marketplace", "/project/:path*", "/unit/:path*", "/admin/:path*"]
};
