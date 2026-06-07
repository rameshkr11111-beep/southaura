import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (session.user.role === Role.CUSTOMER) redirect("/account");
  if (session.user.role === Role.VENDOR) redirect("/vendor");

  return (
    <AdminShell
      user={{
        name: session.user.name,
        email: session.user.email,
        role: session.user.role
      }}
    >
      {children}
    </AdminShell>
  );
}
