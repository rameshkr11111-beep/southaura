"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  Filter,
  LoaderCircle,
  Search,
  ShieldAlert,
  XCircle
} from "lucide-react";

type Approval = {
  id: string;
  type: string;
  title: string;
  description: string;
  riskLevel: string;
  status: string;
  preview?: Record<string, unknown> | null;
  createdAt: string;
  requestedBy?: { name?: string | null } | null;
  validation?: { valid?: boolean; checks?: Array<{ name: string; status: string; message: string }> } | null;
  failureReason?: string | null;
  retryCount?: number;
  maxRetries?: number;
};

export function ApprovalsCenter() {
  const [items, setItems] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<string>();
  const [filter, setFilter] = useState("PENDING_APPROVAL");
  const [expanded, setExpanded] = useState<string>();
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/agent/approvals?status=${filter}`)
      .then((response) => response.json())
      .then((data) => setItems(data.items ?? []))
      .finally(() => setLoading(false));
  }, [filter]);

  async function review(id: string, decision: "APPROVE" | "REJECT" | "RETRY") {
    setReviewing(id);
    const response = await fetch(`/api/admin/agent/approvals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, executeNow: true })
    });
    const result = (await response.json()) as { status?: string };
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                result.status ??
                (decision === "REJECT" ? "REJECTED" : "COMPLETED")
            }
          : item
      )
    );
    setReviewing(undefined);
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#a67c38]">
            Dakshin AI Manager / Governance
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold">
            AI approval center
          </h1>
          <p className="mt-2 text-xs text-slate-500">
            Review every proposed business change before it can execute.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[9px] font-bold text-emerald-800">
          <CheckCircle2 className="h-4 w-4" /> Approval enforcement active
        </div>
      </div>

      <section className="mt-6 grid gap-3 sm:grid-cols-4">
        {[
          ["Pending", "6", "amber"],
          ["Approved today", "18", "green"],
          ["Rejected", "3", "red"],
          ["Failed", "2", "red"]
        ].map(([label, value, tone]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[9px] text-slate-400">{label}</p>
              <span className={`h-2 w-2 rounded-full ${
                tone === "green"
                  ? "bg-emerald-500"
                  : tone === "red"
                    ? "bg-rose-500"
                    : "bg-amber-400"
              }`} />
            </div>
            <p className="mt-3 text-2xl font-extrabold">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
          <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="min-w-0 flex-1 text-xs outline-none" placeholder="Search proposed actions..." />
          </label>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="h-10 rounded-xl border border-slate-200 px-3 text-[9px] font-bold outline-none"
            >
              <option value="PENDING_APPROVAL">Pending approval</option>
              <option value="APPROVED">Approved</option>
              <option value="COMPLETED">Completed</option>
              <option value="REJECTED">Rejected</option>
              <option value="FAILED">Failed</option>
              <option value="ALL">All actions</option>
            </select>
            <button className="rounded-xl border border-slate-200 p-2.5"><Filter className="h-4 w-4" /></button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-xs text-slate-400">
            <LoaderCircle className="h-4 w-4 animate-spin" /> Loading approvals...
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.filter((item) => `${item.title} ${item.description} ${item.type}`.toLowerCase().includes(search.toLowerCase())).map((item) => (
              <div key={item.id} className="p-5">
                <div className="grid gap-4 lg:grid-cols-[1fr_130px_120px_230px] lg:items-center">
                  <div className="flex gap-3">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      item.riskLevel === "HIGH" || item.riskLevel === "CRITICAL"
                        ? "bg-rose-50 text-rose-700"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      <ShieldAlert className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold">{item.title}</p>
                      <p className="mt-1 text-[9px] leading-5 text-slate-500">{item.description}</p>
                      <p className="mt-1 text-[7px] text-slate-300">
                        Requested by {item.requestedBy?.name ?? "Dakshin AI Manager"} ·{" "}
                        {new Date(item.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1.5 text-[8px] font-bold text-slate-600">
                    {item.type.replaceAll("_", " ")}
                  </span>
                  <span className={`w-fit rounded-full px-2.5 py-1.5 text-[8px] font-bold ${
                    item.riskLevel === "HIGH" || item.riskLevel === "CRITICAL"
                      ? "bg-rose-50 text-rose-700"
                      : "bg-amber-50 text-amber-700"
                  }`}>
                    {item.riskLevel} risk
                  </span>
                  <div className="flex items-center gap-2">
                    {item.status === "PENDING_APPROVAL" ? (
                      <>
                        <button
                          disabled={reviewing === item.id || item.validation?.valid === false}
                          onClick={() => review(item.id, "APPROVE")}
                          className="flex items-center gap-1.5 rounded-lg bg-[#173c2c] px-3 py-2 text-[8px] font-bold text-white"
                        >
                          {reviewing === item.id ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                          Approve
                        </button>
                        <button
                          disabled={reviewing === item.id}
                          onClick={() => review(item.id, "REJECT")}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[8px] font-bold"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2"><span className={`flex items-center gap-1.5 text-[8px] font-bold ${
                        item.status === "COMPLETED" || item.status === "APPROVED"
                          ? "text-emerald-700"
                          : "text-rose-700"
                      }`}>
                        {item.status === "COMPLETED" || item.status === "APPROVED"
                          ? <CheckCircle2 className="h-4 w-4" />
                          : <XCircle className="h-4 w-4" />}
                        {item.status.replaceAll("_", " ")}
                      </span>
                      {item.status === "FAILED" && (item.retryCount ?? 0) < (item.maxRetries ?? 3) && <button onClick={() => review(item.id, "RETRY")} className="rounded-lg border border-rose-200 px-2.5 py-2 text-[8px] font-bold text-rose-700">Retry</button>}</div>
                    )}
                    <button onClick={() => setExpanded(expanded === item.id ? undefined : item.id)} className="rounded-lg border border-slate-200 p-2">
                      {expanded === item.id ? <ChevronDown className="h-3.5 w-3.5 rotate-180" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
                {expanded === item.id && (
                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <div className="grid gap-3 sm:grid-cols-3">{Object.entries(item.preview ?? {}).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-[7px] font-bold uppercase tracking-wider text-slate-400">{key.replaceAll(/([A-Z])/g, " $1")}</p>
                        <p className="mt-1 text-[9px] font-semibold text-slate-700">{String(value)}</p>
                      </div>
                    ))}</div>
                    {item.validation?.checks && <div className="mt-4 border-t border-slate-200 pt-3">{item.validation.checks.map((check) => <div key={check.name} className="flex justify-between gap-4 py-1 text-[8px]"><span>{check.name}: {check.message}</span><b className={check.status === "PASS" ? "text-emerald-700" : check.status === "WARN" ? "text-amber-700" : "text-rose-700"}>{check.status}</b></div>)}</div>}
                    {item.failureReason && <p className="mt-3 rounded-lg bg-rose-50 p-3 text-[8px] text-rose-700">{item.failureReason}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-900 p-4 text-[9px] text-white/60">
        <Clock3 className="h-4 w-4 text-[#d8b66c]" />
        Every decision records reviewer, time, payload, execution result and failure reason in the audit trail.
      </div>
    </div>
  );
}
