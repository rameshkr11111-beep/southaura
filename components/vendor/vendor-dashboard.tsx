import Link from "next/link";
import { ArrowRight, BadgeCheck, Boxes, CircleDollarSign, PackageCheck, ShoppingBag, Star, Store, TrendingUp, Truck } from "lucide-react";
import { vendorOrders, vendorProducts } from "@/lib/vendor-data";

export function VendorDashboard() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#a67c38]">Saturday, 6 June</p><h1 className="mt-2 font-display text-4xl font-semibold">Good morning, Ananya.</h1><p className="mt-2 text-xs text-slate-500">Here is what needs attention across Ananya Foods today.</p></div>
        <div className="flex gap-2"><Link href="/vendor/shop" className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-[10px] font-bold">View shop</Link><Link href="/vendor/products" className="rounded-xl bg-[#173c2c] px-4 py-3 text-[10px] font-bold text-white">Add product</Link></div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[[ShoppingBag, "Today's orders", "8", "₹18,420"], [CircleDollarSign, "Today's revenue", "₹18.4K", "+16.8%"], [Truck, "Pending dispatch", "5", "Before 4 PM"], [Star, "Shop rating", "4.8", "216 reviews"]].map(([Icon, label, value, detail]) => {
          const MetricIcon = Icon as typeof ShoppingBag;
          return <article key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-[#a67c38]"><MetricIcon className="h-5 w-5" /></span><TrendingUp className="h-4 w-4 text-emerald-500" /></div><p className="mt-5 text-[9px] font-bold uppercase tracking-wider text-slate-400">{String(label)}</p><p className="mt-1 text-2xl font-bold">{String(value)}</p><p className="mt-1 text-[9px] text-slate-400">{String(detail)}</p></article>;
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 p-5"><div><p className="text-[9px] font-bold uppercase tracking-wider text-[#a67c38]">Sales</p><h2 className="mt-1 font-display text-2xl font-semibold">Recent orders</h2></div><Link href="/vendor/orders" className="text-[9px] font-bold text-[#76531f]">View all</Link></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left"><thead className="bg-slate-50 text-[8px] uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-3">Order</th><th>Customer</th><th>Amount</th><th>Status</th><th>Received</th></tr></thead><tbody>{vendorOrders.map((order) => <tr key={order[0]} className="border-t border-slate-100 text-[10px]"><td className="px-5 py-4 font-bold">{order[0]}</td><td>{order[1]}</td><td className="font-bold">{order[2]}</td><td><span className="rounded-full bg-amber-50 px-2 py-1 text-[8px] font-bold text-amber-700">{order[3]}</span></td><td className="text-slate-400">{order[4]}</td></tr>)}</tbody></table></div>
        </div>
        <div className="rounded-2xl bg-[#173c2c] p-6 text-white">
          <p className="text-[9px] font-bold uppercase tracking-wider text-[#d8b66c]">Launch checklist</p><h2 className="mt-2 font-display text-3xl font-semibold">Your shop is 82% ready.</h2>
          <div className="mt-6 space-y-4">{[["Business profile", true], ["GST and PAN", true], ["Bank verification", false], ["Return address", true], ["First 5 products", false]].map(([label, done]) => <div key={String(label)} className="flex items-center gap-3 text-xs"><span className={`flex h-6 w-6 items-center justify-center rounded-full ${done ? "bg-emerald-500" : "border border-white/20"}`}>{done ? <BadgeCheck className="h-3.5 w-3.5" /> : ""}</span><span className={done ? "text-white/50 line-through" : ""}>{String(label)}</span></div>)}</div>
          <Link href="/vendor/shop" className="mt-7 flex items-center gap-2 text-xs font-bold text-[#d8b66c]">Complete shop setup <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><h2 className="font-display text-2xl font-semibold">Inventory attention</h2><Link href="/vendor/inventory" className="text-[9px] font-bold text-[#76531f]">Manage stock</Link></div><div className="mt-5 divide-y divide-slate-100">{vendorProducts.map((product) => <div key={product[1]} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-4 text-[10px]"><div><p className="font-bold">{product[0]}</p><p className="mt-1 text-[8px] text-slate-400">{product[1]}</p></div><p>{product[3]} units</p><span className={`rounded-full px-2 py-1 text-[8px] font-bold ${product[4] === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{product[4]}</span></div>)}</div></div>
        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">{[[Store, "Shop manager", "Brand, policies and documents", "/vendor/shop"], [Boxes, "Catalogue tools", "Products, variants and SEO", "/vendor/products"], [PackageCheck, "Fulfilment desk", "Stock, packing and shipping", "/vendor/shipping"]].map(([Icon, title, copy, href]) => { const QuickIcon = Icon as typeof Store; return <Link key={String(href)} href={String(href)} className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[#a67c38]"><QuickIcon className="h-5 w-5 text-[#a67c38]" /><p className="mt-4 text-xs font-bold">{String(title)}</p><p className="mt-2 text-[9px] leading-5 text-slate-400">{String(copy)}</p><ArrowRight className="mt-4 h-4 w-4 transition group-hover:translate-x-1" /></Link>; })}</div>
      </section>
    </div>
  );
}
