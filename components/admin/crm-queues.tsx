"use client";

import { useState } from "react";
import {
  CalendarClock,
  Check,
  CheckCircle2,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Search,
  ShoppingCart
} from "lucide-react";
import { abandonedCarts, crmTasks } from "@/lib/crm-data";

export function FollowUpQueue() {
  const [completed, setCompleted] = useState<string[]>([]);

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#a67c38]">CRM / Team tasks</p>
          <h1 className="mt-2 font-display text-4xl font-semibold">Customer follow-ups</h1>
          <p className="mt-2 text-xs text-slate-500">Calls, messages and commitments assigned to the customer team.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-[#173c2c] px-4 py-2.5 text-xs font-bold text-white">
          <Plus className="h-4 w-4" /> Create follow-up
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ["Due today", "12", CalendarClock],
          ["Overdue", "7", Phone],
          ["Completed this week", "48", CheckCircle2]
        ].map(([label, value, Icon]) => {
          const CardIcon = Icon as typeof CalendarClock;
          return (
            <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <CardIcon className="h-5 w-5 text-[#a67c38]" />
              <p className="mt-4 text-2xl font-extrabold">{String(value)}</p>
              <p className="mt-1 text-[10px] text-slate-400">{String(label)}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 p-4">
          <Search className="h-4 w-4 text-slate-400" />
          <input className="flex-1 text-xs outline-none" placeholder="Search follow-ups..." />
          <select className="rounded-lg border border-slate-200 px-3 py-2 text-[9px] font-bold">
            <option>All owners</option>
            <option>Asha</option>
            <option>Rahul</option>
            <option>Mina</option>
          </select>
        </div>
        <div className="divide-y divide-slate-100">
          {crmTasks.map((task) => {
            const isDone = completed.includes(task.title);
            return (
              <div key={task.title} className={`grid gap-4 p-5 sm:grid-cols-[40px_1fr_130px_110px_120px] sm:items-center ${isDone ? "opacity-45" : ""}`}>
                <button
                  onClick={() => setCompleted(isDone ? completed.filter((item) => item !== task.title) : [...completed, task.title])}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border ${isDone ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200"}`}
                >
                  {isDone && <Check className="h-4 w-4" />}
                </button>
                <div>
                  <p className={`text-[11px] font-bold ${isDone ? "line-through" : ""}`}>{task.title}</p>
                  <p className="mt-1 text-[9px] text-slate-400">{task.customer}</p>
                </div>
                <p className={`text-[9px] font-semibold ${task.due.includes("Overdue") ? "text-rose-600" : "text-amber-700"}`}>{task.due}</p>
                <p className="text-[9px] text-slate-500">Owner: {task.owner}</p>
                <div className="flex gap-1.5">
                  <button className="rounded-lg border border-slate-200 p-2"><Phone className="h-3.5 w-3.5" /></button>
                  <button className="rounded-lg border border-slate-200 p-2"><MessageCircle className="h-3.5 w-3.5" /></button>
                  <button className="rounded-lg border border-slate-200 p-2"><Mail className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function AbandonedCartQueue() {
  const [contacted, setContacted] = useState<string[]>([]);

  return (
    <div className="mx-auto max-w-[1500px]">
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#a67c38]">CRM / Revenue recovery</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Abandoned carts</h1>
        <p className="mt-2 text-xs text-slate-500">Recover incomplete checkouts through timely, personal outreach.</p>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ["Open carts", "28"],
          ["Recoverable value", "₹84,620"],
          ["Recovered this month", "₹2.4L"]
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <ShoppingCart className="h-5 w-5 text-[#a67c38]" />
            <p className="mt-4 text-2xl font-extrabold">{value}</p>
            <p className="mt-1 text-[10px] text-slate-400">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead className="bg-slate-50 text-[8px] uppercase tracking-[0.12em] text-slate-400">
              <tr>{["Customer", "Cart items", "Value", "Abandoned", "Intent", "Recovery action"].map((head) => <th key={head} className="px-5 py-3">{head}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {abandonedCarts.map((cart) => {
                const done = contacted.includes(cart.customer);
                return (
                  <tr key={cart.customer}>
                    <td className="px-5 py-4"><p className="text-[10px] font-bold">{cart.customer}</p><p className="mt-1 text-[8px] text-slate-400">{cart.contact}</p></td>
                    <td className="px-5 py-4 text-[9px] text-slate-500">{cart.items}</td>
                    <td className="px-5 py-4 text-[10px] font-bold">{cart.value}</td>
                    <td className="px-5 py-4 text-[9px] text-amber-700">{cart.age} ago</td>
                    <td className="px-5 py-4"><span className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-bold text-emerald-700">{cart.probability}</span></td>
                    <td className="px-5 py-4">
                      {done ? (
                        <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Contacted</span>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => setContacted([...contacted, cart.customer])} className="flex items-center gap-1.5 rounded-lg bg-[#173c2c] px-3 py-2 text-[8px] font-bold text-white"><MessageCircle className="h-3.5 w-3.5" /> WhatsApp</button>
                          <button className="rounded-lg border border-slate-200 p-2"><Mail className="h-3.5 w-3.5" /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
