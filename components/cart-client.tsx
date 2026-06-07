"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Gift,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  X
} from "lucide-react";
import { useState } from "react";
import { useStore } from "@/components/store-provider";
import { formatCurrency } from "@/lib/utils";
import { ProductRow } from "@/components/product-row";
import { products } from "@/lib/data";

export function CartClient() {
  const {
    cart,
    cartCount,
    subtotal,
    couponCode,
    discount,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon
  } = useStore();
  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [deliveryChecked, setDeliveryChecked] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [orderNote, setOrderNote] = useState("");

  const shipping = subtotal >= 1499 || subtotal === 0 ? 0 : 99;
  const total = subtotal - discount + shipping;
  const amountToFreeShipping = Math.max(0, 1499 - subtotal);
  const shippingProgress = Math.min(100, (subtotal / 1499) * 100);
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919871877072";
  const whatsappMessage = encodeURIComponent(
    `Hello southAura, I would like help placing this order:\n${cart
      .map(
        ({ product, quantity }) =>
          `- ${product.name} x ${quantity} - ${formatCurrency(product.price * quantity)}`
      )
      .join("\n")}\nTotal: ${formatCurrency(total)}${couponCode ? `\nCoupon: ${couponCode}` : ""}`
  );

  if (!cart.length) {
    return (
      <div className="container-shell py-16 sm:py-24">
        <div className="surface mx-auto max-w-2xl overflow-hidden text-center">
          <div className="bg-aura-radial px-6 py-16">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-leaf text-white shadow-luxe">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <p className="eyebrow mt-8">Your edit awaits</p>
            <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
              Your bag is beautifully empty.
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-ink/55 dark:text-white/55">
              Begin with a small-batch flavour, an enduring textile, or a ritual
              worth bringing home.
            </p>
            <Link href="/shop" className="button-primary mt-8">
              Explore the collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const recommendations = products
    .filter(
      (product) => !cart.some((item) => item.product.id === product.id)
    )
    .slice(0, 4);

  return (
    <>
      <div className="container-shell py-8 sm:py-12">
        <div className="mb-8 rounded-[24px] border border-ink/10 bg-white/65 p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sandal/20 text-brass">
                <Truck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold">
                  {amountToFreeShipping > 0
                    ? `Add ${formatCurrency(amountToFreeShipping)} for complimentary delivery`
                    : "You have unlocked complimentary delivery"}
                </p>
                <p className="mt-1 text-[9px] text-ink/45 dark:text-white/45">
                  Available on eligible deliveries across India.
                </p>
              </div>
            </div>
            <span className="hidden text-[10px] font-bold text-brass sm:block">
              {Math.round(shippingProgress)}%
            </span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brass to-leaf transition-all duration-500"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_390px]">
          <section>
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="eyebrow">Your selection</p>
                <h1 className="mt-2 font-display text-4xl font-semibold">
                  Shopping bag
                </h1>
              </div>
              <p className="text-xs text-ink/45 dark:text-white/45">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </p>
            </div>

            <div className="divide-y divide-ink/10 border-y border-ink/10 dark:divide-white/10 dark:border-white/10">
              {cart.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="grid grid-cols-[100px_1fr] gap-4 py-6 sm:grid-cols-[140px_1fr]"
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="relative aspect-[4/5] overflow-hidden rounded-2xl"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="140px"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-col justify-between py-1">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-brass">
                        {product.origin}
                      </p>
                      <Link href={`/products/${product.slug}`}>
                        <h2 className="mt-1 font-display text-2xl font-semibold leading-none">
                          {product.name}
                        </h2>
                      </Link>
                      <p className="mt-2 text-xs text-ink/45 dark:text-white/45">
                        {product.weight} · {product.stock > 0 ? "In stock" : "Out of stock"}
                      </p>
                    </div>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center rounded-full border border-ink/15 dark:border-white/15">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(product.id, quantity - 1)
                          }
                          className="p-2.5"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(product.id, quantity + 1)
                          }
                          disabled={quantity >= product.stock}
                          className="p-2.5 disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="text-ink/35 hover:text-vermilion dark:text-white/35"
                          aria-label={`Remove ${product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <p className="text-sm font-bold">
                          {formatCurrency(product.price * quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-2xl bg-sandal/15 p-4 text-xs">
              <Sparkles className="h-4 w-4 shrink-0 text-brass" />
              Every order is wrapped in recyclable, gift-worthy packaging.
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="rounded-2xl border border-ink/10 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5">
                <span className="flex items-center gap-2 text-xs font-bold">
                  <Gift className="h-4 w-4 text-brass" />
                  Complimentary gift note
                </span>
                <textarea
                  value={giftMessage}
                  onChange={(event) => setGiftMessage(event.target.value)}
                  maxLength={180}
                  rows={3}
                  className="mt-3 w-full resize-none bg-transparent text-xs leading-5 outline-none placeholder:text-ink/35 dark:placeholder:text-white/30"
                  placeholder="Write a personal message for the recipient..."
                />
                <span className="block text-right text-[8px] text-ink/35 dark:text-white/35">
                  {giftMessage.length}/180
                </span>
              </label>
              <label className="rounded-2xl border border-ink/10 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5">
                <span className="text-xs font-bold">Order instructions</span>
                <textarea
                  value={orderNote}
                  onChange={(event) => setOrderNote(event.target.value)}
                  maxLength={240}
                  rows={3}
                  className="mt-3 w-full resize-none bg-transparent text-xs leading-5 outline-none placeholder:text-ink/35 dark:placeholder:text-white/30"
                  placeholder="Delivery preferences, allergies or packing notes..."
                />
                <span className="block text-right text-[8px] text-ink/35 dark:text-white/35">
                  {orderNote.length}/240
                </span>
              </label>
            </div>
          </section>

          <aside className="surface h-fit p-6 lg:sticky lg:top-40">
            <h2 className="font-display text-3xl font-semibold">
              Order summary
            </h2>

            <div className="border-b border-ink/10 py-5 dark:border-white/10">
              <label className="text-[10px] font-bold uppercase tracking-[0.12em]">
                Check delivery
              </label>
              <div className="mt-3 flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-brass" />
                  <input
                    value={pinCode}
                    onChange={(event) => {
                      setPinCode(
                        event.target.value.replace(/\D/g, "").slice(0, 6)
                      );
                      setDeliveryChecked(false);
                    }}
                    className="field pl-10"
                    inputMode="numeric"
                    placeholder="6-digit PIN"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setDeliveryChecked(pinCode.length === 6)}
                  className="button-secondary !px-4"
                >
                  Check
                </button>
              </div>
              {deliveryChecked && (
                <p className="mt-3 flex items-center gap-2 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                  <Check className="h-3.5 w-3.5" />
                  Delivery available in 2–4 business days.
                </p>
              )}
              {pinCode.length > 0 && pinCode.length < 6 && (
                <p className="mt-2 text-[9px] text-vermilion">
                  Enter a valid 6-digit PIN code.
                </p>
              )}
            </div>

            <div className="mt-5 space-y-3 border-b border-ink/10 pb-6 text-sm dark:border-white/10">
              <div className="flex justify-between">
                <span className="text-ink/55 dark:text-white/55">
                  Subtotal
                </span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                  <span>{couponCode} saving</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-ink/55 dark:text-white/55">
                  Shipping
                </span>
                <span>
                  {shipping ? formatCurrency(shipping) : "Complimentary"}
                </span>
              </div>
            </div>

            <div className="flex justify-between py-6">
              <span className="font-bold">Total</span>
              <span className="text-xl font-bold">{formatCurrency(total)}</span>
            </div>

            {couponCode ? (
              <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-3 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                <span className="flex items-center gap-2 text-[10px] font-bold">
                  <Check className="h-3.5 w-3.5" /> {couponCode} applied
                </span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  aria-label="Remove coupon"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    value={coupon}
                    onChange={(event) => {
                      setCoupon(event.target.value);
                      setCouponError("");
                    }}
                    className="field"
                    placeholder="Coupon code"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const applied = applyCoupon(coupon);
                      setCouponError(
                        applied ? "" : "That coupon is not valid."
                      );
                    }}
                    className="button-secondary !px-4"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="mt-2 text-[9px] font-semibold text-vermilion">
                    {couponError}
                  </p>
                )}
                <p className="mt-2 text-[9px] text-ink/40 dark:text-white/40">
                  Try <strong>AURA10</strong> for 10% off this demo order.
                </p>
              </>
            )}

            <Link href="/checkout" className="button-primary mt-5 w-full">
              Secure checkout <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-bold text-white transition hover:bg-[#1fb85a]"
            >
              <MessageCircle className="h-4 w-4" /> Order with WhatsApp
            </a>
            <Link
              href="/shop"
              className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold"
            >
              Continue shopping <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <div className="mt-5 grid grid-cols-2 gap-2 border-t border-ink/10 pt-5 dark:border-white/10">
              <div className="rounded-xl bg-mist/60 p-3 dark:bg-white/5">
                <ShieldCheck className="h-4 w-4 text-brass" />
                <p className="mt-2 text-[9px] font-bold">Secure payment</p>
              </div>
              <div className="rounded-xl bg-mist/60 p-3 dark:bg-white/5">
                <Truck className="h-4 w-4 text-brass" />
                <p className="mt-2 text-[9px] font-bold">Tracked delivery</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {recommendations.length > 0 && (
        <ProductRow
          eyebrow="Complete your order"
          title="Customers also add"
          products={recommendations}
        />
      )}
    </>
  );
}
