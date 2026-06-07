"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Phone,
  UserRound
} from "lucide-react";

type Mode = "SIGN_IN" | "SIGN_UP" | "RESET";

export function CustomerAuthForm({
  switchingFromAdmin = false
}: {
  switchingFromAdmin?: boolean;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("SIGN_IN");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");

    if (mode === "RESET") {
      const response = await fetch("/api/customer/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const result = await response.json();
      setLoading(false);
      if (!response.ok) return setError(result.error ?? "Unable to process request.");
      setNotice(result.message);
      return;
    }

    const password = String(form.get("password") ?? "");
    if (mode === "SIGN_UP") {
      const response = await fetch("/api/customer/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.get("firstName"),
          lastName: form.get("lastName"),
          email,
          phone: form.get("phone") || undefined,
          password,
          marketingOptIn: form.get("marketingOptIn") === "on"
        })
      });
      const result = await response.json();
      if (!response.ok) {
        setLoading(false);
        const fieldErrors = result.error?.fieldErrors;
        return setError(
          result.error?.formErrors?.[0] ??
          Object.values(fieldErrors ?? {}).flat()[0] ??
          result.error ??
          "Unable to create account."
        );
      }
    }

    if (switchingFromAdmin) {
      await signOut({ redirect: false });
    }

    const result = await signIn("credentials", {
      email,
      password,
      portal: "customer",
      redirect: false
    });
    setLoading(false);
    if (result?.error) return setError("The email or password is incorrect.");
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="p-8 sm:p-12">
      <p className="eyebrow">{mode === "SIGN_UP" ? "Create account" : mode === "RESET" ? "Account recovery" : "Sign in"}</p>
      <h2 className="mt-3 font-display text-4xl font-semibold">
        {mode === "SIGN_UP" ? "Join southAura" : mode === "RESET" ? "Reset your password" : "Your account"}
      </h2>
      <p className="mt-2 text-xs leading-5 text-ink/50 dark:text-white/50">
        {mode === "SIGN_UP" ? "Create an account using your email address." : mode === "RESET" ? "We will send instructions if this email has an account." : "Use the email address registered with your orders."}
      </p>
      {switchingFromAdmin && mode !== "RESET" && (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          An admin session is active. Signing in here will switch this browser to the customer account.
        </p>
      )}

      <form onSubmit={submit} className="mt-7 space-y-4">
        {mode === "SIGN_UP" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <AuthInput icon={UserRound} name="firstName" placeholder="First name" required />
            <AuthInput icon={UserRound} name="lastName" placeholder="Last name" />
          </div>
        )}
        <AuthInput icon={Mail} name="email" type="email" placeholder="Email address" required defaultValue={mode === "SIGN_IN" ? "meera@example.com" : undefined} />
        {mode === "SIGN_UP" && <AuthInput icon={Phone} name="phone" type="tel" placeholder="Mobile number" />}
        {mode !== "RESET" && (
          <div className="relative">
            <LockKeyhole className="absolute left-4 top-4 h-4 w-4 text-ink/35 dark:text-white/35" />
            <input name="password" required minLength={8} defaultValue={mode === "SIGN_IN" ? "Welcome123!" : undefined} className="field pl-11 pr-12" type={showPassword ? "text" : "password"} placeholder="Password" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-3.5 text-ink/40 dark:text-white/40" aria-label="Show password">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        )}
        {mode === "SIGN_IN" && (
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2"><input type="checkbox" className="accent-leaf" defaultChecked /> Remember me</label>
            <button type="button" onClick={() => setMode("RESET")} className="font-bold underline">Forgot password?</button>
          </div>
        )}
        {mode === "SIGN_UP" && (
          <>
            <p className="text-[9px] leading-4 text-ink/45 dark:text-white/45">Use 8+ characters with uppercase, lowercase and a number.</p>
            <label className="flex items-start gap-2 text-[10px] leading-5 text-ink/55 dark:text-white/55"><input name="marketingOptIn" type="checkbox" className="mt-1 accent-leaf" /> Send me private offers and new collection updates.</label>
          </>
        )}
        {error && <p className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700">{String(error)}</p>}
        {notice && <p className="flex gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4 shrink-0" /> {notice}</p>}
        <button disabled={loading} className="button-primary w-full">
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : mode === "SIGN_UP" ? "Create account" : mode === "RESET" ? "Send reset instructions" : "Sign in"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>

      <div className="my-7 flex items-center gap-3"><span className="h-px flex-1 bg-ink/10 dark:bg-white/10" /><span className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/35 dark:text-white/35">{mode === "SIGN_IN" ? "New here" : "Already registered"}</span><span className="h-px flex-1 bg-ink/10 dark:bg-white/10" /></div>
      <button type="button" onClick={() => { setMode(mode === "SIGN_IN" ? "SIGN_UP" : "SIGN_IN"); setError(""); setNotice(""); }} className="button-secondary w-full">
        {mode === "SIGN_IN" ? "Create an account" : "Return to sign in"}
      </button>
      <p className="mt-5 text-center text-[10px] leading-5 text-ink/40 dark:text-white/40">
        By continuing, you agree to our <Link href="/terms-conditions" className="underline">terms</Link> and <Link href="/privacy-policy" className="underline">privacy policy</Link>.
      </p>
    </div>
  );
}

function AuthInput({ icon: Icon, ...props }: { icon: typeof Mail; name: string; type?: string; placeholder: string; required?: boolean; defaultValue?: string }) {
  return <div className="relative"><Icon className="absolute left-4 top-4 h-4 w-4 text-ink/35 dark:text-white/35" /><input {...props} className="field pl-11" /></div>;
}
