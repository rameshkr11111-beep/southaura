import { redirect } from "next/navigation";
import { BarChart3, Boxes, ShieldCheck, Sparkles } from "lucide-react";
import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { AdminLoginForm } from "@/components/admin/login-form";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user?.role === Role.CUSTOMER) redirect("/account");
  if (session?.user?.role === Role.VENDOR) redirect("/vendor");
  if (session?.user) redirect("/admin");

  return (
    <div className="grid min-h-screen bg-[#f5f6f4] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-[#0d1713] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-[#d8b66c]/20" />
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full border border-[#d8b66c]/15" />
        <div className="relative z-10">
          <span className="font-display text-3xl font-semibold">
            Dakshin<span className="text-[#d8b66c]">Kart</span>
          </span>
          <span className="ml-3 rounded-full border border-white/15 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-white/50">
            Commerce OS
          </span>
        </div>
        <div className="relative z-10 max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d8b66c]">
            One operating system. Every team.
          </p>
          <h1 className="mt-5 font-display text-6xl font-semibold leading-[0.92]">
            Run commerce with complete clarity.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/55">
            Products, customers, content, fulfilment, finance and growth,
            connected in one secure command center.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-3">
            {[
              [BarChart3, "Live intelligence"],
              [Boxes, "Connected operations"],
              [ShieldCheck, "Enterprise controls"],
              [Sparkles, "AI-assisted workflows"]
            ].map(([Icon, label]) => {
              const FeatureIcon = Icon as typeof BarChart3;
              return (
                <div key={String(label)} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] p-4 text-xs font-semibold">
                  <FeatureIcon className="h-4 w-4 text-[#d8b66c]" />
                  {String(label)}
                </div>
              );
            })}
          </div>
        </div>
        <p className="relative z-10 text-[10px] text-white/30">
          Protected by role-based access, audit logs and two-factor readiness.
        </p>
      </section>
      <section className="flex items-center justify-center p-5 sm:p-10">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/40 sm:p-10">
          <div className="lg:hidden">
            <span className="font-display text-3xl font-semibold text-[#132019]">
              Dakshin<span className="text-[#a67c38]">Kart</span>
            </span>
          </div>
          <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a67c38] lg:mt-0">
            Secure admin access
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-none text-slate-900">
            Welcome back.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Sign in to manage the entire DakshinKart business.
          </p>
          <AdminLoginForm />
        </div>
      </section>
    </div>
  );
}
