"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Heart, MessageCircle, Minus, Plus, ShoppingBag, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useStore } from "@/components/store-provider";
import { ProductLeadDialog } from "@/components/product-lead-dialog";

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const saved = isWishlisted(product.id);
  const unavailable = product.stock < 1;
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919871877072";

  function addSelectedQuantity() {
    if (unavailable) return;
    addToCart(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  function buyNow() {
    if (unavailable) return;
    addToCart(product, quantity);
    router.push("/checkout");
  }

  const whatsappMessage = encodeURIComponent(
    `Hello southAura, I am interested in ${product.name} (${product.weight}). Quantity: ${quantity}. Total: ${formatCurrency(product.price * quantity)}. Product: /products/${product.slug}`
  );

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      className="group min-w-0"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-mist">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.045]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        </Link>
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-ink backdrop-blur">
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-vermilion px-2.5 py-1.5 text-[9px] font-bold text-white">
            {discount}% off
          </span>
        )}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className="absolute right-3 top-3 rounded-full bg-white/85 p-2 text-ink backdrop-blur transition hover:scale-105"
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-4 w-4 ${saved ? "fill-vermilion text-vermilion" : ""}`}
          />
        </button>
      </div>
      <div className="px-1 pt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-ink/45 dark:text-white/45">
            {product.origin}
          </p>
          <span className="flex items-center gap-1 text-[10px] font-semibold">
            <Star className="h-3 w-3 fill-brass text-brass" />
            {product.rating}
          </span>
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1.5 line-clamp-1 font-display text-xl font-semibold transition group-hover:text-brass">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-[10px] text-ink/45 dark:text-white/45">
          {product.weight}
          <span className="mx-1.5">·</span>
          <span className={product.stock <= 10 ? "font-bold text-vermilion" : ""}>
            {product.stock > 10
              ? "In stock"
              : product.stock > 0
                ? `Only ${product.stock} left`
                : "Out of stock"}
          </span>
        </p>
        <div className="mt-2.5 flex items-center gap-2">
          <span className="text-sm font-bold">{formatCurrency(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-ink/35 line-through dark:text-white/35">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink/45 dark:text-white/45">
            Quantity
          </span>
          <div className="flex h-9 items-center rounded-full border border-ink/15 bg-white/60 dark:border-white/15 dark:bg-white/5">
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              className="p-2"
              aria-label={`Decrease ${product.name} quantity`}
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-7 text-center text-xs font-bold">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))}
              disabled={unavailable || quantity >= product.stock}
              className="p-2 disabled:opacity-30"
              aria-label={`Increase ${product.name} quantity`}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={addSelectedQuantity}
            disabled={unavailable}
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-leaf px-2 text-[9px] font-bold text-leaf transition hover:bg-leaf hover:text-white disabled:cursor-not-allowed disabled:border-ink/10 disabled:text-ink/30 dark:border-sandal dark:text-sandal"
          >
            {added ? <Check className="h-3.5 w-3.5" /> : <ShoppingBag className="h-3.5 w-3.5" />}
            {added ? "Added" : "Add to cart"}
          </button>
          <button
            type="button"
            onClick={buyNow}
            disabled={unavailable}
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-leaf px-2 text-[9px] font-bold text-white transition hover:bg-[#173a2b] disabled:cursor-not-allowed disabled:bg-slate-400 dark:bg-sandal dark:text-ink"
          >
            <Zap className="h-3.5 w-3.5" />
            Buy now
          </button>
        </div>
        <a
          href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noreferrer"
          className="mt-2 flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 text-[9px] font-bold text-white transition hover:bg-[#1fb85a]"
          aria-label={`Ask about ${product.name} on WhatsApp`}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Ask on WhatsApp
        </a>
        <ProductLeadDialog product={product} quantity={quantity} compact />
      </div>
    </motion.article>
  );
}
