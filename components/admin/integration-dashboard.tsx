"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, PlugZap, RefreshCw, ShieldCheck, Webhook, XCircle } from "lucide-react";

type Integration = {
  provider: string;
  name: string;
  category: string;
  secretRefs: string[];
  configured: boolean;
  missing: string[];
  status: string;
  lastSyncAt?: string | null;
  lastError?: string | null;
};

type LogItem = {
  id: string;
  provider: string;
  operation: string;
  status: string;
  statusCode?: number | null;
  durationMs?: number | null;
  errorMessage?: string | null;
  createdAt: string;
};

type RetryItem = {
  id: string;
  provider: string;
  operation: string;
  attempts: number;
  nextRunAt: string;
  lastError?: string | null;
};

export function IntegrationDashboard() {
  const [items, setItems] = useState<Integration[]>([]);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [retries, setRetries] = useState<RetryItem[]>([]);
  const [webhookCount, setWebhookCount] = useState(0);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [statusResponse, logResponse] = await Promise.all([
      fetch("/api/admin/integrations"),
      fetch("/api/admin/integration-logs")
    ]);
    if (statusResponse.ok) setItems((await statusResponse.json()).items ?? []);
    if (logResponse.ok) {
      const result = await logResponse.json();
      setLogs(result.logs ?? []);
      setRetries(result.retries ?? []);
      setWebhookCount(result.webhooks?.length ?? 0);
    }
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);
  const connected = items.filter((item) => item.configured).length;
  const failed = logs.filter((item) => item.status === "FAILED").length;
  const grouped = useMemo(
    () =>
      items.reduce<Record<string, Integration[]>>((groups, item) => {
        (groups[item.category] ??= []).push(item);
        return groups;
      }, {}),
    [items]
  );

  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#a67c38]">Administration / Secure API hub</p><h1 className="mt-2 font-display text-4xl font-semibold">Integration operations</h1><p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500">Environment-backed connections, webhook health, API logs and failed-call retries. Secret values never reach this page.</p></div>
        <button onClick={() => void load()} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[10px] font-bold"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh status</button>
      </div>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[[PlugZap, "Connected", `${connected}/${items.length}`, "Environment verified"], [XCircle, "Failed calls", String(failed), "Recent API log"], [Clock3, "Pending retries", String(retries.length), "Worker queue"], [Webhook, "Webhook events", String(webhookCount), "Signed event ledger"]].map(([Icon, label, value, detail]) => {
          const MetricIcon = Icon as typeof PlugZap;
          return <article key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><MetricIcon className="h-5 w-5 text-[#a67c38]" /><p className="mt-4 text-2xl font-extrabold">{String(value)}</p><p className="mt-1 text-[10px] font-bold">{String(label)}</p><p className="mt-1 text-[8px] text-slate-400">{String(detail)}</p></article>;
        })}
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between"><div><p className="text-sm font-bold">Provider connections</p><p className="mt-1 text-[9px] text-slate-400">Keys are checked by variable presence only and are never returned</p></div><span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-[8px] font-bold text-emerald-700"><ShieldCheck className="h-3.5 w-3.5" /> Server-only secrets</span></div>
        <div className="mt-5 space-y-6">
          {Object.entries(grouped).map(([category, providers]) => <div key={category}><p className="mb-2 text-[8px] font-bold uppercase tracking-wider text-slate-400">{category}</p><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{providers.map((item) => <article key={item.provider} className="rounded-xl border border-slate-200 p-4"><div className="flex items-start justify-between"><div><p className="text-[11px] font-bold">{item.name}</p><p className="mt-1 font-mono text-[8px] text-slate-400">{item.provider}</p></div>{item.configured ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <AlertTriangle className="h-5 w-5 text-amber-500" />}</div><p className={`mt-4 text-[8px] font-bold ${item.configured ? "text-emerald-700" : "text-amber-700"}`}>{item.configured ? "CONNECTED" : "CONFIGURATION REQUIRED"}</p><p className="mt-2 break-words text-[8px] leading-4 text-slate-400">{item.configured ? item.secretRefs.join(" · ") : `Missing: ${item.missing.join(", ")}`}</p></article>)}</div></div>)}
        </div>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-5"><p className="text-sm font-bold">API call log</p><p className="mt-1 text-[9px] text-slate-400">Redacted request and response telemetry</p></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-slate-50 text-[8px] uppercase tracking-wider text-slate-400"><tr>{["Provider", "Operation", "Status", "HTTP", "Latency", "Time"].map((head) => <th key={head} className="px-5 py-3">{head}</th>)}</tr></thead><tbody>{logs.length ? logs.slice(0, 30).map((log) => <tr key={log.id} className="border-t border-slate-100 text-[9px]"><td className="px-5 py-4 font-bold">{log.provider}</td><td>{log.operation}</td><td><span className={`rounded-full px-2 py-1 text-[7px] font-bold ${log.status === "SUCCESS" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{log.status}</span></td><td>{log.statusCode ?? "—"}</td><td>{log.durationMs ? `${log.durationMs}ms` : "—"}</td><td className="text-slate-400">{new Date(log.createdAt).toLocaleString()}</td></tr>) : <tr><td colSpan={6} className="px-5 py-12 text-center text-xs text-slate-400">No durable logs yet. Configure PostgreSQL and call an integration endpoint.</td></tr>}</tbody></table></div></div>
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-bold">Retry queue</p><p className="mt-1 text-[9px] text-slate-400">Transient failures only</p><div className="mt-5 space-y-3">{retries.length ? retries.map((retry) => <div key={retry.id} className="rounded-xl bg-slate-50 p-3"><div className="flex items-center justify-between"><p className="text-[9px] font-bold">{retry.provider}</p><span className="text-[8px] text-slate-400">Attempt {retry.attempts}</span></div><p className="mt-1 text-[8px] text-slate-500">{retry.operation}</p><button onClick={async () => { await fetch(`/api/admin/integration-retries/${retry.id}`, { method: "POST" }); await load(); }} className="mt-3 rounded-lg bg-[#173c2c] px-3 py-2 text-[8px] font-bold text-white">Queue retry</button></div>) : <p className="rounded-xl bg-emerald-50 p-4 text-[9px] font-semibold text-emerald-700">No pending retries.</p>}</div></aside>
      </section>
    </div>
  );
}
