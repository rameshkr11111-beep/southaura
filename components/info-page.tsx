import { PageHero } from "@/components/page-hero";

export type InfoSection = {
  title: string;
  content: string | string[];
};

export function InfoPage({
  title,
  eyebrow,
  description,
  updated,
  sections
}: {
  title: string;
  eyebrow: string;
  description: string;
  updated?: string;
  sections: InfoSection[];
}) {
  return (
    <>
      <PageHero
        title={title}
        eyebrow={eyebrow}
        description={description}
        crumbs={[{ label: title }]}
      />
      <main className="container-shell py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          {updated && (
            <p className="mb-10 text-xs font-semibold uppercase tracking-[0.14em] text-ink/40 dark:text-white/40">
              Last updated: {updated}
            </p>
          )}
          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-3xl font-semibold">
                  {section.title}
                </h2>
                {Array.isArray(section.content) ? (
                  <ul className="mt-4 space-y-3">
                    {section.content.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-sm leading-7 text-ink/65 dark:text-white/65"
                      >
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm leading-7 text-ink/65 dark:text-white/65">
                    {section.content}
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
