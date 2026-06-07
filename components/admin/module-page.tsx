"use client";

import { useState } from "react";
import {
  ArrowDownToLine,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles
} from "lucide-react";
import type { ModuleConfig } from "@/lib/admin-data";

export function ModulePage({ config }: { config: ModuleConfig }) {
  const [activeFilter, setActiveFilter] = useState(config.filters[0]);
  const [query, setQuery] = useState("");
  const filteredRows = config.rows.filter((row) =>
    row.some((cell) => cell.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#a67c38]">
            {config.eyebrow}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-slate-950">
            {config.title}
          </h1>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500">
            {config.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold shadow-sm">
            <ArrowDownToLine className="h-4 w-4" /> Export
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-[#173c2c] px-4 py-2.5 text-xs font-bold text-white shadow-sm">
            <Plus className="h-4 w-4" /> {config.action}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {config.stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <p className="text-[10px] font-semibold text-slate-400">{stat.label}</p>
              <span className={`h-2 w-2 rounded-full ${
                stat.tone === "red" ? "bg-rose-500" : stat.tone === "amber" ? "bg-amber-400" : "bg-emerald-500"
              }`} />
            </div>
            <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950">{stat.value}</p>
            <p className={`mt-1 text-[9px] font-semibold ${
              stat.tone === "red" ? "text-rose-600" : stat.tone === "amber" ? "text-amber-600" : "text-emerald-700"
            }`}>{stat.change}</p>
          </div>
        ))}
      </div>

      <section className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="scrollbar-hide flex gap-1 overflow-x-auto">
            {config.filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-[10px] font-bold transition ${
                  activeFilter === filter ? "bg-[#173c2c] text-white" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <label className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3 lg:w-64">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 text-[10px] outline-none"
                placeholder="Search records..."
              />
            </label>
            <button className="rounded-lg border border-slate-200 p-2.5 text-slate-500">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50 text-[8px] uppercase tracking-[0.12em] text-slate-400">
              <tr>
                <th className="w-10 px-5 py-3"><input type="checkbox" /></th>
                {config.columns.map((column) => (
                  <th key={column} className="px-4 py-3 font-bold">{column}</th>
                ))}
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {filteredRows.map((row) => (
                <tr key={row.join("-")} className="transition hover:bg-slate-50/70">
                  <td className="px-5 py-4"><input type="checkbox" /></td>
                  {row.map((cell, index) => (
                    <td key={`${cell}-${index}`} className={`px-4 py-4 ${
                      index === 0 ? "font-bold text-slate-900" : "text-slate-500"
                    }`}>
                      {index === row.length - 1 ? (
                        <span className={`rounded-full px-2 py-1 text-[8px] font-bold ${
                          ["Active", "Paid", "Published", "Live", "Healthy", "Delivered", "Reconciled", "Preferred"].includes(cell)
                            ? "bg-emerald-50 text-emerald-700"
                            : ["Failed", "On hold", "Out of stock"].includes(cell)
                              ? "bg-rose-50 text-rose-700"
                              : "bg-amber-50 text-amber-700"
                        }`}>{cell}</span>
                      ) : cell}
                    </td>
                  ))}
                  <td className="px-4 py-4"><button><MoreHorizontal className="h-4 w-4 text-slate-400" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-[9px] text-slate-400">
          <span>Showing {filteredRows.length} of 1,284 records</span>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-slate-200 px-3 py-2">Previous</button>
            <span className="font-bold text-slate-700">1</span>
            <button className="rounded-lg border border-slate-200 px-3 py-2">Next</button>
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">Workspace capabilities</p>
              <p className="mt-1 text-[9px] text-slate-400">Included in this management module</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {config.features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-[10px] font-semibold text-slate-600">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-[#a67c38] shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                </span>
                {feature}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-[#173c2c] p-5 text-white shadow-sm">
          <div className="flex items-center gap-2 text-[#d8b66c]">
            <Sparkles className="h-4 w-4" />
            <p className="text-[9px] font-bold uppercase tracking-[0.14em]">AI recommendation</p>
          </div>
          <p className="mt-4 font-display text-2xl font-semibold leading-tight">
            Automate the next repetitive step.
          </p>
          <p className="mt-3 text-[10px] leading-5 text-white/50">
            DakshinKart AI found three workflow opportunities in this module.
          </p>
          <button className="mt-5 rounded-lg bg-[#d8b66c] px-3 py-2 text-[10px] font-bold text-[#173c2c]">
            Review suggestions
          </button>
        </div>
      </section>
    </div>
  );
}
