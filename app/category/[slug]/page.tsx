import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, PackageCheck, Star } from "lucide-react";
import { categories, getCategory } from "@/lib/data";
import { products } from "@/lib/data";
import { ShopClient } from "@/components/shop-client";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: `${category.description} Shop premium ${category.name.toLowerCase()} online at southAura.`
  };
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const categoryProducts = products.filter((product) => product.category === slug);
  const averageRating = categoryProducts.length
    ? categoryProducts.reduce((sum, product) => sum + product.rating, 0) /
      categoryProducts.length
    : 0;

  return (
    <>
      <section className="container-shell pt-5 sm:pt-8">
        <div className="relative min-h-[440px] overflow-hidden rounded-[30px] bg-ink text-white">
          <Image src={category.image} alt={category.name} fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/10" />
          <div className="relative z-10 flex min-h-[440px] max-w-3xl flex-col justify-center p-7 sm:p-12 lg:p-14">
            <Link href="/categories" className="mb-7 inline-flex w-fit items-center gap-2 text-[9px] font-bold uppercase tracking-[0.14em] text-white/55 hover:text-sandal"><ArrowLeft className="h-3.5 w-3.5" /> All collections</Link>
            <p className="eyebrow !text-sandal">The southAura collection</p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.92] sm:text-7xl">{category.name}</h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/65">{category.description}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[9px] font-bold backdrop-blur"><PackageCheck className="h-3.5 w-3.5 text-sandal" /> {categoryProducts.length} curated products</span>
              <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[9px] font-bold backdrop-blur"><Star className="h-3.5 w-3.5 fill-sandal text-sandal" /> {averageRating.toFixed(1)} average rating</span>
              <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[9px] font-bold backdrop-blur"><BadgeCheck className="h-3.5 w-3.5 text-sandal" /> Origin verified</span>
            </div>
          </div>
        </div>
      </section>
      <Suspense>
        <ShopClient categorySlug={category.slug} />
      </Suspense>
    </>
  );
}
