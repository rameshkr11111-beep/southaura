"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FloatingActions } from "@/components/floating-actions";
import { AnalyticsTracker } from "@/components/analytics-tracker";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isVendor = pathname.startsWith("/vendor");

  if (isAdmin || isVendor) return <>{children}</>;

  return (
    <>
      <AnalyticsTracker />
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingActions />
    </>
  );
}
