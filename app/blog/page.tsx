import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/lib/data";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "The southAura Journal",
  description: "Stories about South Indian food, craft, makers, travel and meaningful everyday rituals."
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="The journal"
        title="Stories of taste, craft and place."
        description="A field guide to the makers, ingredients, homes and rituals that give the South its unmistakable character."
        crumbs={[{ label: "Journal" }]}
      />
      <div className="container-shell py-12 sm:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...blogPosts, ...blogPosts].map((post, index) => (
            <article key={`${post.slug}-${index}`} className={index === 0 ? "md:col-span-2" : ""}>
              <Link
                href={`/blog/${post.slug}`}
                className={`group relative block overflow-hidden rounded-[26px] ${
                  index === 0 ? "aspect-[16/9]" : "aspect-[5/4]"
                }`}
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Link>
              <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.15em] text-brass">
                {post.category} · {post.date}
              </p>
              <h2 className={`mt-2 font-display font-semibold leading-tight ${index === 0 ? "text-4xl" : "text-3xl"}`}>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink/55 dark:text-white/55">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="mt-4 inline-flex items-center gap-2 text-xs font-bold">
                Read story <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
