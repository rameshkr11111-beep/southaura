import type { Metadata } from "next";
import Image from "next/image";
import { HeartHandshake, Map, Scale, Sprout } from "lucide-react";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Learn how southAura brings South India's remarkable food, craft and rituals to thoughtful customers everywhere."
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our story"
        title="A bridge to the South, built with care."
        description="southAura began with a simple belief: the best of South India deserves to travel without losing its story, standards or soul."
        crumbs={[{ label: "About us" }]}
      />
      <div className="container-shell py-12 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="relative min-h-[500px] overflow-hidden rounded-[28px]">
            <Image
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=88"
              alt="Whole spices sourced from South Indian growers"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="surface flex flex-col justify-center p-8 sm:p-12">
            <p className="eyebrow">Why we exist</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-none sm:text-5xl">
              Not another marketplace. A point of view.
            </h2>
            <div className="mt-6 space-y-5 text-sm leading-7 text-ink/60 dark:text-white/60">
              <p>
                For customers living away from the South, authenticity is often
                reduced to nostalgia or convenience. We wanted something better:
                trusted provenance, elegant presentation and a genuinely modern
                standard of service.
              </p>
              <p>
                We work directly with family businesses, farms, ateliers and
                specialists. We taste and test. We ask difficult questions about
                ingredients, materials, labour and packaging. Then we select only
                what we would proudly send to our own homes.
              </p>
            </div>
          </div>
        </div>
        <div className="grid gap-5 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [Map, "75+ makers", "Across Karnataka, Kerala, Tamil Nadu, Andhra Pradesh and Telangana."],
            [Scale, "Quality first", "Clear standards for taste, craft, freshness and responsible sourcing."],
            [Sprout, "Lighter impact", "Recyclable packaging and consolidated, efficient dispatch wherever possible."],
            [HeartHandshake, "Human service", "Warm, responsive support before, during and after every order."]
          ].map(([Icon, title, copy]) => {
            const ValueIcon = Icon as typeof Map;
            return (
              <div key={String(title)} className="rounded-[24px] bg-mist/60 p-7 dark:bg-white/5">
                <ValueIcon className="h-6 w-6 text-brass" />
                <h3 className="mt-6 font-display text-2xl font-semibold">{String(title)}</h3>
                <p className="mt-2 text-xs leading-6 text-ink/55 dark:text-white/55">{String(copy)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
