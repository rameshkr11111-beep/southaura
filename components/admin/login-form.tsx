"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@southaura.in");
  const [password, setPassword] = useState("ChangeMe123!");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      portal: "admin",
      redirect: false
    });
    setLoading(false);
    if (result?.error) {
      setError("The email or password is incorrect.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-4">
      <label className="block">
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
          Work email
        </span>
        <div className="relative">
          <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            required
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#a67c38] focus:ring-4 focus:ring-amber-100"
          />
        </div>
      </label>
      <label className="block">
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
          Password
        </span>
        <div className="relative">
          <LockKeyhole className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type={showPassword ? "text" : "password"}
            required
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm outline-none transition focus:border-[#a67c38] focus:ring-4 focus:ring-amber-100"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3.5 text-slate-400"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </label>
      <div className="flex items-center justify-between text-[11px]">
        <label className="flex items-center gap-2 text-slate-500">
          <input type="checkbox" className="accent-[#173c2c]" defaultChecked /> Keep me signed in
        </label>
        <button type="button" className="font-bold text-[#76531f]">
          Forgot password?
        </button>
      </div>
      {error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
          {error}
        </p>
      )}
      <button
        disabled={loading}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#173c2c] text-sm font-bold text-white transition hover:bg-[#102c20] disabled:opacity-60"
      >
        {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Enter command center"}
        {!loading && <ArrowRight className="h-4 w-4" />}
      </button>
      <p className="rounded-xl bg-amber-50 p-3 text-[10px] leading-5 text-amber-900">
        Demo access is pre-filled. Configure PostgreSQL and run the seed command
        to use database-backed team accounts.
      </p>
    </form>
  );
}
