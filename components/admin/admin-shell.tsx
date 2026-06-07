"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  ChevronDown,
  Command,
  HelpCircle,
  Menu,
  Search,
  X
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { adminNavigation } from "@/lib/admin-data";
import { AdminIcon } from "@/components/admin/icon";

function Sidebar({
  open,
  close
}: {
  open?: boolean;
  close?: () => void;
}) {
  const pathname = usePathname();
  return (
    <aside
      className={`flex h-full w-[270px] shrink-0 flex-col border-r border-slate-200 bg-[#0d1713] text-white ${
        open ? "" : "max-lg:hidden"
      }`}
    >
      <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-5">
        <Link href="/admin" className="leading-none">
          <span className="font-display text-2xl font-semibold">
            Dakshin<span className="text-[#d8b66c]">Kart</span>
          </span>
          <span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.22em] text-white/40">
            Commerce OS
          </span>
        </Link>
        {close && (
          <button type="button" onClick={close} className="rounded-lg p-2 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="scrollbar-hide flex-1 overflow-y-auto px-3 py-5">
        {adminNavigation.map((group) => (
          <div key={group.label} className="mb-6">
            <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12px] font-semibold transition ${
                      active
                        ? "bg-white text-[#132019] shadow-sm"
                        : "text-white/58 hover:bg-white/[0.07] hover:text-white"
                    }`}
                  >
                    <AdminIcon
                      name={item.icon}
                      className={`h-[17px] w-[17px] ${
                        active ? "text-[#9b7432]" : "text-white/45"
                      }`}
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${
                          active
                            ? "bg-[#efe4cc] text-[#76531f]"
                            : "bg-white/10 text-white/55"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 p-4">
        <div className="rounded-xl bg-white/[0.06] p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold">System health</span>
            <span className="flex items-center gap-1 text-[9px] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Operational
            </span>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[96%] rounded-full bg-emerald-400" />
          </div>
          <p className="mt-2 text-[9px] text-white/35">All services · 99.98% uptime</p>
        </div>
      </div>
    </aside>
  );
}

export function AdminShell({
  children,
  user
}: {
  children: React.ReactNode;
  user: { name?: string | null; email?: string | null; role?: string };
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f5f6f4] font-sans text-slate-900">
      <Sidebar />
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="h-full w-[270px]"
              onClick={(event) => event.stopPropagation()}
            >
              <Sidebar open close={() => setMobileOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-xl border border-slate-200 p-2.5 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="flex h-10 min-w-0 max-w-md flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 text-left text-xs text-slate-400 transition hover:border-slate-300 sm:px-4"
          >
            <Search className="h-4 w-4" />
            <span className="truncate">Search orders, products, customers...</span>
            <span className="ml-auto hidden items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[9px] font-bold text-slate-400 sm:flex">
              <Command className="h-3 w-3" /> K
            </span>
          </button>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button className="hidden rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 sm:block">
              <HelpCircle className="h-[18px] w-[18px]" />
            </button>
            <button className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
            </button>
            <div className="ml-1 flex items-center gap-2 border-l border-slate-200 pl-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#173c2c] text-xs font-bold text-white">
                {(user.name ?? "DA")
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="hidden leading-tight md:block">
                <p className="text-[11px] font-bold">{user.name ?? "DakshinKart Admin"}</p>
                <p className="mt-0.5 text-[9px] text-slate-400">
                  {(user.role ?? "SUPER_ADMIN").replaceAll("_", " ")}
                </p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" />
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 xl:p-8">{children}</main>
      </div>

      <AnimatePresence>
        {commandOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-slate-950/45 p-4 backdrop-blur-sm"
            onClick={() => setCommandOpen(false)}
          >
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
              className="mx-auto mt-[10vh] max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-slate-200 px-5">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  autoFocus
                  className="h-16 flex-1 text-sm outline-none"
                  placeholder="Search everything in DakshinKart..."
                />
                <button onClick={() => setCommandOpen(false)} className="text-xs text-slate-400">
                  ESC
                </button>
              </div>
              <div className="p-3">
                <p className="px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Quick actions
                </p>
                {[
                  ["Package", "Add a new product", "/admin/products"],
                  ["ShoppingBag", "Find an order", "/admin/orders"],
                  ["Users", "Open customer CRM", "/admin/customers"],
                  ["ListTodo", "Review follow-ups", "/admin/follow-ups"]
                ].map(([icon, label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setCommandOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-slate-50"
                  >
                    <AdminIcon name={icon} className="h-4 w-4 text-[#a67c38]" />
                    {label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
