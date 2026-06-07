"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, LoaderCircle, PhoneCall, Sparkles, X } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { trackCommerceEvent } from "@/components/analytics-tracker";

export function ProductLeadDialog({
  product,
  quantity = 1,
  compact = false
}: {
  product: Product;
  quantity?: number;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const estimatedValue = product.price * quantity;
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919871877072";
  const whatsappMessage = encodeURIComponent(
    `Hello SouthAura, I would like an offer for ${product.name} (${product.weight}), quantity ${quantity}.`
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = Object.fromEntries(new FormData(event.currentTarget));
    const params = new URLSearchParams(window.location.search);
    const response = await fetch("/api/assistant/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        phone: String(form.phone ?? "").replace(/\s+/g, ""),
        productInterest: `${product.name} (${product.weight})`,
        productSlug: product.slug,
        category: product.category,
        quantity,
        estimatedValue,
        page: window.location.pathname,
        source: params.get("utm_source") ?? "WEBSITE_PRODUCT",
        campaign: params.get("utm_campaign") ?? undefined,
        medium: params.get("utm_medium") ?? undefined
      })
    });
    setBusy(false);
    if (!response.ok) {
      setError("Online lead storage is being connected. Please send this enquiry on WhatsApp so our team receives it immediately.");
      return;
    }
    trackCommerceEvent("generate_lead", {
      productRef: product.slug,
      value: estimatedValue,
      metadata: { category: product.category, source: "product_enquiry" }
    });
    setSaved(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setSaved(false);
          setError("");
          setOpen(true);
        }}
        className={
          compact
            ? "mt-2 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-brass/45 bg-sandal/10 px-3 text-[9px] font-bold text-brass transition hover:bg-sandal/20"
            : "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-brass/45 bg-sandal/10 px-6 text-sm font-bold text-brass transition hover:-translate-y-0.5 hover:bg-sandal/20"
        }
      >
        <PhoneCall className="h-4 w-4" />
        Get offer / Request callback
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[120] flex items-end justify-center bg-ink/45 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onClick={() => setOpen(false)}
        >
          <section
            className="max-h-[92vh] w-full overflow-y-auto rounded-t-[28px] bg-cream p-6 shadow-2xl dark:bg-[#111914] sm:max-w-lg sm:rounded-[28px] sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" /> Personal shopping
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold">
                  Get the best offer
                </h2>
                <p className="mt-2 text-xs leading-5 text-ink/55 dark:text-white/55">
                  Tell us what you need. Our team will contact you about{" "}
                  <strong>{product.name}</strong>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-ink/10 p-2 dark:border-white/10"
                aria-label="Close lead form"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {saved ? (
              <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-7 text-center text-emerald-900">
                <CheckCircle2 className="mx-auto h-10 w-10" />
                <h3 className="mt-4 font-display text-2xl font-semibold">Enquiry received</h3>
                <p className="mt-2 text-xs leading-5">
                  Your request is now in the SouthAura CRM. Our team will contact you shortly.
                </p>
                <button type="button" onClick={() => setOpen(false)} className="button-primary mt-5">
                  Continue shopping
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-6">
                <div className="rounded-2xl bg-white/70 p-4 text-xs dark:bg-white/5">
                  <p className="font-bold">{product.name}</p>
                  <p className="mt-1 text-ink/50 dark:text-white/50">
                    {product.weight} · Quantity {quantity} · Approx. {formatCurrency(estimatedValue)}
                  </p>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <input name="name" required minLength={2} className="field" placeholder="Your name *" />
                  <input name="phone" required minLength={7} className="field" placeholder="Mobile / WhatsApp *" />
                  <input name="email" type="email" className="field" placeholder="Email address" />
                  <input name="city" className="field" placeholder="City / Country" />
                  <select name="requirement" className="field sm:col-span-2" defaultValue="Best price and product details">
                    <option>Best price and product details</option>
                    <option>Bulk or corporate purchase</option>
                    <option>International delivery enquiry</option>
                    <option>Gift recommendation</option>
                    <option>Product availability</option>
                  </select>
                  <select name="preferredContact" className="field sm:col-span-2" defaultValue="WhatsApp">
                    <option>WhatsApp</option>
                    <option>Phone call</option>
                    <option>Email</option>
                  </select>
                  <textarea
                    name="notes"
                    className="field min-h-24 resize-none py-3 sm:col-span-2"
                    placeholder="Any quantity, delivery or product requirement?"
                  />
                </div>
                <label className="mt-4 flex items-start gap-2 text-[9px] leading-4 text-ink/50 dark:text-white/50">
                  <input name="consent" value="yes" type="checkbox" required className="mt-0.5" />
                  I agree that SouthAura may contact me about this enquiry. No payment is requested through this form.
                </label>
                {error && (
                  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-[10px] leading-5 text-amber-900">
                    <p>{error}</p>
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-2 font-bold text-emerald-700 underline"
                    >
                      Send enquiry on WhatsApp
                    </a>
                  </div>
                )}
                <button disabled={busy} className="button-primary mt-5 w-full">
                  {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <PhoneCall className="h-4 w-4" />}
                  {busy ? "Saving enquiry..." : "Request callback"}
                </button>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  );
}
