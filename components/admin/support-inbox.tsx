"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bot,
  CheckCircle2,
  Download,
  Headphones,
  LoaderCircle,
  MessageCircle,
  Search,
  ShieldAlert,
  Sparkles,
  UserRound
} from "lucide-react";

type Conversation = {
  id: string;
  channel: string;
  locale: string;
  subject?: string | null;
  status: string;
  humanTakeover: boolean;
  aiEnabled: boolean;
  spam: boolean;
  attributedRevenue: number | string;
  lastMessageAt: string;
  customer?: { firstName: string; lastName?: string | null; email?: string | null; phone?: string | null; loyaltyPoints?: number; orderCount?: number } | null;
  lead?: { name: string; companyName?: string | null; phone: string; productInterest: string; status: string } | null;
  messages: Array<{ id: string; direction: string; senderType: string; body: string; aiGenerated: boolean; createdAt: string }>;
};

export function SupportInbox() {
  const [items, setItems] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [revenue, setRevenue] = useState(0);

  async function load() {
    const response = await fetch("/api/admin/support-conversations");
    const data = await response.json();
    setItems(data.items ?? []);
    setRevenue(Number(data.stats?._sum?.attributedRevenue ?? 0));
    setSelectedId((current) => current ?? data.items?.[0]?.id);
    setLoading(false);
  }
  useEffect(() => { void load(); }, []);

  const selected = items.find((item) => item.id === selectedId);
  const filtered = useMemo(() => items.filter((item) => `${item.subject} ${item.channel} ${item.customer?.firstName ?? ""} ${item.lead?.name ?? ""}`.toLowerCase().includes(search.toLowerCase())), [items, search]);

  async function action(actionName: "TAKEOVER" | "RELEASE_TO_AI" | "RESOLVE" | "SPAM") {
    if (!selected) return;
    await fetch("/api/admin/support-conversations", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: selected.id, action: actionName }) });
    setItems((current) => current.map((item) => item.id === selected.id ? {
      ...item,
      humanTakeover: actionName === "TAKEOVER",
      aiEnabled: actionName === "RELEASE_TO_AI",
      status: actionName === "RESOLVE" ? "RESOLVED" : actionName === "SPAM" ? "SPAM" : actionName === "TAKEOVER" ? "IN_PROGRESS" : "OPEN"
    } : item));
  }

  if (loading) return <div className="flex min-h-[500px] items-center justify-center gap-2 text-xs text-slate-400"><LoaderCircle className="h-4 w-4 animate-spin" /> Loading support inbox...</div>;

  return <div className="-m-4 sm:-m-6 xl:-m-8">
    <div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#a67c38]">Customer experience / Omnichannel</p><h1 className="mt-2 font-display text-4xl font-semibold">Dakshin AI support inbox</h1><p className="mt-2 text-xs text-slate-500">Website chat, WhatsApp, mobile app, Messenger and Instagram conversations.</p></div><a href="/api/admin/support-conversations?export=csv" className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-[9px] font-bold"><Download className="h-4 w-4" /> Export customer data</a></div>
      <div className="mt-5 grid gap-3 sm:grid-cols-4">{[["Conversations", items.length],["Waiting for human",items.filter((item)=>item.status==="WAITING_FOR_HUMAN").length],["AI resolved",items.filter((item)=>item.aiEnabled).length],["AI sales",`₹${revenue.toLocaleString("en-IN")}`]].map(([label,value])=><div key={String(label)} className="rounded-xl bg-slate-50 p-4"><p className="text-xl font-extrabold">{String(value)}</p><p className="mt-1 text-[8px] text-slate-400">{String(label)}</p></div>)}</div>
    </div>
    <div className="grid h-[calc(100vh-275px)] min-h-[650px] bg-white lg:grid-cols-[340px_1fr_300px]">
      <aside className="border-r border-slate-200">
        <label className="m-3 flex items-center gap-2 rounded-xl border border-slate-200 px-3"><Search className="h-4 w-4 text-slate-400" /><input value={search} onChange={(event)=>setSearch(event.target.value)} className="h-10 min-w-0 flex-1 text-[10px] outline-none" placeholder="Search conversations..." /></label>
        <div className="overflow-y-auto">{filtered.map((item)=><button key={item.id} onClick={()=>setSelectedId(item.id)} className={`w-full border-t border-slate-100 p-4 text-left ${selectedId===item.id?"bg-amber-50/50":""}`}><div className="flex items-center justify-between gap-2"><p className="truncate text-[10px] font-bold">{item.customer?.firstName ?? item.lead?.name ?? "Website visitor"}</p><span className="text-[7px] text-slate-300">{item.channel}</span></div><p className="mt-1 truncate text-[9px] text-slate-500">{item.subject}</p><div className="mt-2 flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${item.humanTakeover?"bg-amber-400":item.aiEnabled?"bg-emerald-500":"bg-slate-300"}`} /><span className="text-[7px] font-bold text-slate-400">{item.status.replaceAll("_"," ")}</span></div></button>)}</div>
      </aside>
      <main className="flex min-w-0 flex-col">
        {selected ? <><div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><p className="text-[11px] font-bold">{selected.subject}</p><p className="mt-1 text-[8px] text-slate-400">{selected.channel} · {selected.locale.toUpperCase()} · {new Date(selected.lastMessageAt).toLocaleString("en-IN")}</p></div><div className="flex gap-2"><button onClick={()=>action(selected.humanTakeover?"RELEASE_TO_AI":"TAKEOVER")} className="flex items-center gap-1.5 rounded-lg bg-[#173c2c] px-3 py-2 text-[8px] font-bold text-white">{selected.humanTakeover?<Bot className="h-3.5 w-3.5"/>:<Headphones className="h-3.5 w-3.5"/>}{selected.humanTakeover?"Return to AI":"Human takeover"}</button><button onClick={()=>action("RESOLVE")} className="rounded-lg border border-slate-200 p-2"><CheckCircle2 className="h-4 w-4"/></button><button onClick={()=>action("SPAM")} className="rounded-lg border border-rose-200 p-2 text-rose-600"><ShieldAlert className="h-4 w-4"/></button></div></div>
        <div className="flex-1 overflow-y-auto p-6">{selected.messages.map((message)=><div key={message.id} className={`mb-5 flex gap-2 ${message.direction==="OUTBOUND"?"":"justify-end"}`}>{message.direction==="OUTBOUND"&&<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#173c2c] text-[#d8b66c]">{message.aiGenerated?<Bot className="h-4 w-4"/>:<Headphones className="h-4 w-4"/>}</span>}<div className={`max-w-[75%] rounded-2xl px-4 py-3 text-[10px] leading-5 ${message.direction==="INBOUND"?"bg-[#173c2c] text-white":"bg-slate-100 text-slate-700"}`}>{message.body}{message.aiGenerated&&<p className="mt-2 flex items-center gap-1 text-[7px] opacity-50"><Sparkles className="h-3 w-3"/> AI generated · Editable</p>}</div>{message.direction==="INBOUND"&&<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100"><UserRound className="h-4 w-4"/></span>}</div>)}</div>
        <div className="border-t border-slate-200 p-4"><div className="flex items-center gap-2 rounded-xl border border-slate-200 p-2"><input disabled={!selected.humanTakeover} className="h-9 flex-1 px-2 text-[10px] outline-none disabled:bg-slate-50" placeholder={selected.humanTakeover?"Write a human reply...":"Take over this conversation to reply"} /><button disabled={!selected.humanTakeover} className="rounded-lg bg-[#173c2c] px-4 py-2 text-[8px] font-bold text-white disabled:opacity-30">Send</button></div></div></>:<div className="flex flex-1 items-center justify-center text-xs text-slate-400">Select a conversation</div>}
      </main>
      <aside className="border-l border-slate-200 bg-slate-50 p-5">{selected&&<><p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Customer context</p><div className="mt-4 rounded-xl bg-white p-4"><MessageCircle className="h-5 w-5 text-[#a67c38]"/><p className="mt-3 text-sm font-bold">{selected.customer?`${selected.customer.firstName} ${selected.customer.lastName??""}`:selected.lead?.name??"Anonymous visitor"}</p><p className="mt-1 text-[8px] text-slate-400">{selected.customer?.email??selected.lead?.companyName??"No account matched"}</p></div>{selected.customer&&<div className="mt-3 rounded-xl bg-white p-4 text-[9px]"><p><b>{selected.customer.orderCount??0}</b> previous orders</p><p className="mt-2"><b>{selected.customer.loyaltyPoints??0}</b> loyalty points</p></div>}{selected.lead&&<div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="text-[8px] font-bold text-amber-800">SALES LEAD</p><p className="mt-2 text-[9px] font-semibold">{selected.lead.productInterest}</p><p className="mt-1 text-[8px] text-slate-500">{selected.lead.phone}</p></div>}<div className="mt-3 rounded-xl bg-white p-4"><p className="text-[8px] text-slate-400">AI-attributed revenue</p><p className="mt-1 text-xl font-extrabold">₹{Number(selected.attributedRevenue).toLocaleString("en-IN")}</p></div></>}</aside>
    </div>
  </div>;
}
