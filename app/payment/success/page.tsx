import Link from "next/link";
import { CheckCircle2, PackageCheck } from "lucide-react";

export default async function PaymentSuccessPage({ searchParams }: { searchParams: Promise<{ paymentId?: string }> }) {
  const { paymentId } = await searchParams;
  return (
    <main className="container-shell py-20">
      <div className="surface mx-auto max-w-xl p-8 text-center sm:p-12">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
        <p className="eyebrow mt-7">Payment confirmed</p>
        <h1 className="mt-3 font-display text-5xl font-semibold">Your order is confirmed.</h1>
        <p className="mt-4 text-sm leading-7 text-ink/55 dark:text-white/55">A confirmation will be sent by email and WhatsApp. Payment reference: <strong>{paymentId ?? "confirmed"}</strong>.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/track-order" className="button-primary"><PackageCheck className="h-4 w-4" /> Track order</Link><Link href="/shop" className="button-secondary">Continue shopping</Link></div>
      </div>
    </main>
  );
}
