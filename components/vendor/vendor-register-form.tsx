"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";

export function VendorRegisterForm() {
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");

  if (complete) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
        <h2 className="mt-4 font-display text-3xl font-semibold">Application prepared.</h2>
        <p className="mt-3 text-sm leading-6 text-emerald-900/65">Your shop is pending marketplace review. Sign in to complete bank verification, policies and your first product listings.</p>
        <Link href="/vendor/login" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#173c2c] px-6 py-3 text-sm font-bold text-white">Go to vendor login <ArrowRight className="h-4 w-4" /></Link>
      </div>
    );
  }

  return (
    <form onSubmit={async (event) => {
      event.preventDefault();
      setLoading(true);
      setError("");
      const form = new FormData(event.currentTarget);
      const response = await fetch("/api/vendor/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form.entries()))
      });
      const result = await response.json();
      setLoading(false);
      if (!response.ok) {
        const fieldMessage = Object.values(result.error?.fieldErrors ?? {}).flat()[0];
        return setError(String(fieldMessage ?? result.error ?? "Unable to create the vendor account."));
      }
      setComplete(true);
    }} className="space-y-7">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="font-display text-2xl font-semibold">Owner information</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <input name="firstName" required className="field" placeholder="First name" />
          <input name="lastName" required className="field" placeholder="Last name" />
          <input name="email" required type="email" className="field" placeholder="Business email" />
          <input name="phone" required type="tel" className="field" placeholder="Mobile / WhatsApp" />
          <input name="password" required type="password" minLength={8} className="field sm:col-span-2" placeholder="Create password" />
        </div>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="font-display text-2xl font-semibold">Your new shop</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <input name="shopName" required className="field sm:col-span-2" placeholder="Shop name" />
          <select name="category" className="field"><option>Food & groceries</option><option>Fashion & handloom</option><option>Home & pooja</option><option>Ayurveda & wellness</option><option>Multiple categories</option></select>
          <input name="city" required className="field" placeholder="City" />
          <input name="gstin" className="field" placeholder="GSTIN (optional to apply)" />
          <input name="pan" className="field" placeholder="PAN" />
          <textarea name="description" required minLength={30} rows={4} className="field h-auto py-3 sm:col-span-2" placeholder="Tell us about your products, origin and production process" />
        </div>
      </section>
      <label className="flex items-start gap-3 text-xs leading-6 text-slate-500"><input required type="checkbox" className="mt-1.5 accent-[#173c2c]" />I confirm that product, tax and banking information is accurate and agree to the marketplace vendor terms.</label>
      {error && <p className="rounded-xl bg-rose-50 p-3 text-xs font-semibold leading-5 text-rose-700">{error}</p>}
      <button disabled={loading} className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#173c2c] px-6 py-4 text-sm font-bold text-white disabled:opacity-60">
        {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Submit vendor application"} {!loading && <ArrowRight className="h-4 w-4" />}
      </button>
    </form>
  );
}
