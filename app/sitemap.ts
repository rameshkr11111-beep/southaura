import type { MetadataRoute } from "next";
import { blogPosts, categories, products } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://southaura.in";
  const staticPages = [
    "",
    "/shop",
    "/categories",
    "/cart",
    "/checkout",
    "/wishlist",
    "/login",
    "/track-order",
    "/about",
    "/contact",
    "/faq",
    "/blog",
    "/privacy-policy",
    "/terms-conditions",
    "/return-refund-policy"
  ];
  return [
    ...staticPages.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
      priority: path === "" ? 1 : 0.7
    })),
    ...categories.map((category) => ({
      url: `${base}/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...products.map((product) => ({
      url: `${base}/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...blogPosts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6
    }))
  ];
}
