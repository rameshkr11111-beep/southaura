import type { Metadata } from "next";
import { Check, MapPin, PackageCheck, Search, Truck } from "lucide-react";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Track a southAura order using your order number and email address."
};

export default function TrackOrderPage() {
  return (
    <>
      <PageHero
        eyebrow="From our hands to yours"
        title="Follow your order."
        description="Enter your order number and email to see the latest dispatch and delivery updates."
        crumbs={[{ label: "Track order" }]}
      />
      <div className="container-shell py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <form className="surface grid gap-4 p-6 sm:grid-cols-[1fr_1fr_auto] sm:p-8">
            <input className="field" placeholder="Order number, e.g. SA260605" />
            <input className="field" type="email" placeholder="Email address" />
            <button type="button" className="button-primary">
              <Search className="h-4 w-4" /> Track
            </button>
          </form>
          <div className="mt-10 rounded-[28px] border border-ink/10 p-7 sm:p-10 dark:border-white/10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Demo order · SA260605</p>
                <h2 className="mt-2 font-display text-3xl font-semibold">
                  Arriving Monday, June 8
                </h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-emerald-800">
                In transit
              </span>
            </div>
            <div className="relative mt-10 space-y-8 before:absolute before:bottom-5 before:left-[17px] before:top-5 before:w-px before:bg-ink/10 dark:before:bg-white/10">
              {[
                [Check, "Order confirmed", "June 5 · 10:42 AM", true],
                [PackageCheck, "Packed with care", "June 5 · 4:15 PM", true],
                [Truck, "In transit to Delhi hub", "June 6 · 8:30 AM", true],
                [MapPin, "Out for delivery", "Expected June 8", false]
              ].map(([Icon, title, time, done]) => {
                const StepIcon = Icon as typeof Check;
                return (
                  <div key={String(title)} className="relative flex gap-5">
                    <span
                      className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        done
                          ? "bg-leaf text-white"
                          : "border border-ink/15 bg-cream text-ink/35 dark:border-white/15 dark:bg-[#101713] dark:text-white/35"
                      }`}
                    >
                      <StepIcon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-bold">{String(title)}</p>
                      <p className="mt-1 text-xs text-ink/45 dark:text-white/45">
                        {String(time)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
