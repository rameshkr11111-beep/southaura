import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/data";
import { ProductDetailClient } from "@/components/product-detail-client";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | southAura`,
      description: product.description,
      images: [{ url: product.image, alt: product.name }],
      type: "website"
    }
  };
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = products
    .filter((item) => item.id !== product.id)
    .sort((a, b) =>
      a.category === product.category ? -1 : b.category === product.category ? 1 : 0
    )
    .slice(0, 4);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [product.image],
    description: product.description,
    sku: `SA-${product.id.toString().padStart(4, "0")}`,
    brand: { "@type": "Brand", name: "southAura" },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `https://southaura.in/products/${product.slug}`
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ProductDetailClient product={product} related={related} />
    </>
  );
}
