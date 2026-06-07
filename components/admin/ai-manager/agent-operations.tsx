"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Bot,
  CalendarClock,
  Coins,
  History,
  LayoutTemplate,
  LoaderCircle,
  Play,
  Search,
  ShieldCheck,
  Sparkles
} from "lucide-react";

type OperationsData = {
  templates: Array<{ id: string; name: string; command: string; specialist: string; category: string; useCount: number }>;
  tasks: Array<{ id: string; name: string; command: string; specialist: string; schedule?: string | null; status: string; runCount: number; nextRunAt?: string | null }>;
  conversations: Array<{ id: string; title: string; specialist: string; updatedAt: string; _count: { messages: number; actions: number } }>;
  usage: { _count: number; _sum: { inputTokens?: number | null; outputTokens?: number | null; estimatedCost?: number | string | null } };
  failed: number;
  notifications: Array<{ id: string; title: string; message: string; link?: string | null }>;
};

export function AgentOperations() {
  const [data, setData] = useState<OperationsData>();
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);

  async function load() {
    const response = await fetch(`/api/admin/agent/operations?q=${encodeURIComponent(query)}`);
    setData(await response.json());
  }

  useEffect(() => {
    void load();
  }, []);

  const tokens = useMemo(
    () => (data?.usage._sum.inputTokens ?? 0) + (data?.usage._sum.outputTokens ?? 0),
    [data]
  );

  async function createTask() {
    setCreating(true);
    await fetch("/api/admin/agent/operations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "TASK",
        name: "Daily opportunity scan",
        command: "Review revenue, low stock, SEO alerts and customer follow-ups",
        specialist: "MANAGER",
        schedule: "Every day at 9:00 AM"
      })
    });
    await load();
    setCreating(false);
  }

  if (!data) {
    return <div className="flex min-h-[500px] items-center justify-center gap-2 text-xs text-slate-400"><LoaderCircle className="h-4 w-4 animate-spin" /> Loading agent operations...</div>;
  }

  return (
    <div className="mx-auto max-w-[1550px]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#a67c38]">Dakshin AI Manager / Control room</p>
          <h1 className="mt-2 font-display text-4xl font-semibold">Agent operations</h1>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500">Manage scheduled intelligence, reusable commands, conversation history, usage costs and agent notifications.</p>
        </div>
        <button onClick={createTask} disabled={creating} className="flex items-center gap-2 rounded-xl bg-[#173c2c] px-4 py-3 text-[10px] font-bold text-white">
          {creating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CalendarClock className="h-4 w-4" />} Add daily opportunity scan
        </button>
      </div>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Agent runs", data.usage._count, Bot],
          ["Tokens used", tokens.toLocaleString("en-IN"), Sparkles],
          ["Estimated cost", `$${Number(data.usage._sum.estimatedCost ?? 0).toFixed(4)}`, Coins],
          ["Failed actions", data.failed, ShieldCheck]
        ].map(([label, value, Icon]) => {
          const CardIcon = Icon as typeof Bot;
          return <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><CardIcon className="h-5 w-5 text-[#a67c38]" /><p className="mt-4 text-2xl font-extrabold">{String(value)}</p><p className="mt-1 text-[9px] text-slate-400">{String(label)}</p></div>;
        })}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel title="Scheduled agent tasks" icon={CalendarClock}>
          {data.tasks.map((task) => <div key={task.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700"><Play className="h-4 w-4" /></span>
            <div className="min-w-0 flex-1"><p className="text-[10px] font-bold">{task.name}</p><p className="mt-1 truncate text-[8px] text-slate-400">{task.command}</p><p className="mt-1 text-[7px] font-bold text-[#a67c38]">{task.schedule ?? "Manual"} · {task.runCount} runs</p></div>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[7px] font-bold text-emerald-700">{task.status}</span>
          </div>)}
        </Panel>

        <Panel title="Saved command templates" icon={LayoutTemplate}>
          {data.templates.map((template) => <Link key={template.id} href={`/admin/ai-manager/chat?prompt=${encodeURIComponent(template.command)}`} className="block rounded-xl border border-slate-100 p-4 transition hover:border-[#a67c38] hover:bg-amber-50/20">
            <div className="flex items-center justify-between gap-3"><p className="text-[10px] font-bold">{template.name}</p><span className="text-[7px] font-bold text-[#a67c38]">{template.specialist}</span></div>
            <p className="mt-1 text-[8px] leading-4 text-slate-400">{template.command}</p>
            <p className="mt-2 text-[7px] text-slate-300">{template.category} · Used {template.useCount} times</p>
          </Link>)}
        </Panel>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel title="Searchable conversation history" icon={History}>
          <form onSubmit={(event) => { event.preventDefault(); void load(); }} className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 px-3">
            <Search className="h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 flex-1 text-[10px] outline-none" placeholder="Search agent conversations..." />
          </form>
          {data.conversations.map((conversation) => <div key={conversation.id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4">
            <div><p className="text-[10px] font-bold">{conversation.title}</p><p className="mt-1 text-[7px] text-slate-400">{new Date(conversation.updatedAt).toLocaleString("en-IN")} · {conversation._count.messages} messages · {conversation._count.actions} actions</p></div>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[7px] font-bold">{conversation.specialist}</span>
          </div>)}
        </Panel>
        <Panel title="Agent notifications" icon={Bell}>
          {data.notifications.map((notification) => <Link href={notification.link ?? "#"} key={notification.id} className="block rounded-xl border border-amber-100 bg-amber-50/40 p-4"><p className="text-[10px] font-bold">{notification.title}</p><p className="mt-1 text-[8px] leading-4 text-slate-500">{notification.message}</p></Link>)}
        </Panel>
      </section>
    </div>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: typeof Bot; children: React.ReactNode }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><p className="text-sm font-bold">{title}</p><Icon className="h-5 w-5 text-[#a67c38]" /></div><div className="space-y-2">{children}</div></div>;
}
