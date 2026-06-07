"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bell, Menu, Search, Store, X } from "lucide-react";
import { vendorNavigation } from "@/lib/vendor-data";

function Sidebar({ mobile = false, close }: { mobile?: boolean; close?: () => void }) {
  const pathname = usePathname();
  return (
    <aside className={`${mobile ? "flex" : "hidden lg:flex"} h-full w-[270px] shrink-0 flex-col border-r border-slate-200 bg-[#10281e] text-white`}>
      <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-5">
        <Link href="/vendor"><span className="font-display text-2xl font-semibold">south<span className="text-[#d8b66c]">Aura</span></span><span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">Vendor Workspace</span></Link>
        {mobile && <button onClick={close}><X className="h-5 w-5" /></button>}
      </div>
      <div className="border-b border-white/10 p-4">
        <div className="rounded-xl bg-white/[0.07] p-3">
          <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d8b66c] text-[#10281e]"><Store className="h-4 w-4" /></span><div><p className="text-xs font-bold">Ananya Foods</p><p className="mt-0.5 text-[8px] text-amber-300">PENDING REVIEW</p></div></div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[82%] rounded-full bg-[#d8b66c]" /></div>
          <p className="mt-2 text-[8px] text-white/35">Shop setup 82% complete</p>
        </div>
      </div>
      <nav className="scrollbar-hide flex-1 overflow-y-auto px-3 py-4">
        {vendorNavigation.map((item) => {
          const active = item.href === "/vendor" ? pathname === "/vendor" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return <Link key={item.href} href={item.href} onClick={close} className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[11px] font-semibold transition ${active ? "bg-white text-[#10281e]" : "text-white/60 hover:bg-white/[0.07] hover:text-white"}`}><Icon className={`h-4 w-4 ${active ? "text-[#9b7432]" : "text-white/40"}`} /><span className="flex-1">{item.label}</span>{item.badge && <span className={`rounded-full px-2 py-0.5 text-[8px] ${active ? "bg-amber-100 text-amber-800" : "bg-white/10"}`}>{item.badge}</span>}</Link>;
        })}
      </nav>
      <div className="border-t border-white/10 p-4 text-[9px] text-white/40">Seller support · help@southaura.in</div>
    </aside>
  );
}

export function VendorShell({ children, user }: { children: React.ReactNode; user: { name?: string | null; email?: string | null } }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-[#f5f6f4] text-slate-900">
      <Sidebar />
      {mobileOpen && <div className="fixed inset-0 z-50 bg-slate-950/45 lg:hidden" onClick={() => setMobileOpen(false)}><div className="h-full w-[270px]" onClick={(event) => event.stopPropagation()}><Sidebar mobile close={() => setMobileOpen(false)} /></div></div>}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xl sm:px-6">
          <button onClick={() => setMobileOpen(true)} className="rounded-xl border border-slate-200 p-2.5 lg:hidden"><Menu className="h-5 w-5" /></button>
          <div className="flex h-10 min-w-0 max-w-md flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs text-slate-400"><Search className="h-4 w-4" /><span className="truncate">Search products, orders, customers...</span></div>
          <div className="ml-auto flex items-center gap-2">
            <button className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"><Bell className="h-[18px] w-[18px]" /><span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500" /></button>
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#173c2c] text-xs font-bold text-white">AI</span><div className="hidden sm:block"><p className="text-[11px] font-bold">{user.name ?? "Vendor"}</p><p className="text-[8px] text-slate-400">Shop owner</p></div></div>
          </div>
        </header>
        <main className="p-4 sm:p-6 xl:p-8">{children}</main>
      </div>
    </div>
  );
}
