import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Compass, Sparkles } from "lucide-react";
import { categories, products } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shop by Category",
  description:
    "Explore all southAura collections, from coffee and spices to handloom, Ayurveda, pooja and elegant homeware."
};

const categoryNotes: Record<string, string> = {
  "south-indian-groceries": "Pantry",
  "namkeen-snacks": "Small batch",
  sweets: "Celebration",
  "sarees-garments": "Handloom",
  "pooja-items": "Ritual",
  "ayurvedic-products": "Wellness",
  "home-kitchen": "Living",
  "spices-masala": "Flavour",
  "pickles-papad": "Preserves",
  "coffee-tea": "Estate"
};

export default function CategoriesPage() {
  return (
    <>
      <section className="container-shell pt-5 sm:pt-8">
        <div className="overflow-hidden rounded-[30px] bg-[#173c2c] text-white">
          <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_0.7fr] lg:items-end lg:p-14">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-sandal">
                <Compass className="h-3.5 w-3.5" /> Ten ways into the South
              </span>
              <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[0.92] sm:text-7xl">
                Collections shaped by taste, craft and place.
              </h1>
            </div>
            <div>
              <p className="max-w-lg text-sm leading-7 text-white/60">
                Start with what you miss, what you want to discover, or the
                ritual you want to bring home. Every collection is curated from
                trusted southern makers.
              </p>
              <Link href="/shop" className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-sandal">
                Browse all {products.length} products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="grid border-t border-white/10 sm:grid-cols-3">
            {[["10", "distinct collections"], ["5", "southern states"], ["75+", "maker relationships"]].map(([value, label]) => (
              <div key={label} className="border-b border-white/10 px-7 py-5 last:border-0 sm:border-b-0 sm:border-r">
                <p className="font-display text-3xl font-semibold text-sandal">{value}</p>
                <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.14em] text-white/40">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-12 sm:py-16">
        <div className="mb-8 flex items-end justify-between gap-5">
          <div><p className="eyebrow">Choose your collection</p><h2 className="section-title mt-2">What are you looking for today?</h2></div>
          <span className="hidden items-center gap-2 text-[9px] font-bold uppercase tracking-[0.14em] text-ink/40 sm:flex dark:text-white/40"><Sparkles className="h-4 w-4 text-brass" /> Curated, never crowded</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => {
            const count = products.filter((product) => product.category === category.slug).length;
            const featured = index === 0 || index === 3 || index === 7;
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className={`group relative overflow-hidden rounded-[26px] ${featured ? "min-h-[440px] lg:col-span-2" : "min-h-[340px]"}`}
              >
                <Image src={category.image} alt={category.name} fill className="object-cover transition duration-700 group-hover:scale-105" sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"} />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.accent}`} />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 text-white">
                  <span className="rounded-full border border-white/20 bg-ink/15 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.14em] backdrop-blur">{categoryNotes[category.slug]}</span>
                  <span className="text-[9px] font-bold text-white/60">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-sandal">{count} products</p>
                  <div className="mt-2 flex items-end justify-between gap-4">
                    <div><h2 className={`font-display font-semibold leading-none ${featured ? "text-4xl sm:text-5xl" : "text-3xl"}`}>{category.name}</h2><p className="mt-3 max-w-md text-xs leading-5 text-white/65">{category.description}</p></div>
                    <span className="shrink-0 rounded-full border border-white/25 bg-white/10 p-3 backdrop-blur transition group-hover:bg-white group-hover:text-ink"><ArrowUpRight className="h-4 w-4" /></span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
