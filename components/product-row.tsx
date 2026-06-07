import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";

export function ProductRow({
  eyebrow,
  title,
  copy,
  products
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  products: Product[];
}) {
  return (
    <section className="container-shell py-14 sm:py-20">
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="section-title mt-2">{title}</h2>
          {copy && (
            <p className="mt-3 max-w-xl text-sm leading-6 text-ink/60 dark:text-white/60">
              {copy}
            </p>
          )}
        </div>
        <Link
          href="/shop"
          className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] hover:text-brass sm:flex"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
