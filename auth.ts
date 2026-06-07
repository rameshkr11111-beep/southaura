import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  portal: z.enum(["admin", "customer", "vendor"]).optional().default("admin")
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret:
    process.env.AUTH_SECRET ??
    "southaura-development-secret-change-before-production",
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        portal: { label: "Portal", type: "text" }
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const { email, password, portal } = parsed.data;
        try {
          const user = await prisma.user.findUnique({ where: { email } });
          if (
            user?.passwordHash &&
            user.status === "ACTIVE" &&
            (portal === "customer"
              ? user.role === Role.CUSTOMER
              : portal === "vendor"
                ? user.role === Role.VENDOR
                : user.role !== Role.CUSTOMER && user.role !== Role.VENDOR) &&
            (await compare(password, user.passwordHash))
          ) {
            await prisma.user.update({
              where: { id: user.id },
              data: { lastLoginAt: new Date() }
            });
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
              role: user.role
            };
          }
        } catch {
          // Local demo access remains available before PostgreSQL is configured.
        }

        const demoEmail = process.env.ADMIN_EMAIL ?? "admin@southaura.in";
        const demoPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
        if (portal === "admin" && email === demoEmail && password === demoPassword) {
          return {
            id: "demo-super-admin",
            name: "DakshinKart Admin",
            email,
            role: Role.SUPER_ADMIN
          };
        }
        const customerEmail = process.env.CUSTOMER_DEMO_EMAIL ?? "meera@example.com";
        const customerPassword = process.env.CUSTOMER_DEMO_PASSWORD ?? "Welcome123!";
        if (portal === "customer" && email === customerEmail && password === customerPassword) {
          return {
            id: "demo-customer-meera",
            name: "Meera Khanna",
            email,
            role: Role.CUSTOMER
          };
        }
        const vendorEmail = process.env.VENDOR_DEMO_EMAIL ?? "vendor@southaura.in";
        const vendorPassword = process.env.VENDOR_DEMO_PASSWORD ?? "Vendor123!";
        if (portal === "vendor" && email === vendorEmail && password === vendorPassword) {
          return {
            id: "demo-vendor-ananya",
            name: "Ananya Iyer",
            email,
            role: Role.VENDOR
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? token.sub ?? "");
        session.user.role = (token.role as Role | undefined) ?? Role.CUSTOMER;
      }
      return session;
    },
    authorized({ auth: session, request }) {
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
      const isLogin = request.nextUrl.pathname === "/admin/login";
      const isVendorRoute = request.nextUrl.pathname.startsWith("/vendor");
      const isVendorLogin = request.nextUrl.pathname === "/vendor/login";
      if (isVendorRoute && !isVendorLogin) return Boolean(session?.user);
      if (!isAdminRoute || isLogin) return true;
      return Boolean(session?.user);
    }
  }
});
