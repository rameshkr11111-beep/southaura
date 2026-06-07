"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, LoaderCircle, MessageCircle, Phone, Search } from "lucide-react";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  city?: string | null;
  productInterest: string;
  source: string;
  status: string;
  estimatedValue?: number | string | null;
  notes?: string | null;
  createdAt: string;
};

const statuses = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"];

export function SalesLeads() {
  const [items, setItems] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((response) => response.json())
      .then((data) => setItems(data.items ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      items.filter((lead) =>
        [lead.name, lead.phone, lead.email, lead.city, lead.productInterest, lead.source]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [items, query]
  );

  async function updateStatus(id: string, status: string) {
    const response = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });
    if (response.ok) setItems((current) => current.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
  }

  const pipelineValue = items.reduce((sum, lead) => sum + Number(lead.estimatedValue ?? 0), 0);

  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#a67c38]">CRM / Acquisition</p>
          <h1 className="mt-2 font-display text-4xl font-semibold">Sales leads</h1>
          <p className="mt-2 text-xs text-slate-500">Product enquiries captured from every storefront product and the AI assistant.</p>
        </div>
        <a href="/api/admin/leads?export=csv" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[10px] font-bold">
          <Download className="h-4 w-4" /> Export CSV
        </a>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ["Total leads", items.length],
          ["New leads", items.filter((lead) => lead.status === "NEW").length],
          ["Pipeline value", `₹${pipelineValue.toLocaleString("en-IN")}`]
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-[9px] font-semibold text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-extrabold">{value}</p>
          </div>
        ))}
      </div>

      <section className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-4">
          <label className="flex h-10 max-w-md items-center gap-2 rounded-xl border border-slate-200 px-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="flex-1 text-xs outline-none" placeholder="Search name, phone, product or source" />
          </label>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 p-8 text-xs text-slate-400"><LoaderCircle className="h-4 w-4 animate-spin" /> Loading leads...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-slate-50 text-[8px] uppercase tracking-wider text-slate-400">
                <tr>{["Lead", "Product interest", "Source", "Value", "Status", "Contact"].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr key={lead.id} className="border-t border-slate-100">
                    <td className="px-4 py-4"><p className="text-[10px] font-bold">{lead.name}</p><p className="mt-1 text-[8px] text-slate-400">{lead.city || "Location not supplied"} · {new Date(lead.createdAt).toLocaleDateString("en-IN")}</p></td>
                    <td className="max-w-xs px-4 py-4 text-[9px] font-semibold">{lead.productInterest}</td>
                    <td className="px-4 py-4 text-[8px] text-slate-500">{lead.source.replaceAll("_", " ")}</td>
                    <td className="px-4 py-4 text-[10px] font-bold">₹{Number(lead.estimatedValue ?? 0).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-4">
                      <select value={lead.status} onChange={(event) => void updateStatus(lead.id, event.target.value)} className="rounded-lg border border-slate-200 px-2 py-2 text-[8px] font-bold">
                        {statuses.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <a href={`tel:${lead.phone}`} className="rounded-lg border border-slate-200 p-2" aria-label={`Call ${lead.name}`}><Phone className="h-3.5 w-3.5" /></a>
                        <a href={`https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${lead.name}, thank you for your interest in ${lead.productInterest}. This is SouthAura.`)}`} target="_blank" rel="noreferrer" className="rounded-lg bg-emerald-500 p-2 text-white" aria-label={`WhatsApp ${lead.name}`}><MessageCircle className="h-3.5 w-3.5" /></a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
