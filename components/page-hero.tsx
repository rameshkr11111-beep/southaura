import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export function PageHero({
  eyebrow = "southAura",
  title,
  description,
  crumbs
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: Array<{ label: string; href?: string }>;
}) {
  return (
    <section className="relative overflow-hidden border-b border-ink/10 bg-aura-radial py-14 sm:py-20 dark:border-white/10">
      <div className="container-shell relative z-10">
        {crumbs && (
          <nav
            aria-label="Breadcrumb"
            className="mb-7 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-ink/45 dark:text-white/45"
          >
            <Link href="/" aria-label="Home">
              <Home className="h-3.5 w-3.5" />
            </Link>
            {crumbs.map((crumb) => (
              <span key={crumb.label} className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-brass">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-ink dark:text-white">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display-title mt-3 max-w-4xl">{title}</h1>
        {description && (
          <p className="mt-5 max-w-2xl text-sm leading-7 text-ink/60 sm:text-base dark:text-white/60">
            {description}
          </p>
        )}
      </div>
      <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border border-brass/25" />
      <div className="absolute -right-6 -top-10 h-52 w-52 rounded-full border border-brass/20" />
    </section>
  );
}
