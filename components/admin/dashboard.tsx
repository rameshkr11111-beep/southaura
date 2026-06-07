import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeIndianRupee,
  Boxes,
  CircleAlert,
  Clock3,
  PackageCheck,
  ShoppingBag,
  TrendingUp,
  Truck,
  Users
} from "lucide-react";
import { CategoryChart, RevenueChart, TrafficChart } from "@/components/admin/dashboard-charts";

const stats = [
  { label: "Today's revenue", value: "₹8,42,680", change: "+18.4%", icon: BadgeIndianRupee, tone: "green" },
  { label: "Today's orders", value: "186", change: "+12.8%", icon: ShoppingBag, tone: "gold" },
  { label: "Pending shipments", value: "64", change: "18 urgent", icon: Truck, tone: "red" },
  { label: "New customers", value: "48", change: "+24.6%", icon: Users, tone: "blue" }
];

const orders = [
  ["#DK10482", "Meera Khanna", "₹2,348", "Paid", "Processing", "12 min"],
  ["#DK10481", "Arjun Malhotra", "₹6,790", "Paid", "Packed", "24 min"],
  ["#DK10480", "Naina Kapoor", "₹1,524", "COD", "Confirmed", "41 min"],
  ["#DK10479", "Dev Menon", "₹4,285", "Paid", "Shipped", "58 min"],
  ["#DK10478", "Rhea Singh", "₹875", "Failed", "On hold", "1 hr"]
];

const activities = [
  [PackageCheck, "Order #DK10479 shipped", "Blue Dart · AWB 802184920", "4 min"],
  [Users, "New VIP customer identified", "Naina Kapoor crossed ₹1L LTV", "18 min"],
  [Boxes, "Low stock alert", "Temple Town Mysore Pak · 23 available", "32 min"],
  [TrendingUp, "Campaign milestone", "Monsoon edit generated ₹3.8L", "1 hr"]
];

export function Dashboard() {
  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#a67c38]">
            Friday · June 5, 2026
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-slate-950">
            Good evening, Admin.
          </h1>
          <p className="mt-2 text-xs text-slate-500">
            Here is what is happening across DakshinKart right now.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/analytics" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold shadow-sm">
            View reports
          </Link>
          <Link href="/admin/products" className="flex items-center gap-2 rounded-xl bg-[#173c2c] px-4 py-2.5 text-xs font-bold text-white shadow-sm">
            Add product <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className={`rounded-xl p-2.5 ${
                stat.tone === "green" ? "bg-emerald-50 text-emerald-700" :
                stat.tone === "gold" ? "bg-amber-50 text-amber-700" :
                stat.tone === "red" ? "bg-rose-50 text-rose-700" : "bg-blue-50 text-blue-700"
              }`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className={`rounded-full px-2 py-1 text-[9px] font-bold ${
                stat.change.includes("urgent") ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-700"
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="mt-5 text-2xl font-extrabold tracking-tight text-slate-950">{stat.value}</p>
            <p className="mt-1 text-[10px] font-medium text-slate-400">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.65fr_0.85fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900">Revenue performance</p>
              <p className="mt-1 text-[10px] text-slate-400">Last 7 days · All sales channels</p>
            </div>
            <select className="rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-semibold outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>This year</option>
            </select>
          </div>
          <div className="mt-4">
            <RevenueChart />
          </div>
        </div>
        <div className="rounded-2xl bg-[#173c2c] p-6 text-white shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#d8b66c]">CRM priority queue</p>
              <h2 className="mt-2 font-display text-3xl font-semibold">Customers needing attention.</h2>
            </div>
            <Users className="h-5 w-5 text-[#d8b66c]" />
          </div>
          <div className="mt-6 space-y-3">
            {[
              ["28 abandoned carts", "₹84,620 recoverable revenue"],
              ["7 follow-ups overdue", "Assigned to customer support"],
              ["12 VIP customers at risk", "No purchase in the last 60 days"]
            ].map(([title, copy], index) => (
              <div key={title} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-3.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d8b66c] text-[9px] font-extrabold text-[#173c2c]">
                  {index + 1}
                </span>
                <div>
                  <p className="text-[11px] font-bold">{title}</p>
                  <p className="mt-1 text-[9px] text-white/45">{copy}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/admin/customers" className="mt-5 flex items-center gap-2 text-[10px] font-bold text-[#d8b66c]">
            Open customer CRM <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.45fr_0.75fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <p className="text-sm font-bold">Recent orders</p>
              <p className="mt-1 text-[9px] text-slate-400">Live from all channels</p>
            </div>
            <Link href="/admin/orders" className="text-[10px] font-bold text-[#76531f]">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead className="bg-slate-50 text-[8px] uppercase tracking-[0.12em] text-slate-400">
                <tr>
                  {["Order", "Customer", "Total", "Payment", "Fulfilment", "Placed"].map((head) => (
                    <th key={head} className="px-5 py-3 font-bold">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {orders.map((row) => (
                  <tr key={row[0]} className="transition hover:bg-slate-50/70">
                    {row.map((cell, index) => (
                      <td key={cell} className={`px-5 py-4 ${index === 0 ? "font-bold text-[#173c2c]" : index === 3 || index === 4 ? "" : "text-slate-600"}`}>
                        {index === 3 || index === 4 ? (
                          <span className={`rounded-full px-2 py-1 text-[8px] font-bold ${
                            cell === "Failed" || cell === "On hold" ? "bg-rose-50 text-rose-700" :
                            cell === "Paid" || cell === "Shipped" ? "bg-emerald-50 text-emerald-700" :
                            "bg-amber-50 text-amber-700"
                          }`}>{cell}</span>
                        ) : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">Traffic sources</p>
              <p className="mt-1 text-[9px] text-slate-400">124 visitors live now</p>
            </div>
            <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Live
            </span>
          </div>
          <div className="mt-3"><TrafficChart /></div>
        </div>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold">Top categories</p>
          <p className="mt-1 text-[9px] text-slate-400">Revenue index · Last 30 days</p>
          <div className="mt-3"><CategoryChart /></div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold">Operational alerts</p>
            <CircleAlert className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-5 space-y-3">
            {[
              ["18 products out of stock", "Catalog", "High"],
              ["11 payment failures", "Payments", "Review"],
              ["7 courier SLA exceptions", "Delivery", "High"],
              ["GST return due in 15 days", "Accounting", "Upcoming"]
            ].map(([title, area, status]) => (
              <div key={title} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <span className={`h-2 w-2 rounded-full ${status === "High" ? "bg-rose-500" : "bg-amber-400"}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-bold">{title}</p>
                  <p className="mt-0.5 text-[8px] text-slate-400">{area}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold">Recent activity</p>
            <Clock3 className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-5 space-y-4">
            {activities.map(([Icon, title, copy, time]) => {
              const ActivityIcon = Icon as typeof PackageCheck;
              return (
                <div key={String(title)} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f1eadc] text-[#8a652d]">
                    <ActivityIcon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-bold">{String(title)}</p>
                    <p className="mt-0.5 truncate text-[8px] text-slate-400">{String(copy)}</p>
                  </div>
                  <span className="text-[8px] text-slate-300">{String(time)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
