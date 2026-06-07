import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { auth } from "@/auth";
import { CustomerAuthForm } from "@/components/customer-auth-form";

export const metadata: Metadata = {
  title: "Customer Sign In or Create an Account",
  description: "Access your southAura orders, wishlist and personal details using your email."
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user?.role === Role.CUSTOMER) redirect("/account");
  const switchingFromAdmin = Boolean(session?.user);

  return (
    <div className="container-shell py-12 sm:py-20">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[30px] bg-white shadow-luxe dark:bg-white/5 lg:grid-cols-2">
        <div className="relative overflow-hidden bg-leaf p-8 text-white sm:p-12">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-sandal/20" />
          <div className="relative z-10">
            <p className="eyebrow !text-sandal">Your southAura</p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-none">Welcome back to the beautiful things.</h1>
            <p className="mt-6 text-sm leading-7 text-white/65">Save favourites, follow every delivery, revisit your orders and receive private access to limited batches.</p>
            <div className="mt-10 space-y-4 text-xs text-white/70">
              {["Early access to limited editions", "Faster, remembered checkout", "Order history and easy tracking", "Loyalty points in one place"].map((item) => <p key={item} className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-sandal" />{item}</p>)}
            </div>
            <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-sandal">Demo customer access</p>
              <p className="mt-2 text-xs">meera@example.com</p>
              <p className="mt-1 text-xs">Welcome123!</p>
            </div>
          </div>
        </div>
        <CustomerAuthForm switchingFromAdmin={switchingFromAdmin} />
      </div>
    </div>
  );
}
