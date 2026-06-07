import Link from "next/link";
import { VendorRegisterForm } from "@/components/vendor/vendor-register-form";

export default function VendorRegisterPage() {
  return (
    <main className="min-h-screen bg-[#f5f6f4] px-4 py-10 text-slate-900 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="font-display text-3xl font-semibold">south<span className="text-[#a67c38]">Aura</span></Link>
        <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a67c38]">Vendor application</p>
        <h1 className="mt-3 font-display text-5xl font-semibold">Create your shop.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">Apply to sell authentic South Indian products. Your shop and catalogue remain private until marketplace review is complete.</p>
        <div className="mt-10"><VendorRegisterForm /></div>
        <p className="mt-8 text-center text-xs text-slate-500">Already applied? <Link href="/vendor/login" className="font-bold text-[#76531f]">Vendor login</Link></p>
      </div>
    </main>
  );
}
