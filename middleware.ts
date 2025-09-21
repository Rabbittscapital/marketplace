import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const path = req.nextUrl.pathname;

      // Rutas admin
      if (path.startsWith("/admin")) {
        return token?.role === "ADMIN";
      }
      // Rutas privadas (broker logueado)
      if (path.startsWith("/dashboard")) {
        return !!token;
      }
      return true;
    },
  },
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/api/clients/:path*", // proteger APIs privadas
    "/api/quotes/mine",
    "/api/projects/:path*",
    "/api/units/bulk",
  ],
};
