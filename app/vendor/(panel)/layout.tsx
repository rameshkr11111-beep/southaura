import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { auth } from "@/auth";
import { VendorShell } from "@/components/vendor/vendor-shell";

export const dynamic = "force-dynamic";

export default async function VendorPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/vendor/login");
  if (session.user.role === Role.CUSTOMER) redirect("/account");
  if (session.user.role !== Role.VENDOR) redirect("/admin");

  return <VendorShell user={{ name: session.user.name, email: session.user.email }}>{children}</VendorShell>;
}
