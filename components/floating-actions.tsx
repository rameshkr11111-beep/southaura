"use client";

import Link from "next/link";
import { Heart, Home, Search, ShoppingBag, User } from "lucide-react";
import { useStore } from "@/components/store-provider";
import { CustomerAssistantWidget } from "@/components/customer-assistant-widget";

export function FloatingActions() {
  const { cartCount } = useStore();

  return (
    <>
      <CustomerAssistantWidget />
      <Link
        href="/cart"
        className="fixed bottom-8 right-5 z-40 hidden rounded-full bg-vermilion p-4 text-white shadow-luxe transition hover:-translate-y-1 lg:block"
        aria-label="Open cart"
      >
        <ShoppingBag className="h-5 w-5" />
        {cartCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-cream bg-ink px-1 text-[9px]">
            {cartCount}
          </span>
        )}
      </Link>
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-cream/95 px-4 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden dark:border-white/10 dark:bg-[#101713]/95">
        <div className="mx-auto flex max-w-md items-center justify-between">
          {[
            [Home, "Home", "/"],
            [Search, "Shop", "/shop"],
            [Heart, "Saved", "/wishlist"],
            [User, "Account", "/account"]
          ].map(([Icon, label, href]) => {
            const ItemIcon = Icon as typeof Home;
            return (
              <Link
                key={String(href)}
                href={String(href)}
                className="flex w-16 flex-col items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-ink/60 dark:text-white/60"
              >
                <ItemIcon className="h-5 w-5" />
                {String(label)}
              </Link>
            );
          })}
          <Link
            href="/cart"
            className="relative flex w-16 flex-col items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-ink/60 dark:text-white/60"
          >
            <ShoppingBag className="h-5 w-5" />
            Cart
            {cartCount > 0 && (
              <span className="absolute right-2 top-[-5px] rounded-full bg-vermilion px-1.5 py-0.5 text-[8px] text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </>
  );
}
