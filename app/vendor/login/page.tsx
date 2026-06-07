import { redirect } from "next/navigation";
import { Boxes, ChartNoAxesCombined, IndianRupee, Store } from "lucide-react";
import { Role } from "@prisma/client";
import { auth } from "@/auth";
import { VendorLoginForm } from "@/components/vendor/vendor-login-form";

export default async function VendorLoginPage() {
  const session = await auth();
  if (session?.user?.role === Role.VENDOR) redirect("/vendor");

  return (
    <div className="grid min-h-screen bg-[#f5f6f4] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-[#173c2c] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full border border-[#d8b66c]/20" />
        <div>
          <span className="font-display text-3xl font-semibold">south<span className="text-[#d8b66c]">Aura</span></span>
          <span className="ml-3 rounded-full border border-white/15 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-white/50">Vendor Network</span>
        </div>
        <div className="relative max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d8b66c]">Build your South Indian brand</p>
          <h1 className="mt-5 font-display text-6xl font-semibold leading-[0.92]">Your shop. Our marketplace. Everywhere.</h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/60">List products, fulfil orders, manage inventory, create offers and receive transparent payouts from one seller workspace.</p>
          <div className="mt-10 grid grid-cols-2 gap-3">
            {[[Store, "Your branded shop"], [Boxes, "Products and inventory"], [ChartNoAxesCombined, "Sales analytics"], [IndianRupee, "Payout visibility"]].map(([Icon, label]) => {
              const ItemIcon = Icon as typeof Store;
              return <div key={String(label)} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] p-4 text-xs font-semibold"><ItemIcon className="h-4 w-4 text-[#d8b66c]" />{String(label)}</div>;
            })}
          </div>
        </div>
        <p className="text-[10px] text-white/35">Seller applications are reviewed before products become publicly visible.</p>
      </section>
      <section className="flex items-center justify-center p-5 sm:p-10">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a67c38]">Vendor login</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-slate-900">Welcome, seller.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">Manage your shop and grow with southAura.</p>
          <VendorLoginForm switchSession={Boolean(session?.user)} />
          <LinkHome />
        </div>
      </section>
    </div>
  );
}

function LinkHome() {
  return <a href="/" className="mt-6 block text-center text-[10px] font-bold text-slate-400 hover:text-slate-700">Return to storefront</a>;
}
