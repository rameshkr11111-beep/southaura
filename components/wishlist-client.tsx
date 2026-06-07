"use client";

import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useStore } from "@/components/store-provider";
import { ProductCard } from "@/components/product-card";

export function WishlistClient() {
  const { wishlist } = useStore();

  return (
    <div className="container-shell py-12 sm:py-16">
      {wishlist.length ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="surface mx-auto max-w-2xl px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sandal/25 text-brass">
            <Heart className="h-7 w-7" />
          </div>
          <h2 className="mt-6 font-display text-4xl font-semibold">
            A place for future favourites.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-ink/55 dark:text-white/55">
            Save anything that catches your eye and return when the moment feels
            right.
          </p>
          <Link href="/shop" className="button-primary mt-7">
            Start exploring <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
