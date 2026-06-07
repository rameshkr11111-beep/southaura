"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  Heart,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useStore } from "@/components/store-provider";
import { ProductRow } from "@/components/product-row";
import { trackCommerceEvent } from "@/components/analytics-tracker";

export function ProductDetailClient({
  product,
  related
}: {
  product: Product;
  related: Product[];
}) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const saved = isWishlisted(product.id);
  const unavailable = product.stock < 1;
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919871877072";
  const whatsappMessage = encodeURIComponent(
    `Hello southAura, I am interested in ${product.name} (${product.weight}). Quantity: ${quantity}. Total: ${formatCurrency(product.price * quantity)}. Product: /products/${product.slug}`
  );

  useEffect(() => {
    trackCommerceEvent("view_item", {
      productRef: product.slug,
      value: product.price,
      metadata: { name: product.name, category: product.category }
    });
  }, [product.category, product.name, product.price, product.slug]);

  const handleAdd = () => {
    if (unavailable) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleBuyNow = () => {
    if (unavailable) return;
    addToCart(product, quantity);
    router.push("/checkout");
  };

  return (
    <>
      <div className="container-shell py-8 sm:py-12">
        <nav className="mb-7 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-ink/40 dark:text-white/40">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/shop">Shop</Link>
          <span>/</span>
          <Link href={`/category/${product.category}`}>{product.category}</Link>
          <span>/</span>
          <span className="text-ink dark:text-white">{product.name}</span>
        </nav>
        <div className="grid gap-9 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="grid gap-3 sm:grid-cols-2">
            {[product.image, product.image, product.image].map((image, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-[26px] bg-mist ${
                  index === 0 ? "aspect-[4/5] sm:col-span-2 sm:aspect-[7/6]" : "aspect-[4/5]"
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name}${index ? ` detail ${index}` : ""}`}
                  fill
                  priority={index === 0}
                  className={`object-cover ${index === 1 ? "scale-110" : ""} ${
                    index === 2 ? "scale-125 object-bottom" : ""
                  }`}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>
            ))}
          </div>
          <div className="lg:sticky lg:top-28 lg:self-start">
            {product.badge && (
              <span className="rounded-full bg-sandal/25 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-brass">
                {product.badge}
              </span>
            )}
            <h1 className="mt-5 font-display text-4xl font-semibold leading-none sm:text-5xl">
              {product.name}
            </h1>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-3.5 w-3.5 fill-brass text-brass"
                  />
                ))}
              </div>
              <a href="#reviews" className="text-xs underline underline-offset-4">
                {product.rating} · {product.reviewCount} reviews
              </a>
            </div>
            <div className="mt-6 flex items-end gap-3">
              <span className="text-2xl font-bold">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="pb-0.5 text-sm text-ink/35 line-through dark:text-white/35">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <p className="mt-2 text-[10px] text-ink/45 dark:text-white/45">
              Inclusive of all taxes · {product.weight}
            </p>
            <p className="mt-7 text-sm leading-7 text-ink/65 dark:text-white/65">
              {product.longDescription}
            </p>

            <div className="mt-7 flex items-center gap-2 text-xs font-semibold text-leaf dark:text-sandal">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {product.stock > 10
                ? "In stock and ready to dispatch"
                : `Only ${product.stock} left in this batch`}
            </div>

            <div className="mt-7 flex gap-3">
              <div className="flex h-12 items-center rounded-full border border-ink/15 dark:border-white/15">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={unavailable || quantity >= product.stock}
                  className="p-3"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleAdd}
                disabled={unavailable}
                className="button-primary flex-1"
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" /> Added to bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" /> Add to bag
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 dark:border-white/15"
                aria-label="Toggle wishlist"
              >
                <Heart
                  className={`h-5 w-5 ${
                    saved ? "fill-vermilion text-vermilion" : ""
                  }`}
                />
              </button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={unavailable}
                className="button-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Zap className="h-4 w-4" /> Buy now
              </button>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1fb85a]"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp inquiry
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-mist/60 p-4 dark:bg-white/5">
                <Truck className="h-5 w-5 text-brass" />
                <p className="mt-3 text-xs font-bold">Delivery estimate</p>
                <p className="mt-1 text-[10px] leading-5 text-ink/50 dark:text-white/50">
                  Delhi NCR: 2–4 days · International: 7–12 days
                </p>
              </div>
              <div className="rounded-2xl bg-mist/60 p-4 dark:bg-white/5">
                <ShieldCheck className="h-5 w-5 text-brass" />
                <p className="mt-3 text-xs font-bold">Easy returns</p>
                <p className="mt-1 text-[10px] leading-5 text-ink/50 dark:text-white/50">
                  Eligible non-food items returnable within 7 days.
                </p>
              </div>
            </div>

            <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10 dark:divide-white/10 dark:border-white/10">
              {[
                ["Origin", product.origin],
                ["Details & care", `Net weight: ${product.weight}. Store with care and keep sealed.`],
                ["Shipping & returns", "Packed in 24–48 hours. Clear tracking from dispatch to doorstep."]
              ].map(([title, copy]) => (
                <details key={title} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-bold uppercase tracking-[0.12em]">
                    {title}
                    <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                  </summary>
                  <p className="pt-3 text-xs leading-6 text-ink/55 dark:text-white/55">
                    {copy}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section id="reviews" className="container-shell py-14 sm:py-20">
        <div className="surface grid gap-10 p-7 sm:p-10 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="eyebrow">Community notes</p>
            <p className="mt-4 font-display text-6xl font-semibold">{product.rating}</p>
            <div className="mt-3 flex gap-1 text-brass">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-brass" />
              ))}
            </div>
            <p className="mt-2 text-xs text-ink/45 dark:text-white/45">
              Based on {product.reviewCount} verified purchases
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              ["Remarkable quality", "The details and packaging were as thoughtful as the product itself.", "Ananya S."],
              ["Feels truly authentic", "Fresh, beautifully balanced and unlike anything from a general marketplace.", "Rohit M."]
            ].map(([title, quote, name]) => (
              <figure key={title} className="rounded-2xl bg-mist/60 p-6 dark:bg-white/5">
                <div className="flex gap-1 text-brass">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-3 w-3 fill-brass" />
                  ))}
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold">{title}</h3>
                <blockquote className="mt-2 text-xs leading-6 text-ink/60 dark:text-white/60">
                  “{quote}”
                </blockquote>
                <figcaption className="mt-4 text-[10px] font-bold uppercase tracking-wider">
                  {name} · Verified buyer
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <ProductRow
        eyebrow="Pairs beautifully with"
        title="Complete the ritual"
        products={related}
      />
      <ProductRow
        eyebrow="Recently viewed"
        title="Still on your mind"
        products={[product, ...related].slice(0, 4)}
      />
    </>
  );
}
