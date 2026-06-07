"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, CreditCard, Landmark, LockKeyhole, Truck } from "lucide-react";
import { useStore } from "@/components/store-provider";
import { formatCurrency } from "@/lib/utils";
import { trackCommerceEvent } from "@/components/analytics-tracker";

export function CheckoutClient() {
  const router = useRouter();
  const { cart, subtotal, discount, couponCode, clearCart } = useStore();
  const [payment, setPayment] = useState("card");
  const [complete, setComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const shipping = subtotal >= 1499 ? 0 : 99;
  const total = subtotal - discount + shipping;

  useEffect(() => {
    if (cart.length) {
      trackCommerceEvent("begin_checkout", {
        value: total,
        metadata: { items: cart.length, couponCode }
      });
    }
  }, [cart.length, couponCode, total]);

  async function loadRazorpay() {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) return true;
    return new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function submitCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPaymentError("");
    const form = new FormData(event.currentTarget);

    if (payment === "cod") {
      trackCommerceEvent("purchase", {
        value: total,
        metadata: { payment: "cod", itemCount: cart.length, couponCode }
      });
      clearCart();
      setComplete(true);
      return;
    }

    setProcessing(true);
    const loaded = await loadRazorpay();
    if (!loaded) {
      setProcessing(false);
      setPaymentError("Unable to load the secure Razorpay checkout.");
      return;
    }

    const orderResponse = await fetch("/api/payments/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: total,
        currency: "INR",
        receipt: `SA-${Date.now().toString().slice(-10)}`,
        customerEmail: form.get("email"),
        notes: { cartItems: String(cart.length), couponCode: couponCode || "none" }
      })
    });
    const order = await orderResponse.json();
    if (!orderResponse.ok) {
      setProcessing(false);
      setPaymentError(order.error ?? "Unable to start payment.");
      return;
    }

    const checkout = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: "southAura",
      description: `${cart.length} item order`,
      order_id: order.orderId,
      prefill: {
        name: `${form.get("firstName")} ${form.get("lastName")}`,
        email: form.get("email"),
        contact: form.get("phone")
      },
      theme: { color: "#173c2c" },
      handler: async (response) => {
        const verifyResponse = await fetch("/api/payments/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...response,
            email: form.get("email"),
            phone: form.get("phone")
          })
        });
        const verification = await verifyResponse.json();
        if (!verifyResponse.ok) {
          router.push(`/payment/failure?reason=${encodeURIComponent(verification.error ?? "Verification failed")}`);
          return;
        }
        trackCommerceEvent("purchase", {
          value: total,
          metadata: { payment, paymentId: verification.paymentId, itemCount: cart.length, couponCode }
        });
        clearCart();
        router.push(`/payment/success?paymentId=${encodeURIComponent(verification.paymentId)}`);
      },
      modal: {
        ondismiss: () => {
          setProcessing(false);
          setPaymentError("Payment was cancelled. Your cart is still saved.");
        }
      }
    });
    checkout.on("payment.failed", (response) => {
      router.push(`/payment/failure?reason=${encodeURIComponent(response.error.description ?? "Payment failed")}`);
    });
    checkout.open();
    setProcessing(false);
  }

  if (complete) {
    return (
      <div className="container-shell py-20">
        <div className="surface mx-auto max-w-xl p-8 text-center sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-leaf text-white">
            <Check className="h-7 w-7" />
          </div>
          <p className="eyebrow mt-7">Order SA260605 confirmed</p>
          <h1 className="mt-3 font-display text-4xl font-semibold">
            Thank you. It&apos;s on its way to becoming yours.
          </h1>
          <p className="mt-4 text-sm leading-7 text-ink/55 dark:text-white/55">
            This is a demo checkout. In production, your confirmation and
            tracking details will arrive by email and WhatsApp.
          </p>
          <Link href="/track-order" className="button-primary mt-8">
            Track this order
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-shell py-8 sm:py-12">
      <Link href="/cart" className="mb-8 inline-flex items-center gap-2 text-xs font-bold">
        <ChevronLeft className="h-4 w-4" /> Back to bag
      </Link>
      <div className="grid gap-10 lg:grid-cols-[1fr_390px]">
        <form
          onSubmit={submitCheckout}
          className="space-y-8"
        >
          <div>
            <p className="eyebrow">Secure checkout</p>
            <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
              Delivery details
            </h1>
          </div>
          <section className="surface p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold">Contact</h2>
              <Link href="/login" className="text-xs font-bold underline">
                Sign in
              </Link>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <input name="email" required className="field sm:col-span-2" type="email" placeholder="Email address" />
              <input name="firstName" required className="field" placeholder="First name" />
              <input name="lastName" required className="field" placeholder="Last name" />
              <input name="phone" required className="field sm:col-span-2" type="tel" placeholder="Mobile / WhatsApp number" />
            </div>
          </section>
          <section className="surface p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold">Shipping address</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <select className="field sm:col-span-2" defaultValue="India">
                <option>India</option>
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>United Arab Emirates</option>
              </select>
              <input required className="field sm:col-span-2" placeholder="Address" />
              <input className="field sm:col-span-2" placeholder="Apartment, suite, etc. (optional)" />
              <input required className="field" placeholder="City" />
              <input required className="field" placeholder="State" />
              <input required className="field" placeholder="PIN code" />
              <input className="field" placeholder="Landmark (optional)" />
            </div>
          </section>
          <section className="surface p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold">Payment</h2>
            <p className="mt-1 text-xs text-ink/45 dark:text-white/45">
              All transactions are encrypted and secure.
            </p>
            <div className="mt-5 space-y-3">
              {[
                ["card", CreditCard, "Credit / debit card", "Visa, Mastercard, Amex"],
                ["upi", Landmark, "UPI", "Google Pay, PhonePe, Paytm"],
                ["cod", Truck, "Cash on delivery", "Available for eligible Indian PIN codes"]
              ].map(([value, Icon, title, copy]) => {
                const PaymentIcon = Icon as typeof CreditCard;
                return (
                  <label
                    key={String(value)}
                    className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${
                      payment === value
                        ? "border-brass bg-sandal/10"
                        : "border-ink/10 dark:border-white/10"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={payment === value}
                      onChange={() => setPayment(String(value))}
                      className="accent-leaf"
                    />
                    <PaymentIcon className="h-5 w-5 text-brass" />
                    <span>
                      <span className="block text-sm font-bold">{String(title)}</span>
                      <span className="text-[10px] text-ink/45 dark:text-white/45">
                        {String(copy)}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
            {payment === "card" && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <input required className="field sm:col-span-2" placeholder="Card number" />
                <input required className="field" placeholder="MM / YY" />
                <input required className="field" placeholder="CVV" />
                <input required className="field sm:col-span-2" placeholder="Name on card" />
              </div>
            )}
          </section>
          {paymentError && <p className="rounded-2xl bg-rose-50 p-4 text-xs font-semibold text-rose-700">{paymentError}</p>}
          <button
            type="submit"
            disabled={!cart.length || processing}
            className="button-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LockKeyhole className="h-4 w-4" /> {processing ? "Opening secure payment..." : payment === "cod" ? `Place COD order · ${formatCurrency(total)}` : `Pay ${formatCurrency(total)}`}
          </button>
        </form>
        <aside className="surface h-fit p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-3xl font-semibold">Your order</h2>
          <div className="mt-5 space-y-4">
            {cart.length ? (
              cart.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between gap-4 text-xs">
                  <span className="text-ink/60 dark:text-white/60">
                    {product.name} × {quantity}
                  </span>
                  <span className="font-bold">
                    {formatCurrency(product.price * quantity)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-ink/50 dark:text-white/50">
                Your bag is empty. Add a product before checkout.
              </p>
            )}
          </div>
          <div className="mt-6 space-y-3 border-t border-ink/10 pt-5 text-sm dark:border-white/10">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                <span>{couponCode} saving</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping ? formatCurrency(shipping) : "Complimentary"}</span>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-4 text-base font-bold dark:border-white/10">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
