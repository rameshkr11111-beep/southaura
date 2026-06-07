import Link from "next/link";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" className="group inline-flex flex-col leading-none">
      <span
        className={`font-display text-[30px] font-semibold tracking-[-0.04em] ${
          inverse ? "text-white" : "text-ink dark:text-white"
        }`}
      >
        south<span className="text-brass">Aura</span>
      </span>
      <span
        className={`mt-1 text-[7px] font-bold uppercase tracking-[0.27em] ${
          inverse ? "text-white/55" : "text-ink/45 dark:text-white/45"
        }`}
      >
        Authentic South India, Delivered Everywhere
      </span>
    </Link>
  );
}
