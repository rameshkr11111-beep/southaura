import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { ArrowRight, Gift, Heart, MapPin, PackageCheck, Sparkles, Star, UserRound } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CustomerAccountActions } from "@/components/customer-account-actions";

export const metadata: Metadata = {
  title: "Your Account",
  description: "View your southAura orders, loyalty points and account details."
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== Role.CUSTOMER) redirect("/login");

  let profile = {
    name: session.user.name ?? "southAura customer",
    email: session.user.email ?? "",
    phone: "+91 98111 22334",
    loyaltyPoints: 1840,
    orderCount: 18,
    totalSpent: 42680,
    addresses: [{ city: "Gurugram", state: "Haryana", country: "India" }],
    orders: [
      { orderNumber: "DK10482", status: "PROCESSING", grandTotal: 2348, createdAt: new Date("2026-06-05"), itemCount: 5 },
      { orderNumber: "DK09814", status: "DELIVERED", grandTotal: 1842, createdAt: new Date("2026-05-18"), itemCount: 3 },
      { orderNumber: "DK09126", status: "DELIVERED", grandTotal: 3296, createdAt: new Date("2026-04-24"), itemCount: 6 }
    ]
  };

  try {
    if (!session.user.id.startsWith("demo-")) {
      const customer = await prisma.customer.findFirst({
        where: { OR: [{ userId: session.user.id }, { email: session.user.email ?? undefined }] },
        include: {
          addresses: { orderBy: { isDefault: "desc" }, take: 3 },
          orders: { orderBy: { createdAt: "desc" }, take: 8, include: { _count: { select: { items: true } } } }
        }
      });
      if (customer) {
        profile = {
          name: `${customer.firstName} ${customer.lastName ?? ""}`.trim(),
          email: customer.email ?? session.user.email ?? "",
          phone: customer.phone ?? "",
          loyaltyPoints: customer.loyaltyPoints,
          orderCount: customer.orderCount,
          totalSpent: Number(customer.totalSpent),
          addresses: customer.addresses.map((address) => ({ city: address.city, state: address.state, country: address.country })),
          orders: customer.orders.map((order) => ({
            orderNumber: order.orderNumber,
            status: order.status,
            grandTotal: Number(order.grandTotal),
            createdAt: order.createdAt,
            itemCount: order._count.items
          }))
        };
      }
    }
  } catch {
    // Demo profile remains available until PostgreSQL is configured.
  }

  return (
    <div className="container-shell py-10 sm:py-14">
      <section className="overflow-hidden rounded-[30px] bg-[#173c2c] text-white">
        <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end lg:p-12">
          <div>
            <p className="eyebrow !text-sandal">Your southAura</p>
            <h1 className="mt-3 font-display text-5xl font-semibold">Welcome, {profile.name.split(" ")[0]}.</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/60">Follow orders, revisit favourites and enjoy the benefits you have collected along the way.</p>
          </div>
          <CustomerAccountActions />
        </div>
        <div className="grid border-t border-white/10 sm:grid-cols-3">
          {[
            [Star, profile.loyaltyPoints.toLocaleString("en-IN"), "loyalty points"],
            [PackageCheck, String(profile.orderCount), "lifetime orders"],
            [Gift, `₹${profile.totalSpent.toLocaleString("en-IN")}`, "total purchases"]
          ].map(([Icon, value, label]) => {
            const MetricIcon = Icon as typeof Star;
            return <div key={String(label)} className="flex items-center gap-3 border-b border-white/10 px-6 py-5 last:border-0 sm:border-b-0 sm:border-r"><MetricIcon className="h-5 w-5 text-sandal" /><div><p className="text-xl font-bold">{String(value)}</p><p className="text-[8px] uppercase tracking-[0.13em] text-white/40">{String(label)}</p></div></div>;
          })}
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.42fr]">
        <section className="rounded-[26px] border border-ink/10 bg-white/60 p-6 dark:border-white/10 dark:bg-white/5 sm:p-8">
          <div className="flex items-center justify-between"><div><p className="eyebrow">Recent purchases</p><h2 className="mt-2 font-display text-3xl font-semibold">Your orders</h2></div><Link href="/track-order" className="text-[9px] font-bold uppercase tracking-wider text-brass">Track an order</Link></div>
          <div className="mt-6 divide-y divide-ink/10 dark:divide-white/10">
            {profile.orders.map((order) => (
              <div key={order.orderNumber} className="grid gap-3 py-5 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                <div><p className="text-sm font-bold">#{order.orderNumber}</p><p className="mt-1 text-[9px] text-ink/45 dark:text-white/45">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {order.itemCount} items</p></div>
                <span className={`w-fit rounded-full px-3 py-1.5 text-[8px] font-bold ${order.status === "DELIVERED" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{order.status.replaceAll("_", " ")}</span>
                <p className="text-sm font-bold">₹{order.grandTotal.toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
        </section>
        <aside className="space-y-5">
          <div className="rounded-[26px] border border-ink/10 bg-white/60 p-6 dark:border-white/10 dark:bg-white/5">
            <UserRound className="h-5 w-5 text-brass" /><h2 className="mt-4 font-display text-2xl font-semibold">Account details</h2><p className="mt-4 text-xs font-bold">{profile.email}</p><p className="mt-2 text-xs text-ink/50 dark:text-white/50">{profile.phone || "No phone saved"}</p>
            {profile.addresses[0] && <p className="mt-4 flex gap-2 text-[10px] leading-5 text-ink/50 dark:text-white/50"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brass" /> {profile.addresses[0].city}, {profile.addresses[0].state}, {profile.addresses[0].country}</p>}
          </div>
          <Link href="/wishlist" className="group block rounded-[26px] bg-sandal/20 p-6"><Heart className="h-5 w-5 text-vermilion" /><h2 className="mt-4 font-display text-2xl font-semibold">Your saved collection</h2><p className="mt-2 text-xs leading-5 text-ink/55">Return to products you loved and continue shopping.</p><span className="mt-5 inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider">Open wishlist <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span></Link>
          <div className="rounded-[26px] bg-mist/70 p-6 dark:bg-white/5"><Sparkles className="h-5 w-5 text-brass" /><p className="mt-3 text-xs leading-6 text-ink/60 dark:text-white/60">Need help with an order? Dakshin AI Assistant can verify and track it securely, or connect you with our team.</p></div>
        </aside>
      </div>
    </div>
  );
}
