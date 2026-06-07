"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ChevronDown,
  PackageSearch,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X
} from "lucide-react";
import { categories, products } from "@/lib/data";
import { ProductCard } from "@/components/product-card";

export function ShopClient({ categorySlug }: { categorySlug?: string }) {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const tag = searchParams.get("tag")?.toLowerCase() ?? "";
  const [category, setCategory] = useState(categorySlug ?? "all");
  const [maxPrice, setMaxPrice] = useState(4500);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState(searchParams.get("sort") ?? "featured");
  const [localQuery, setLocalQuery] = useState(urlQuery);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const query = localQuery.trim().toLowerCase();
    const result = products.filter((product) => {
      const searchable = `${product.name} ${product.description} ${product.origin} ${product.tags.join(" ")}`.toLowerCase();
      return (
        (category === "all" || product.category === category) &&
        product.price <= maxPrice &&
        product.rating >= minRating &&
        (!query || searchable.includes(query)) &&
        (!tag || product.tags.includes(tag))
      );
    });
    return [...result].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "popular") return b.reviewCount - a.reviewCount;
      if (sort === "newest") return Number(b.newArrival ?? false) - Number(a.newArrival ?? false);
      return Number(b.featured ?? false) - Number(a.featured ?? false);
    });
  }, [category, localQuery, maxPrice, minRating, sort, tag]);

  function resetFilters() {
    setCategory(categorySlug ?? "all");
    setMaxPrice(4500);
    setMinRating(0);
    setLocalQuery("");
  }

  const activeFilters = [
    category !== "all" ? categories.find((item) => item.slug === category)?.name : undefined,
    maxPrice < 4500 ? `Under ₹${maxPrice.toLocaleString("en-IN")}` : undefined,
    minRating > 0 ? `${minRating}+ stars` : undefined,
    localQuery ? `Search: ${localQuery}` : undefined
  ].filter(Boolean) as string[];

  const filters = (
    <div className="space-y-7">
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.14em]">Collections</h3>
        <div className="mt-3 space-y-1">
          <CategoryFilter active={category === "all"} label="All products" count={products.length} onClick={() => setCategory("all")} />
          {categories.map((item) => (
            <CategoryFilter
              key={item.slug}
              active={category === item.slug}
              label={item.name}
              count={products.filter((product) => product.category === item.slug).length}
              onClick={() => setCategory(item.slug)}
            />
          ))}
        </div>
      </div>
      <div className="border-t border-ink/10 pt-6 dark:border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.14em]">Price</h3>
          <span className="text-[9px] text-ink/50 dark:text-white/50">Up to ₹{maxPrice.toLocaleString("en-IN")}</span>
        </div>
        <input type="range" min="250" max="4500" step="250" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} className="mt-5 w-full accent-leaf" />
        <div className="mt-2 flex justify-between text-[8px] text-ink/35 dark:text-white/35"><span>₹250</span><span>₹4,500</span></div>
      </div>
      <div className="border-t border-ink/10 pt-6 dark:border-white/10">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.14em]">Customer rating</h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[0, 4.5, 4.7, 4.8].map((rating) => (
            <button type="button" key={rating} onClick={() => setMinRating(rating)} className={`rounded-xl border px-3 py-2 text-[9px] font-bold ${minRating === rating ? "border-leaf bg-leaf text-white" : "border-ink/10 dark:border-white/10"}`}>
              {rating === 0 ? "All ratings" : `${rating}+ stars`}
            </button>
          ))}
        </div>
      </div>
      <button type="button" onClick={resetFilters} className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink/10 py-3 text-[9px] font-bold dark:border-white/10">
        <RotateCcw className="h-3.5 w-3.5" /> Reset filters
      </button>
    </div>
  );

  return (
    <div className="container-shell py-10 sm:py-14">
      <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <label className="flex h-12 items-center gap-3 rounded-2xl border border-ink/10 bg-white/60 px-4 dark:border-white/10 dark:bg-white/5">
          <Search className="h-4 w-4 text-brass" />
          <input value={localQuery} onChange={(event) => setLocalQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-xs outline-none" placeholder="Search by product, ingredient or origin..." />
          {localQuery && <button type="button" onClick={() => setLocalQuery("")} aria-label="Clear search"><X className="h-3.5 w-3.5" /></button>}
        </label>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setFiltersOpen(true)} className="button-secondary !px-4 !py-2.5 lg:hidden"><SlidersHorizontal className="h-4 w-4" /> Filters</button>
          <label className="relative flex h-10 items-center rounded-full border border-ink/10 bg-white/50 dark:border-white/10 dark:bg-white/5">
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-full appearance-none bg-transparent pl-4 pr-9 text-xs font-semibold outline-none" aria-label="Sort products">
              <option value="featured">Featured</option><option value="popular">Popularity</option><option value="rating">Top rated</option><option value="newest">New arrivals</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5" />
          </label>
        </div>
      </div>

      <div className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-5 dark:border-white/10">
        <div><p className="text-sm font-bold">{filtered.length} products</p><p className="mt-1 text-[9px] text-ink/45 dark:text-white/45">Prices include applicable product taxes.</p></div>
        {activeFilters.length > 0 && <div className="flex flex-wrap gap-2">{activeFilters.map((item) => <span key={item} className="rounded-full bg-mist px-3 py-1.5 text-[9px] font-bold dark:bg-white/10">{item}</span>)}</div>}
      </div>

      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block"><div className="sticky top-28 rounded-[24px] border border-ink/10 bg-white/50 p-5 dark:border-white/10 dark:bg-white/[0.03]">{filters}</div></aside>
        <div>
          {filtered.length ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 xl:grid-cols-3 xl:gap-x-6">
              {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="surface px-6 py-20 text-center">
              <PackageSearch className="mx-auto h-8 w-8 text-brass" />
              <p className="mt-5 font-display text-3xl font-semibold">No perfect match yet</p>
              <p className="mt-2 text-sm text-ink/55 dark:text-white/55">Try a broader category, price or rating.</p>
              <button type="button" onClick={resetFilters} className="button-primary mt-6"><Sparkles className="h-4 w-4" /> Show all products</button>
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-[80] bg-ink/45 lg:hidden" onClick={() => setFiltersOpen(false)}>
          <aside className="ml-auto h-full w-[88%] max-w-sm overflow-y-auto bg-cream p-6 dark:bg-[#101713]" onClick={(event) => event.stopPropagation()}>
            <div className="mb-8 flex items-center justify-between"><h2 className="font-display text-3xl font-semibold">Refine the collection</h2><button type="button" onClick={() => setFiltersOpen(false)} className="rounded-full border border-ink/10 p-2 dark:border-white/10"><X className="h-5 w-5" /></button></div>
            {filters}
            <button type="button" onClick={() => setFiltersOpen(false)} className="button-primary mt-8 w-full">Show {filtered.length} products</button>
          </aside>
        </div>
      )}
    </div>
  );
}

function CategoryFilter({ active, label, count, onClick }: { active: boolean; label: string; count: number; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[10px] transition ${active ? "bg-leaf font-bold text-white" : "text-ink/65 hover:bg-mist/60 dark:text-white/65 dark:hover:bg-white/5"}`}><span>{label}</span><span className="text-[8px] opacity-60">{count}</span></button>;
}
