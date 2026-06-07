import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-shell py-16 sm:py-24">
      <div className="surface relative mx-auto max-w-3xl overflow-hidden px-6 py-20 text-center">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full border border-brass/20" />
        <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full border border-leaf/20" />
        <p className="font-display text-8xl font-semibold text-sandal">404</p>
        <p className="eyebrow mt-4">This path wandered</p>
        <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
          Nothing is waiting here.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-ink/55 dark:text-white/55">
          The page may have moved, or perhaps this is your sign to discover
          something new.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="button-primary">
            <ArrowLeft className="h-4 w-4" /> Return home
          </Link>
          <Link href="/shop" className="button-secondary">
            <Search className="h-4 w-4" /> Browse the collection
          </Link>
        </div>
      </div>
    </div>
  );
}
