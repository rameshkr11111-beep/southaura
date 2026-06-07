"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  CalendarCheck,
  ChevronRight,
  Download,
  Filter,
  MessageCircle,
  Plus,
  Search,
  ShoppingCart,
  UserPlus,
  Users
} from "lucide-react";
import {
  abandonedCarts,
  crmConversations,
  crmCustomers,
  crmTasks
} from "@/lib/crm-data";

export function CrmDashboard() {
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState("All customers");
  const customers = crmCustomers.filter(
    (customer) =>
      (segment === "All customers" || customer.segment === segment) &&
      [customer.name, customer.email, customer.phone, ...customer.tags]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#a67c38]">
            Customer relationship management
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-slate-950">
            Customer CRM
          </h1>
          <p className="mt-2 text-xs text-slate-500">
            Customer profiles, order history, support, segments and retention work in one place.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold">
            <Download className="h-4 w-4" /> Export
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-[#173c2c] px-4 py-2.5 text-xs font-bold text-white">
            <UserPlus className="h-4 w-4" /> Add customer
          </button>
        </div>
      </div>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total customers", "48,392", "+1,284 this month", Users],
          ["Repeat purchase rate", "42.8%", "+3.2% this quarter", ShoppingCart],
          ["Open conversations", "18", "8 unread", MessageCircle],
          ["Follow-ups due", "12", "7 overdue", CalendarCheck]
        ].map(([label, value, change, Icon]) => {
          const CardIcon = Icon as typeof Users;
          return (
            <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <CardIcon className="h-5 w-5 text-[#a67c38]" />
                <span className="text-[9px] font-bold text-emerald-700">{String(change)}</span>
              </div>
              <p className="mt-4 text-2xl font-extrabold">{String(value)}</p>
              <p className="mt-1 text-[10px] text-slate-400">{String(label)}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_0.8fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="min-w-0 flex-1 text-xs outline-none"
                  placeholder="Search name, email, phone or tag..."
                />
              </label>
              <select
                value={segment}
                onChange={(event) => setSegment(event.target.value)}
                className="h-10 rounded-xl border border-slate-200 px-3 text-xs font-semibold outline-none"
              >
                {["All customers", "VIP", "International", "Corporate", "Repeat", "At risk"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <button className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-bold">
                <Filter className="h-4 w-4" /> More
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50 text-[8px] uppercase tracking-[0.12em] text-slate-400">
                <tr>
                  {["Customer", "Segment & tags", "Orders", "Total spent", "Est. LTV", "Last order", "Status", ""].map((head) => (
                    <th key={head} className="px-4 py-3 font-bold">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-4">
                      <Link href={`/admin/customers/${customer.id}`} className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf2ee] text-[10px] font-extrabold text-[#173c2c]">
                          {customer.initials}
                        </span>
                        <span>
                          <span className="block text-[11px] font-bold text-slate-900">{customer.name}</span>
                          <span className="mt-0.5 block text-[8px] text-slate-400">{customer.email}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-[8px] font-bold text-amber-700">{customer.segment}</span>
                      <p className="mt-1.5 text-[8px] text-slate-400">{customer.tags.join(" · ")}</p>
                    </td>
                    <td className="px-4 py-4 text-[10px] font-bold">{customer.orders}</td>
                    <td className="px-4 py-4 text-[10px] font-bold">{customer.spent}</td>
                    <td className="px-4 py-4 text-[10px] text-slate-500">{customer.ltv}</td>
                    <td className="px-4 py-4 text-[9px] text-slate-500">{customer.lastOrder}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-2 py-1 text-[8px] font-bold ${
                        customer.status === "At risk" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
                      }`}>{customer.status}</span>
                    </td>
                    <td className="px-4 py-4">
                      <Link href={`/admin/customers/${customer.id}`}><ChevronRight className="h-4 w-4 text-slate-300" /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">Follow-ups</p>
                <p className="mt-1 text-[9px] text-slate-400">Tasks requiring team action</p>
              </div>
              <Link href="/admin/follow-ups" className="text-[9px] font-bold text-[#76531f]">View all</Link>
            </div>
            <div className="mt-4 space-y-3">
              {crmTasks.slice(0, 3).map((task) => (
                <div key={task.title} className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold">{task.title}</p>
                      <p className="mt-1 text-[8px] text-slate-400">{task.customer} · {task.owner}</p>
                    </div>
                    <span className="rounded-full bg-rose-50 px-2 py-1 text-[7px] font-bold text-rose-700">{task.priority}</span>
                  </div>
                  <p className="mt-2 text-[8px] font-semibold text-amber-700">{task.due}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">Customer inbox</p>
                <p className="mt-1 text-[9px] text-slate-400">WhatsApp, email and support</p>
              </div>
              <span className="rounded-full bg-rose-500 px-2 py-1 text-[8px] font-bold text-white">6 unread</span>
            </div>
            <div className="mt-4 space-y-1">
              {crmConversations.slice(0, 3).map((conversation) => (
                <div key={conversation.customer} className="flex gap-3 rounded-xl p-2.5 hover:bg-slate-50">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <MessageCircle className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold">{conversation.customer}</p>
                      <span className="text-[7px] text-slate-300">{conversation.time}</span>
                    </div>
                    <p className="mt-1 truncate text-[8px] text-slate-400">{conversation.preview}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold">Abandoned cart recovery</p>
            <p className="mt-1 text-[9px] text-slate-400">₹84,620 recoverable revenue today</p>
          </div>
          <Link href="/admin/abandoned-carts" className="flex items-center gap-2 text-[9px] font-bold text-[#76531f]">
            Open recovery queue <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {abandonedCarts.map((cart) => (
            <div key={`${cart.customer}-${cart.age}`} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold">{cart.customer}</p>
                  <p className="mt-1 text-[8px] text-slate-400">{cart.contact}</p>
                </div>
                <span className="text-xs font-extrabold">{cart.value}</span>
              </div>
              <p className="mt-3 truncate text-[8px] text-slate-500">{cart.items}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[8px] text-amber-700">{cart.age} ago</span>
                <button className="rounded-lg bg-[#173c2c] px-2.5 py-1.5 text-[8px] font-bold text-white">
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
