import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Globe2, PackageCheck } from "lucide-react";
import { ShopClient } from "@/components/shop-client";
import { categories, products } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shop South Indian Food, Craft & Wellness",
  description:
    "Browse southAura's curated collection of premium South Indian groceries, snacks, sweets, coffee, handloom, Ayurveda and home products."
};

export default function ShopPage() {
  return (
    <>
      <section className="container-shell pt-5 sm:pt-8">
        <div className="relative overflow-hidden rounded-[30px] bg-[#173c2c] text-white">
          <div className="grid min-h-[420px] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="relative z-10 flex flex-col justify-center p-7 sm:p-12 lg:p-14">
              <p className="eyebrow !text-sandal">The complete southAura edit</p>
              <h1 className="mt-4 max-w-xl font-display text-5xl font-semibold leading-[0.92] sm:text-6xl">
                Find something with a real sense of place.
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/65">
                Food, craft, wellness and rituals from trusted makers across
                South India, ready for everyday use and thoughtful gifting.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                <Link href="/shop?sort=popular" className="button-primary !bg-sandal !text-ink">
                  Shop bestsellers <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/shop?sort=newest" className="button-secondary !border-white/15 !bg-white/5 !text-white">
                  See what is new
                </Link>
              </div>
            </div>
            <div className="relative min-h-[330px] lg:min-h-full">
              <Image
                src="/images/southaura-hero-marketplace.png"
                alt="Premium South Indian coffee, spices, sweets, snacks, silk and pooja products"
                fill
                priority
                className="object-cover object-[65%_center]"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#173c2c] via-[#173c2c]/10 to-transparent lg:block" />
            </div>
          </div>
          <div className="grid border-t border-white/10 sm:grid-cols-3">
            {[
              [BadgeCheck, `${products.length} curated products`, "Chosen for quality and origin"],
              [PackageCheck, "Freshness-first dispatch", "Packed with category-specific care"],
              [Globe2, "India and worldwide", "Tracked delivery to 18+ countries"]
            ].map(([Icon, title, copy]) => {
              const TrustIcon = Icon as typeof BadgeCheck;
              return (
                <div key={String(title)} className="flex items-center gap-3 border-b border-white/10 px-6 py-4 last:border-0 sm:border-b-0 sm:border-r">
                  <TrustIcon className="h-5 w-5 text-sandal" />
                  <div><p className="text-[10px] font-bold">{String(title)}</p><p className="mt-0.5 text-[8px] text-white/45">{String(copy)}</p></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-shell pt-9">
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
          <Link href="/shop" className="shrink-0 rounded-full bg-leaf px-4 py-2.5 text-[10px] font-bold text-white">
            All collections
          </Link>
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`} className="shrink-0 rounded-full border border-ink/10 bg-white/50 px-4 py-2.5 text-[10px] font-bold transition hover:border-brass hover:text-brass dark:border-white/10 dark:bg-white/5">
              {category.name}
            </Link>
          ))}
        </div>
      </section>
      <Suspense>
        <ShopClient />
      </Suspense>
    </>
  );
}
