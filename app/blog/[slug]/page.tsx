import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/data";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) notFound();
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: [post.image],
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "southAura" },
    publisher: {
      "@type": "Organization",
      name: "southAura",
      url: "https://southaura.in"
    },
    mainEntityOfPage: `https://southaura.in/blog/${post.slug}`
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <article className="container-shell py-12 sm:py-20">
      <header className="mx-auto max-w-4xl text-center">
        <p className="eyebrow">{post.category} · {post.date}</p>
        <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.95] sm:text-7xl">
          {post.title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-ink/60 dark:text-white/60">
          {post.excerpt}
        </p>
      </header>
      <div className="relative mx-auto mt-10 aspect-[16/8] max-w-6xl overflow-hidden rounded-[30px]">
        <Image src={post.image} alt={post.title} fill priority className="object-cover" sizes="100vw" />
      </div>
      <div className="mx-auto mt-12 max-w-2xl space-y-6 text-[15px] leading-8 text-ink/70 dark:text-white/70">
        <p>
          Some traditions survive because they are useful. Others endure because
          they make an ordinary moment feel complete. Across South India, the two
          are often beautifully inseparable.
        </p>
        <h2 className="pt-4 font-display text-3xl font-semibold text-ink dark:text-white">
          Quality begins close to the source
        </h2>
        <p>
          The best results rarely come from complicated technique. They come from
          careful ingredients, patient hands and knowledge passed on through
          repetition. That is why provenance sits at the centre of every
          southAura collection.
        </p>
        <p>
          We speak with growers and makers about timing, storage, materials and
          the tiny decisions that shape the finished experience. This is the work
          behind an object or flavour that feels quietly exceptional.
        </p>
        <blockquote className="my-10 border-l-2 border-brass pl-6 font-display text-3xl font-medium leading-tight text-ink dark:text-white">
          The most memorable luxuries are often rituals we can return to every day.
        </blockquote>
        <p>
          This journal is an invitation to look closer: at the people, landscapes
          and habits behind what we bring home.
        </p>
      </div>
      </article>
    </>
  );
}
