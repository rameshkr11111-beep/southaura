"use client";

import { useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Database,
  CreditCard,
  KeyRound,
  MessageCircle,
  PackageCheck,
  PlugZap,
  RefreshCw,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  X
} from "lucide-react";
import { toolCatalog } from "@/lib/ai-manager/demo-data";

const icons: Record<string, typeof Database> = {
  DATA: Database,
  MESSAGING: MessageCircle,
  SOCIAL: Share2,
  ANALYTICS: BarChart3,
  SEO: Search,
  PAYMENT: CreditCard,
  DELIVERY: PackageCheck,
  AI: Sparkles
};

export function ToolsConnections() {
  const [connected, setConnected] = useState<string[]>(
    toolCatalog.filter((item) => item[4]).map((item) => item[0])
  );
  const [selected, setSelected] = useState<(typeof toolCatalog)[number]>();

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#a67c38]">
            Dakshin AI Manager / Capabilities
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold">Tool connections</h1>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500">
            Connect the approved business systems the agent may read or act through.
            Secret values stay in deployment environment variables.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[9px] font-bold text-emerald-800">
          <ShieldCheck className="h-4 w-4" /> Secrets never shown to the browser
        </div>
      </div>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ["Connected tools", String(connected.length), PlugZap],
          ["Available tools", String(toolCatalog.length), Database],
          ["Connection issues", "0", RefreshCw]
        ].map(([label, value, Icon]) => {
          const CardIcon = Icon as typeof PlugZap;
          return (
            <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <CardIcon className="h-5 w-5 text-[#a67c38]" />
              <p className="mt-4 text-2xl font-extrabold">{String(value)}</p>
              <p className="mt-1 text-[10px] text-slate-400">{String(label)}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold">Business systems</p>
            <p className="mt-1 text-[9px] text-slate-400">Agent access is limited by role, approval and connection status</p>
          </div>
          <label className="hidden h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 sm:flex">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <input className="text-[9px] outline-none" placeholder="Search tools..." />
          </label>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {toolCatalog.map((tool) => {
            const [id, name, category, group] = tool;
            const Icon = icons[category] ?? PlugZap;
            const isConnected = connected.includes(id);
            return (
              <div key={id} className="rounded-xl border border-slate-200 p-4 transition hover:border-[#d8b66c]">
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf2ee] text-[#173c2c]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-[7px] font-bold ${
                    isConnected ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-emerald-500" : "bg-slate-400"}`} />
                    {isConnected ? "Connected" : "Not connected"}
                  </span>
                </div>
                <h3 className="mt-4 text-[11px] font-bold">{name}</h3>
                <p className="mt-1 text-[8px] text-slate-400">{group}</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="flex items-center gap-1.5 text-[8px] text-slate-400">
                    <KeyRound className="h-3 w-3" />
                    Environment variable
                  </p>
                  <button
                    onClick={() => setSelected(tool)}
                    className={`rounded-lg px-3 py-2 text-[8px] font-bold ${
                      isConnected
                        ? "border border-slate-200 text-slate-600"
                        : "bg-[#173c2c] text-white"
                    }`}
                  >
                    {isConnected ? "Manage" : "Connect"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm" onClick={() => setSelected(undefined)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#a67c38]">{selected[3]}</p>
                <h2 className="mt-2 font-display text-3xl font-semibold">{selected[1]}</h2>
              </div>
              <button onClick={() => setSelected(undefined)} className="rounded-lg border border-slate-200 p-2"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="flex items-center gap-2 text-[9px] font-bold text-amber-900">
                <ShieldCheck className="h-4 w-4" /> Secure key handling
              </p>
              <p className="mt-2 text-[8px] leading-4 text-amber-800">
                Add the provider credential in Netlify, Vercel or your local
                `.env`. This panel stores only the environment-variable name,
                never the secret value.
              </p>
            </div>
            <label className="mt-5 block">
              <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Environment variable reference</span>
              <input
                readOnly
                value={secretName(selected[0])}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 font-mono text-[10px] outline-none"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Connection label</span>
              <input className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-[10px] outline-none focus:border-[#a67c38]" defaultValue={`${selected[1]} production`} />
            </label>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
                  setConnected((current) =>
                    current.includes(selected[0])
                      ? current.filter((item) => item !== selected[0])
                      : [...current, selected[0]]
                  );
                  setSelected(undefined);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#173c2c] py-3 text-[9px] font-bold text-white"
              >
                <CheckCircle2 className="h-4 w-4" />
                {connected.includes(selected[0]) ? "Disconnect tool" : "Save connection reference"}
              </button>
              <button className="rounded-xl border border-slate-200 px-4 text-[9px] font-bold">Test</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function secretName(provider: string) {
  const names: Record<string, string> = {
    website_database: "DATABASE_URL",
    product_catalog: "DATABASE_URL",
    orders_database: "DATABASE_URL",
    customers_database: "DATABASE_URL",
    whatsapp: "WHATSAPP_ACCESS_TOKEN",
    facebook: "FACEBOOK_ACCESS_TOKEN",
    instagram: "INSTAGRAM_ACCESS_TOKEN",
    youtube: "YOUTUBE_API_KEY",
    google_analytics: "GOOGLE_ANALYTICS_CREDENTIALS",
    search_console: "GOOGLE_SEARCH_CONSOLE_CREDENTIALS",
    razorpay: "RAZORPAY_KEY_SECRET",
    shiprocket: "SHIPROCKET_TOKEN",
    smtp: "SMTP_PASSWORD",
    sms: "SMS_API_KEY",
    openai: "OPENAI_API_KEY"
  };
  return names[provider] ?? `${provider.toUpperCase()}_API_KEY`;
}
