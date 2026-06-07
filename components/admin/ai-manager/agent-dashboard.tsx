import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  CircleX,
  ClipboardCheck,
  Clock3,
  Lightbulb,
  MessageSquareText,
  PlugZap,
  ShieldCheck,
  Sparkles,
  Workflow
} from "lucide-react";
import {
  agentActivity,
  businessSuggestions
} from "@/lib/ai-manager/demo-data";

export function AgentDashboard() {
  return (
    <div className="mx-auto max-w-[1600px]">
      <section className="overflow-hidden rounded-3xl bg-[#101d17] p-6 text-white shadow-sm sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-[#d8b66c]">
              <Bot className="h-5 w-5" />
              <p className="text-[9px] font-bold uppercase tracking-[0.18em]">
                Dakshin AI Manager
              </p>
            </div>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-none sm:text-5xl">
              Manage the business through one governed agent.
            </h1>
            <p className="mt-5 max-w-2xl text-xs leading-6 text-white/55">
              Ask for catalog, CRM, SEO, content, order, delivery and marketing
              work. The agent prepares actions, but nothing goes live without
              authorized approval.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/admin/ai-manager/chat"
                className="flex items-center gap-2 rounded-xl bg-[#d8b66c] px-4 py-3 text-xs font-bold text-[#101d17]"
              >
                <MessageSquareText className="h-4 w-4" /> Open agent chat
              </Link>
              <Link
                href="/admin/ai-manager/approvals"
                className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-xs font-bold"
              >
                <ClipboardCheck className="h-4 w-4" /> Review approvals
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold">Approval safety</p>
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="mt-5 space-y-3">
              {[
                "No automatic publishing",
                "No unapproved customer messages",
                "No direct price or stock changes",
                "Every execution is audited"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-[10px] text-white/65">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Today's AI tasks", "14", Clock3, "4 in progress"],
          ["Pending approvals", "6", ClipboardCheck, "2 high risk"],
          ["Completed actions", "24", CheckCircle2, "Today"],
          ["Failed actions", "2", CircleX, "Connection required"]
        ].map(([label, value, Icon, note]) => {
          const CardIcon = Icon as typeof Clock3;
          return (
            <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <CardIcon className="h-5 w-5 text-[#a67c38]" />
                <span className="text-[8px] font-semibold text-slate-400">{String(note)}</span>
              </div>
              <p className="mt-4 text-2xl font-extrabold">{String(value)}</p>
              <p className="mt-1 text-[10px] text-slate-400">{String(label)}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">Business suggestions</p>
              <p className="mt-1 text-[9px] text-slate-400">
                Opportunities found across the business
              </p>
            </div>
            <Lightbulb className="h-5 w-5 text-amber-500" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {businessSuggestions.map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#a67c38]">
                    {item.category}
                  </span>
                  <span className={`rounded-full px-2 py-1 text-[7px] font-bold ${
                    item.impact === "High"
                      ? "bg-rose-50 text-rose-700"
                      : "bg-amber-50 text-amber-700"
                  }`}>
                    {item.impact} impact
                  </span>
                </div>
                <h3 className="mt-3 text-[11px] font-bold">{item.title}</h3>
                <p className="mt-1.5 text-[9px] leading-5 text-slate-500">{item.detail}</p>
                <Link
                  href={`/admin/ai-manager/chat?prompt=${encodeURIComponent(item.command)}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-[9px] font-bold text-[#76531f]"
                >
                  Ask agent <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">Agent activity</p>
              <p className="mt-1 text-[9px] text-slate-400">Latest planned and executed work</p>
            </div>
            <Sparkles className="h-4 w-4 text-[#a67c38]" />
          </div>
          <div className="mt-5 space-y-4">
            {agentActivity.map((item) => (
              <div key={item.title} className="flex gap-3">
                <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                  item.status === "Completed"
                    ? "bg-emerald-500"
                    : item.status === "Failed"
                      ? "bg-rose-500"
                      : "bg-amber-400"
                }`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[10px] font-bold">{item.title}</p>
                    <span className="whitespace-nowrap text-[7px] text-slate-300">{item.time}</span>
                  </div>
                  <p className="mt-1 text-[8px] leading-4 text-slate-400">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-3">
        {[
          [MessageSquareText, "Agent chat", "Issue commands and review structured action previews.", "/admin/ai-manager/chat"],
          [ClipboardCheck, "Approval center", "Approve, reject or inspect every proposed business change.", "/admin/ai-manager/approvals"],
          [PlugZap, "Tool connections", "Connect databases, channels, payments and delivery providers.", "/admin/ai-manager/tools"]
        ].map(([Icon, title, copy, href]) => {
          const TileIcon = Icon as typeof MessageSquareText;
          return (
            <Link key={String(title)} href={String(href)} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <TileIcon className="h-5 w-5 text-[#a67c38]" />
              <h2 className="mt-4 font-display text-2xl font-semibold">{String(title)}</h2>
              <p className="mt-2 text-[9px] leading-5 text-slate-500">{String(copy)}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-[9px] font-bold text-[#76531f]">
                Open <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </section>

      <Link href="/admin/ai-manager/operations" className="mt-4 flex items-center justify-between rounded-2xl border border-[#d8b66c]/40 bg-[#fffaf0] p-5 transition hover:border-[#a67c38]">
        <div className="flex items-center gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#173c2c] text-[#d8b66c]"><Workflow className="h-5 w-5" /></span><div><p className="text-sm font-bold">Agent operations control room</p><p className="mt-1 text-[9px] text-slate-500">Schedules, templates, history, model cost, retries and notifications.</p></div></div>
        <ArrowRight className="h-4 w-4 text-[#76531f]" />
      </Link>

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-[9px] text-amber-900">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        Demo mode works without API keys. Live OpenAI, WhatsApp, social, payment
        and courier actions require environment variables and connected tools.
      </div>
    </div>
  );
}
