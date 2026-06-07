"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowUp,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock3,
  LoaderCircle,
  Paperclip,
  ShieldCheck,
  Sparkles,
  UserRound,
  XCircle
} from "lucide-react";
import type { AgentPlan, AgentProposal } from "@/lib/ai-manager/types";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  plan?: AgentPlan & { provider?: string };
};

type RecentConversation = {
  id: string;
  title: string;
  specialist: string;
};

const examples = [
  "Add new product Mysore Pak 500g with price ₹299",
  "Write SEO blog on best South Indian snacks",
  "Create 20% discount coupon for Diwali",
  "Show today's orders",
  "Show low stock products",
  "Track delayed orders"
];

export function AgentChat() {
  const searchParams = useSearchParams();
  const [input, setInput] = useState(searchParams.get("prompt") ?? "");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>();
  const [recent, setRecent] = useState<RecentConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Namaste. I am Dakshin AI Manager. I can analyze the business immediately and prepare product, SEO, content, CRM, offer, order, delivery and marketing actions for your approval."
    }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    fetch("/api/admin/agent/operations")
      .then((response) => response.json())
      .then((data) => setRecent(data.conversations ?? []))
      .catch(() => undefined);
  }, []);

  async function send(command = input) {
    const message = command.trim();
    if (!message || loading) return;
    setInput("");
    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: "user", content: message }
    ]);
    setLoading(true);
    try {
      const response = await fetch("/api/admin/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, conversationId })
      });
      const plan = (await response.json()) as AgentPlan & {
        conversationId?: string;
        provider?: string;
      };
      if (!response.ok) throw new Error("Agent request failed");
      setConversationId(plan.conversationId);
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: plan.response,
          plan
        }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "I could not process that command. The business state was not changed. Please try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="-m-4 flex h-[calc(100vh-72px)] min-h-[680px] bg-white sm:-m-6 xl:-m-8">
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-slate-50 p-4 xl:block">
        <button
          onClick={() => {
            setMessages([messages[0]]);
            setConversationId(undefined);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173c2c] py-3 text-[10px] font-bold text-white"
        >
          <Sparkles className="h-4 w-4" /> New conversation
        </button>
        <p className="mt-6 px-2 text-[8px] font-bold uppercase tracking-[0.14em] text-slate-400">Recent</p>
        <div className="mt-2 space-y-1">
          {recent.slice(0, 8).map((item, index) => (
            <button key={item.id} className="flex w-full items-center gap-2 rounded-lg px-2 py-2.5 text-left text-[9px] text-slate-600 hover:bg-white">
              <Clock3 className="h-3.5 w-3.5 text-slate-400" />
              <span className="truncate">{item.title}</span>
              {index === 1 && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400" />}
            </button>
          ))}
        </div>
        <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          <div className="flex items-center gap-2 text-emerald-800">
            <ShieldCheck className="h-4 w-4" />
            <p className="text-[9px] font-bold">Approval mode active</p>
          </div>
          <p className="mt-2 text-[8px] leading-4 text-emerald-700">
            No live business change can execute without review.
          </p>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#173c2c] text-[#d8b66c]">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-bold">Dakshin AI Manager</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[8px] text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Ready · Approval required for actions
              </p>
            </div>
          </div>
          <span className="hidden rounded-full border border-slate-200 px-3 py-1.5 text-[8px] font-bold text-slate-400 sm:block">
            OpenAI-compatible · Demo fallback
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
            {messages.map((message) => (
              <div key={message.id} className={`mb-7 flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                {message.role === "assistant" && (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#173c2c] text-[#d8b66c]">
                    <Bot className="h-4 w-4" />
                  </span>
                )}
                <div className={`max-w-[88%] ${message.role === "user" ? "rounded-2xl rounded-br-md bg-[#173c2c] px-4 py-3 text-white" : ""}`}>
                  <p className={`text-[11px] leading-6 ${message.role === "assistant" ? "text-slate-700" : ""}`}>
                    {message.content}
                  </p>
                  {message.plan?.data && <DataResult data={message.plan.data} />}
                  {message.plan?.specialist && (
                    <span className="mt-3 inline-flex rounded-full bg-[#eef4f0] px-2.5 py-1 text-[7px] font-bold text-[#173c2c]">
                      {message.plan.specialist} SPECIALIST
                    </span>
                  )}
                  {message.plan?.proposals?.map((item) => (
                    <ProposalCard key={item.id ?? item.title} proposal={item} />
                  ))}
                  {message.plan?.suggestions && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {message.plan.suggestions.map((item) => (
                        <button key={item} onClick={() => send(item)} className="rounded-full border border-slate-200 px-3 py-2 text-[8px] font-bold text-slate-500 hover:border-[#a67c38]">
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                  {message.plan?.provider && (
                    <p className="mt-3 text-[7px] uppercase tracking-wider text-slate-300">
                      Planned with {message.plan.provider === "OPENAI" ? "configured AI provider" : "local demo engine"}
                    </p>
                  )}
                  {message.plan?.usage && (
                    <p className="mt-1 text-[7px] text-slate-300">
                      {message.plan.usage.inputTokens + message.plan.usage.outputTokens} tokens · ${message.plan.usage.estimatedCost.toFixed(5)} · {message.plan.usage.latencyMs}ms
                    </p>
                  )}
                </div>
                {message.role === "user" && (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <UserRound className="h-4 w-4" />
                  </span>
                )}
              </div>
            ))}
            {messages.length === 1 && (
              <div className="mt-8">
                <p className="text-center text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">Try a command</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {examples.map((item) => (
                    <button key={item} onClick={() => send(item)} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-left text-[9px] font-semibold text-slate-600 hover:border-[#a67c38] hover:bg-amber-50/30">
                      {item}
                      <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {loading && (
              <div className="flex items-center gap-3 text-[10px] text-slate-400">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#173c2c] text-[#d8b66c]">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                </span>
                Analyzing business context and preparing a safe plan...
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
            className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/40 focus-within:border-[#a67c38]"
          >
            <button type="button" className="rounded-xl p-2.5 text-slate-400 hover:bg-slate-50">
              <Paperclip className="h-4 w-4" />
            </button>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  send();
                }
              }}
              className="max-h-32 min-h-10 flex-1 resize-none py-2 text-[11px] leading-5 outline-none"
              placeholder="Ask Dakshin AI Manager to manage a business task..."
            />
            <button
              disabled={!input.trim() || loading}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173c2c] text-white disabled:opacity-40"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </form>
          <p className="mx-auto mt-2 max-w-3xl text-center text-[7px] text-slate-400">
            Agent output may require review. All mutating actions remain pending until approved by an authorized admin.
          </p>
        </div>
      </section>
    </div>
  );
}

function DataResult({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(data).filter(([, value]) => !Array.isArray(value));
  const list = Object.entries(data).find(([, value]) => Array.isArray(value));
  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {entries.map(([key, value]) => (
          <div key={key}>
            <p className="text-[7px] font-bold uppercase tracking-wider text-slate-400">{key.replaceAll(/([A-Z])/g, " $1")}</p>
            <p className="mt-1 text-[11px] font-extrabold text-slate-800">{String(value)}</p>
          </div>
        ))}
      </div>
      {list && (
        <div className="mt-3 border-t border-slate-200 pt-3">
          {(list[1] as Array<Record<string, unknown>>).map((item, index) => (
            <div key={index} className="flex justify-between py-1.5 text-[9px] text-slate-600">
              {Object.values(item).map((value) => <span key={String(value)}>{String(value)}</span>)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProposalCard({ proposal }: { proposal: AgentProposal }) {
  const [status, setStatus] = useState<"PENDING_APPROVAL" | "APPROVED" | "REJECTED">("PENDING_APPROVAL");
  const [busy, setBusy] = useState(false);

  async function review(decision: "APPROVE" | "REJECT") {
    if (!proposal.id) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/agent/approvals/${proposal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, executeNow: true })
      });
      setStatus(decision === "APPROVE" ? "APPROVED" : "REJECTED");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
      <div className="flex items-center justify-between bg-amber-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-amber-700" />
          <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-amber-800">Approval required</span>
        </div>
        <span className={`rounded-full px-2 py-1 text-[7px] font-bold ${
          proposal.riskLevel === "HIGH" || proposal.riskLevel === "CRITICAL"
            ? "bg-rose-100 text-rose-700"
            : "bg-amber-100 text-amber-700"
        }`}>{proposal.riskLevel} risk</span>
      </div>
      <div className="p-4">
        <p className="text-[11px] font-bold text-slate-900">{proposal.title}</p>
        <p className="mt-1 text-[9px] leading-5 text-slate-500">{proposal.description}</p>
        <div className="mt-3 grid gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-2">
          {Object.entries(proposal.preview).slice(0, 8).map(([key, value]) => (
            <div key={key}>
              <p className="text-[7px] font-bold uppercase tracking-wider text-slate-400">{key.replaceAll(/([A-Z])/g, " $1")}</p>
              <p className="mt-1 text-[9px] font-semibold text-slate-700">
                {Array.isArray(value) ? value.join(", ") : String(value)}
              </p>
            </div>
          ))}
        </div>
        {proposal.validation && (
          <div className="mt-3 space-y-1.5 rounded-xl border border-slate-100 p-3">
            <p className="text-[7px] font-bold uppercase tracking-wider text-slate-400">Validation checks</p>
            {proposal.validation.checks.map((item) => (
              <div key={item.name} className="flex items-start justify-between gap-3 text-[8px]">
                <span className="text-slate-600">{item.name}</span>
                <span className={item.status === "PASS" ? "text-emerald-700" : item.status === "WARN" ? "text-amber-700" : "text-rose-700"}>{item.status}</span>
              </div>
            ))}
          </div>
        )}
        {status === "PENDING_APPROVAL" ? (
          <div className="mt-4 flex gap-2">
            <button disabled={busy || proposal.validation?.valid === false} onClick={() => review("APPROVE")} className="flex items-center gap-2 rounded-lg bg-[#173c2c] px-3 py-2 text-[8px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">
              {busy ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
              Approve action
            </button>
            <button disabled={busy} onClick={() => review("REJECT")} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-[8px] font-bold text-slate-600">
              <XCircle className="h-3.5 w-3.5" /> Reject
            </button>
          </div>
        ) : (
          <p className={`mt-4 flex items-center gap-2 text-[9px] font-bold ${status === "APPROVED" ? "text-emerald-700" : "text-rose-700"}`}>
            {status === "APPROVED" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {status === "APPROVED" ? "Approved and processed in demo mode" : "Action rejected"}
          </p>
        )}
      </div>
    </div>
  );
}
