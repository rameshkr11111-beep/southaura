import { ArrowRight, Download, Plus, Search, SlidersHorizontal } from "lucide-react";
import { vendorModules, vendorOrders, vendorProducts } from "@/lib/vendor-data";

export function VendorModulePage({ module }: { module: string }) {
  const data = vendorModules[module];
  if (!data) return null;
  const rows = module === "orders" || module === "shipping" || module === "returns" ? vendorOrders : vendorProducts;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#a67c38]">{data.eyebrow}</p><h1 className="mt-2 font-display text-4xl font-semibold">{data.title}</h1><p className="mt-2 max-w-2xl text-xs leading-6 text-slate-500">{data.description}</p></div><button className="flex items-center justify-center gap-2 rounded-xl bg-[#173c2c] px-4 py-3 text-[10px] font-bold text-white"><Plus className="h-4 w-4" />{data.action}</button></section>
      <section className="grid gap-4 md:grid-cols-3">{data.stats.map(([label, value, detail]) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-3 text-2xl font-bold">{value}</p><p className="mt-2 text-[9px] text-slate-400">{detail}</p></article>)}</section>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center"><label className="flex h-10 flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3"><Search className="h-4 w-4 text-slate-400" /><input className="min-w-0 flex-1 text-[10px] outline-none" placeholder={`Search ${data.title.toLowerCase()}...`} /></label><button className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-[9px] font-bold"><SlidersHorizontal className="h-4 w-4" />Filters</button><button className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-[9px] font-bold"><Download className="h-4 w-4" />Export</button></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left"><thead className="bg-slate-50 text-[8px] uppercase tracking-wider text-slate-400"><tr>{["Reference", "Name / customer", "Value", "Stock / status", "State"].map((item) => <th key={item} className="px-5 py-3">{item}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row[0]} className="border-t border-slate-100 text-[10px]">{row.map((cell, index) => <td key={`${row[0]}-${index}`} className={`px-5 py-4 ${index === 0 ? "font-bold" : ""}`}>{cell}</td>)}</tr>)}</tbody></table></div>
        <div className="flex items-center justify-between border-t border-slate-100 p-4 text-[9px] text-slate-400"><span>Showing representative vendor data</span><button className="flex items-center gap-2 font-bold text-[#76531f]">View complete workspace <ArrowRight className="h-3.5 w-3.5" /></button></div>
      </section>
    </div>
  );
}
