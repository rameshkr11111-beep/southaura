import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default async function PaymentFailurePage({ searchParams }: { searchParams: Promise<{ reason?: string }> }) {
  const { reason } = await searchParams;
  return (
    <main className="container-shell py-20">
      <div className="surface mx-auto max-w-xl p-8 text-center sm:p-12">
        <AlertCircle className="mx-auto h-14 w-14 text-rose-600" />
        <p className="eyebrow mt-7">Payment not completed</p>
        <h1 className="mt-3 font-display text-5xl font-semibold">Your cart is still safe.</h1>
        <p className="mt-4 text-sm leading-7 text-ink/55 dark:text-white/55">{reason ?? "The payment could not be completed. No confirmed charge was recorded."}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/checkout" className="button-primary">Try payment again</Link><Link href="/cart" className="button-secondary">Return to cart</Link></div>
      </div>
    </main>
  );
}
