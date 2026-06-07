"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarPlus,
  CheckCircle2,
  ChevronRight,
  Mail,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Plus,
  ShoppingBag,
  Star,
  Tag,
  UserRound
} from "lucide-react";
import { crmCustomers } from "@/lib/crm-data";

const orders = [
  ["#DK10482", "June 5, 2026", "5 items", "₹2,348", "Processing"],
  ["#DK09814", "May 18, 2026", "3 items", "₹1,842", "Delivered"],
  ["#DK09126", "April 24, 2026", "6 items", "₹3,296", "Delivered"],
  ["#DK08442", "March 11, 2026", "2 items", "₹948", "Delivered"]
];

const timeline = [
  ["Order placed", "Order #DK10482 for ₹2,348", "Today, 10:42 AM"],
  ["WhatsApp message", "Asked for delivery before Monday", "Today, 10:48 AM"],
  ["Segment updated", "Added to VIP customers", "May 18, 2026"],
  ["Customer note", "Prefers strong coffee blends and no plastic gift wrap", "April 24, 2026"]
];

export function CustomerProfile({ customerId }: { customerId: string }) {
  const customer =
    crmCustomers.find((item) => item.id === customerId) ?? crmCustomers[0];
  const [tab, setTab] = useState("Timeline");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([
    "Prefers strong coffee blends. Avoid plastic gift wrap.",
    "Usually available for calls after 4 PM."
  ]);

  return (
    <div className="mx-auto max-w-[1500px]">
      <Link href="/admin/customers" className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-500">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to customer CRM
      </Link>

      <div className="mt-5 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#173c2c] font-display text-2xl font-semibold text-white">
            {customer.initials}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl font-semibold">{customer.name}</h1>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[8px] font-bold text-amber-700">{customer.segment}</span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[8px] font-bold text-emerald-700">{customer.status}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-[9px] text-slate-500">
              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {customer.email}</span>
              <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {customer.phone}</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {customer.location}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-[10px] font-bold">
            <CalendarPlus className="h-4 w-4" /> Add follow-up
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-[10px] font-bold">
            <Mail className="h-4 w-4" /> Email
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-[#173c2c] px-3 py-2.5 text-[10px] font-bold text-white">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </button>
          <button className="rounded-xl border border-slate-200 p-2.5"><MoreHorizontal className="h-4 w-4" /></button>
        </div>
      </div>

      <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["Total spent", customer.spent],
          ["Estimated LTV", customer.ltv],
          ["Orders", String(customer.orders)],
          ["Average order", "₹2,371"],
          ["Loyalty points", "1,840"]
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[9px] text-slate-400">{label}</p>
            <p className="mt-2 text-xl font-extrabold">{value}</p>
          </div>
        ))}
      </section>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="scrollbar-hide flex gap-1 overflow-x-auto border-b border-slate-100 px-4 pt-3">
            {["Timeline", "Orders", "Conversations", "Returns"].map((item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className={`border-b-2 px-3 py-3 text-[10px] font-bold ${
                  tab === item ? "border-[#173c2c] text-[#173c2c]" : "border-transparent text-slate-400"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="p-5">
            {tab === "Timeline" && (
              <div className="space-y-5">
                {timeline.map(([title, copy, time], index) => (
                  <div key={title} className="relative flex gap-4">
                    {index < timeline.length - 1 && <span className="absolute left-[15px] top-8 h-10 w-px bg-slate-200" />}
                    <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#edf2ee] text-[#173c2c]">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    <div className="flex-1 rounded-xl bg-slate-50 p-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-bold">{title}</p>
                          <p className="mt-1 text-[9px] text-slate-500">{copy}</p>
                        </div>
                        <span className="whitespace-nowrap text-[8px] text-slate-300">{time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {tab === "Orders" && (
              <div className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <div key={order[0]} className="grid grid-cols-[1fr_auto] items-center gap-4 py-4 sm:grid-cols-[1fr_120px_100px_100px_auto]">
                    <div>
                      <p className="text-[10px] font-bold text-[#173c2c]">{order[0]}</p>
                      <p className="mt-1 text-[8px] text-slate-400">{order[1]}</p>
                    </div>
                    <p className="hidden text-[9px] text-slate-500 sm:block">{order[2]}</p>
                    <p className="hidden text-[10px] font-bold sm:block">{order[3]}</p>
                    <span className="hidden rounded-full bg-emerald-50 px-2 py-1 text-center text-[8px] font-bold text-emerald-700 sm:block">{order[4]}</span>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  </div>
                ))}
              </div>
            )}
            {tab === "Conversations" && (
              <div className="space-y-3">
                {[
                  ["WhatsApp", "Thank you, please send the replacement to the same address.", "Today, 11:12 AM"],
                  ["Support", "Replacement approved for damaged coffee pouch.", "Today, 10:58 AM"],
                  ["Email", "Your order DK09814 has been delivered.", "May 21, 4:20 PM"]
                ].map(([channel, message, time]) => (
                  <div key={message} className="rounded-xl border border-slate-100 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-bold uppercase tracking-wider text-[#a67c38]">{channel}</span>
                      <span className="text-[8px] text-slate-300">{time}</span>
                    </div>
                    <p className="mt-2 text-[10px] text-slate-600">{message}</p>
                  </div>
                ))}
              </div>
            )}
            {tab === "Returns" && (
              <div className="py-14 text-center">
                <ShoppingBag className="mx-auto h-7 w-7 text-slate-300" />
                <p className="mt-3 text-sm font-bold">No active returns</p>
                <p className="mt-1 text-[9px] text-slate-400">This customer has no open return requests.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">Customer details</p>
              <button className="text-[9px] font-bold text-[#76531f]">Edit</button>
            </div>
            <div className="mt-4 space-y-4">
              <div className="flex gap-3">
                <UserRound className="mt-0.5 h-4 w-4 text-slate-400" />
                <div><p className="text-[8px] text-slate-400">Customer since</p><p className="mt-1 text-[10px] font-semibold">August 14, 2024</p></div>
              </div>
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                <div><p className="text-[8px] text-slate-400">Default address</p><p className="mt-1 text-[10px] font-semibold leading-5">42 Golf Course Road<br />Gurugram, Haryana 122002</p></div>
              </div>
              <div className="flex gap-3">
                <Star className="mt-0.5 h-4 w-4 text-slate-400" />
                <div><p className="text-[8px] text-slate-400">Acquisition source</p><p className="mt-1 text-[10px] font-semibold">Organic search</p></div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-bold"><Tag className="h-4 w-4" /> Tags</p>
              <button className="rounded-lg border border-slate-200 p-1.5"><Plus className="h-3.5 w-3.5" /></button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {[customer.segment, ...customer.tags].map((tag) => (
                <span key={tag} className="rounded-full bg-[#f1eadc] px-2.5 py-1.5 text-[8px] font-bold text-[#76531f]">{tag}</span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold">Internal notes</p>
            <div className="mt-4 space-y-2">
              {notes.map((item) => (
                <div key={item} className="rounded-xl bg-amber-50 p-3 text-[9px] leading-5 text-amber-900">{item}</div>
              ))}
            </div>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="mt-3 min-h-20 w-full rounded-xl border border-slate-200 p-3 text-[10px] outline-none focus:border-[#a67c38]"
              placeholder="Add a private note..."
            />
            <button
              onClick={() => {
                if (note.trim()) {
                  setNotes([note.trim(), ...notes]);
                  setNote("");
                }
              }}
              className="mt-2 w-full rounded-xl bg-[#173c2c] py-2.5 text-[9px] font-bold text-white"
            >
              Save note
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
