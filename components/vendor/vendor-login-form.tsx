"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";

export function VendorLoginForm({ switchSession = false }: { switchSession?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("vendor@southaura.in");
  const [password, setPassword] = useState("Vendor123!");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    if (switchSession) await signOut({ redirect: false });
    const result = await signIn("credentials", {
      email,
      password,
      portal: "vendor",
      redirect: false
    });
    setLoading(false);
    if (result?.error) return setError("The vendor email or password is incorrect.");
    router.push("/vendor");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-4">
      {switchSession && (
        <p className="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          Another account is active. Signing in will switch this browser to the vendor portal.
        </p>
      )}
      <label className="block">
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Business email</span>
        <div className="relative">
          <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-[#a67c38] focus:ring-4 focus:ring-amber-100" />
        </div>
      </label>
      <label className="block">
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Password</span>
        <div className="relative">
          <LockKeyhole className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          <input value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? "text" : "password"} required className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-12 text-sm outline-none focus:border-[#a67c38] focus:ring-4 focus:ring-amber-100" />
          <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-3.5 text-slate-400" aria-label="Show password">
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </label>
      {error && <p className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700">{error}</p>}
      <button disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#173c2c] text-sm font-bold text-white transition hover:bg-[#102c20] disabled:opacity-60">
        {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Open vendor workspace"}
        {!loading && <ArrowRight className="h-4 w-4" />}
      </button>
      <Link href="/vendor/register" className="flex h-12 w-full items-center justify-center rounded-xl border border-slate-200 text-sm font-bold text-slate-700 transition hover:border-[#a67c38]">
        Create a new shop
      </Link>
      <p className="rounded-xl bg-amber-50 p-3 text-[10px] leading-5 text-amber-900">
        Demo: vendor@southaura.in / Vendor123!
      </p>
    </form>
  );
}
