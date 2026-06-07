"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Gift,
  Globe2,
  Leaf,
  MessageCircle,
  PackageCheck,
  Search,
  ShieldCheck,
  Sparkles,
  Star
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { blogPosts, categories, products, reviews } from "@/lib/data";
import { ProductRow } from "@/components/product-row";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.65 }
};

export function HomeContent() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <>
      <section className="container-shell py-4 sm:py-6">
        <div className="relative min-h-[610px] overflow-hidden rounded-[30px] bg-ink sm:min-h-[650px]">
          <Image
            src="/images/southaura-hero-marketplace.png"
            alt="South Indian filter coffee, spices, murukku, sweets, banana chips, pickle, silk sarees and brass pooja items"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
          <div className="relative z-10 flex min-h-[610px] max-w-3xl flex-col justify-center px-6 py-20 text-white sm:min-h-[650px] sm:px-12 lg:px-20">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-sandal" />
                100% authentic · Sourced across South India
              </span>
              <h1 className="mt-8 font-display text-5xl font-semibold leading-[0.9] tracking-[-0.045em] sm:text-7xl lg:text-[88px]">
                South India,
                <br />
                <span className="italic text-sandal">delivered</span> to you.
              </h1>
              <p className="mt-7 max-w-xl text-sm leading-7 text-white/72 sm:text-base">
                Shop authentic filter coffee, spices, snacks, sweets, pickles,
                silk sarees, pooja essentials and Ayurvedic wellness, delivered
                across India and worldwide.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/shop" className="button-primary !bg-sandal !text-ink">
                  Shop South Indian favourites <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/categories"
                  className="button-secondary !border-white/25 !bg-white/10 !text-white hover:!bg-white/20"
                >
                  Browse all categories
                </Link>
              </div>
            </motion.div>
          </div>
          <div className="absolute bottom-6 right-6 z-10 hidden rounded-2xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur-md sm:block">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-sandal">
              This week&apos;s dispatch
            </p>
            <p className="mt-1 font-display text-xl font-semibold">
              Coorg · Mysuru · Chennai
            </p>
          </div>
        </div>
      </section>

      <section className="container-shell relative z-20 -mt-11">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (query.trim()) router.push(`/shop?q=${encodeURIComponent(query)}`);
          }}
          className="surface mx-auto flex max-w-4xl items-center gap-3 rounded-full p-2.5 pl-5"
        >
          <Search className="h-5 w-5 shrink-0 text-brass" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink/40 dark:placeholder:text-white/40"
            placeholder="Search coffee, spices, sarees, gifting..."
            aria-label="Search products"
          />
          <button className="button-primary hidden sm:inline-flex">Search</button>
        </form>
      </section>

      <section className="container-shell py-16 sm:py-20">
        <motion.div {...fadeUp} className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow">Everything you miss from the South</p>
            <h2 className="section-title mt-2">Shop South Indian categories</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-ink/55 dark:text-white/55">
              Everyday groceries, famous regional flavours, festive essentials
              and timeless South Indian craft, all in one trusted store.
            </p>
          </div>
          <Link
            href="/categories"
            className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] sm:flex"
          >
            All categories <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
        <div className="scrollbar-hide flex snap-x gap-4 overflow-x-auto pb-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, x: 15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className="w-[240px] shrink-0 snap-start sm:w-[280px]"
            >
              <Link
                href={`/category/${category.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-[26px]"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="280px"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${category.accent}`}
                />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/60">
                    0{index + 1}
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-semibold leading-none">
                    {category.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/65">
                    {category.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <ProductRow
        eyebrow="Loved across India and abroad"
        title="South Indian bestsellers"
        copy="Authentic regional favourites our customers order again and again."
        products={products.filter((product) => product.featured)}
      />

      <section className="container-shell py-10 sm:py-16">
        <motion.div
          {...fadeUp}
          className="grid overflow-hidden rounded-[30px] bg-[#612f23] text-white lg:grid-cols-2"
        >
          <div className="relative min-h-[390px]">
            <Image
              src="/images/southaura-festival-gifting.webp"
              alt="Festive South Indian sweets arranged for gifting"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <p className="eyebrow !text-[#f1c98d]">Festival atelier</p>
            <h2 className="mt-4 font-display text-5xl font-semibold leading-[0.95] sm:text-6xl">
              Gifting that feels deeply personal.
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-7 text-white/70">
              Curated mithai, brass keepsakes, estate coffee and handwritten
              notes, wrapped in our signature keepsake boxes.
            </p>
            <div className="mt-8">
              <Link
                href="/shop?tag=gift"
                className="button-primary !bg-sandal !text-ink"
              >
                Discover festive gifting <Gift className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <ProductRow
        eyebrow="Freshly stocked"
        title="New South Indian arrivals"
        products={products.filter((product) => product.newArrival)}
      />

      <section className="container-shell py-14 sm:py-20">
        <motion.div {...fadeUp} className="mb-8 max-w-2xl">
          <p className="eyebrow">The southAura standard</p>
          <h2 className="section-title mt-2">
            Beautifully sourced. Carefully delivered.
          </h2>
          <p className="mt-3 text-sm leading-6 text-ink/55 dark:text-white/55">
            Clear origins, considered quality checks and support that stays
            human when it matters.
          </p>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
          <motion.div
            {...fadeUp}
            className="relative min-h-[430px] overflow-hidden rounded-[30px] bg-[#173c2c] p-7 text-white shadow-luxe sm:p-10"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full border border-sandal/20" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-sandal">
                  <Leaf className="h-3.5 w-3.5" /> Source-first curation
                </span>
                <h3 className="mt-7 max-w-lg font-display text-4xl font-semibold leading-[0.95] sm:text-5xl">
                  Provenance is our first ingredient.
                </h3>
                <p className="mt-5 max-w-lg text-sm leading-7 text-white/60">
                  We build direct relationships with makers, taste every food
                  batch and review materials before a product earns its place.
                </p>
              </div>

              <div className="mt-10">
                <div className="grid grid-cols-3 divide-x divide-white/10 border-y border-white/10 py-5">
                  {[
                    ["75+", "makers"],
                    ["12", "regions"],
                    ["100%", "traceable"]
                  ].map(([value, label]) => (
                    <div key={label} className="px-3 first:pl-0">
                      <p className="font-display text-3xl font-semibold text-sandal">
                        {value}
                      </p>
                      <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.14em] text-white/40">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/about"
                  className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-white transition hover:text-sandal"
                >
                  Meet our sourcing standard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: BadgeCheck,
                number: "01",
                metric: "18-point",
                title: "Quality review",
                copy: "Freshness, ingredients, materials and packaging checked before listing."
              },
              {
                icon: Globe2,
                number: "02",
                metric: "18+ countries",
                title: "Delivery, considered",
                copy: "Protective packing and tracked shipping designed for India and abroad."
              },
              {
                icon: ShieldCheck,
                number: "03",
                metric: "Secure",
                title: "Protected checkout",
                copy: "Trusted payment partners, transparent pricing and guarded customer data."
              },
              {
                icon: MessageCircle,
                number: "04",
                metric: "< 3 hours",
                title: "Human when needed",
                copy: "AI assistance for quick answers, with a clear path to our support team."
              }
            ].map((item, index) => {
              const FeatureIcon = item.icon;
              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.07 }}
                  className="group flex min-h-[207px] flex-col justify-between rounded-[26px] border border-ink/[0.06] bg-white/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-brass/30 hover:bg-white hover:shadow-soft dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.07]"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sandal/20 text-brass transition group-hover:bg-leaf group-hover:text-white">
                      <FeatureIcon className="h-5 w-5" />
                    </span>
                    <span className="text-[9px] font-bold tracking-[0.16em] text-ink/25 dark:text-white/25">
                      {item.number}
                    </span>
                  </div>
                  <div className="mt-6">
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-brass">
                      {item.metric}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-semibold">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-ink/50 dark:text-white/50">
                      {item.copy}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-leaf py-16 text-white sm:py-24">
        <div className="container-shell">
          <div className="text-center">
            <p className="eyebrow">Notes from our community</p>
            <h2 className="section-title mt-3">Sent with love. Received with joy.</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {reviews.map((review, index) => (
              <motion.figure
                key={review.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-[26px] border border-white/12 bg-white/[0.07] p-7 backdrop-blur"
              >
                <div className="flex gap-1 text-sandal">
                  {Array.from({ length: review.rating }).map((_, star) => (
                    <Star key={star} className="h-3.5 w-3.5 fill-sandal" />
                  ))}
                </div>
                <blockquote className="mt-6 font-display text-2xl font-medium leading-8">
                  “{review.quote}”
                </blockquote>
                <figcaption className="mt-7 text-xs">
                  <span className="font-bold">{review.name}</span>
                  <span className="ml-2 text-white/45">{review.location}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-10">
        <div className="grid divide-y divide-ink/10 border-y border-ink/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-white/10 dark:border-white/10">
          {[
            [PackageCheck, "Dispatch in 24–48 hours", "Freshness-first fulfilment"],
            [Globe2, "Worldwide delivery", "Tracked to 18+ countries"],
            [ShieldCheck, "Secure checkout", "Trusted payment partners"]
          ].map(([Icon, title, copy]) => {
            const TrustIcon = Icon as typeof PackageCheck;
            return (
              <div
                key={String(title)}
                className="flex items-center gap-4 px-4 py-7 sm:justify-center"
              >
                <TrustIcon className="h-6 w-6 text-brass" />
                <div>
                  <p className="text-xs font-bold">{String(title)}</p>
                  <p className="mt-1 text-[10px] text-ink/45 dark:text-white/45">
                    {String(copy)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container-shell py-14 sm:py-20">
        <div className="mb-8">
          <p className="eyebrow">The southAura journal</p>
          <h2 className="section-title mt-2">Stories of taste, craft and place</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {blogPosts.map((post) => (
            <article key={post.slug} className="group">
              <Link
                href={`/blog/${post.slug}`}
                className="relative block aspect-[5/4] overflow-hidden rounded-[24px]"
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </Link>
              <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.15em] text-brass">
                {post.category} · {post.date}
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold leading-tight">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              <p className="mt-2 text-xs leading-6 text-ink/55 dark:text-white/55">
                {post.excerpt}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
