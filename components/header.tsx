"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  Heart,
  Home,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  Sun,
  User,
  X
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { categories } from "@/lib/data";
import { Logo } from "@/components/logo";
import { useStore } from "@/components/store-provider";

const links = [
  { label: "Home", href: "/" },
  { label: "New in", href: "/shop?sort=newest" },
  { label: "Bestsellers", href: "/shop?sort=popular" },
  { label: "Ayurveda", href: "/category/ayurvedic-products" },
  { label: "Gifts", href: "/shop?tag=gift" },
  { label: "Our story", href: "/about" },
  { label: "Journal", href: "/blog" },
  { label: "Vendor Login", href: "/vendor/login" }
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount, wishlist } = useStore();

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const isDark =
      localStorage.getItem("southaura-theme") === "dark" ||
      (!localStorage.getItem("southaura-theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("southaura-theme", next ? "dark" : "light");
  };

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <>
      <div className="bg-leaf px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-white">
        Complimentary delivery in India above ₹1,499 · Worldwide shipping
      </div>
      <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#101713]/90">
        <div className="container-shell flex h-[78px] items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="rounded-full p-2 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Logo />

          <nav className="hidden items-center gap-6 lg:flex">
            <Link
              href="/"
              className="text-xs font-bold uppercase tracking-[0.12em] transition hover:text-brass"
            >
              Home
            </Link>
            <div className="group relative">
              <Link
                href="/categories"
                className="flex items-center gap-1 py-7 text-xs font-bold uppercase tracking-[0.12em] hover:text-brass"
              >
                Shop <ChevronDown className="h-3.5 w-3.5" />
              </Link>
              <div className="invisible absolute left-1/2 top-full w-[760px] -translate-x-1/2 translate-y-2 rounded-3xl border border-ink/10 bg-cream p-6 opacity-0 shadow-luxe transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 dark:border-white/10 dark:bg-[#152019]">
                <div className="grid grid-cols-2 gap-x-10 gap-y-3">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      className="flex items-center justify-between border-b border-ink/5 py-2.5 text-sm hover:text-brass dark:border-white/5"
                    >
                      {category.name}
                      <span className="text-xs text-ink/35 dark:text-white/35">
                        View
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {links.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-bold uppercase tracking-[0.12em] transition hover:text-brass"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              className="hidden rounded-full p-2.5 transition hover:bg-ink/5 sm:block dark:hover:bg-white/10"
              aria-label="Toggle dark mode"
            >
              {dark ? (
                <Sun className="h-[18px] w-[18px]" />
              ) : (
                <Moon className="h-[18px] w-[18px]" />
              )}
            </button>
            <Link
              href="/login"
              className="hidden rounded-full p-2.5 transition hover:bg-ink/5 sm:block dark:hover:bg-white/10"
              aria-label="Customer account"
            >
              <User className="h-[18px] w-[18px]" />
            </Link>
            <Link
              href="/wishlist"
              className="relative hidden rounded-full p-2.5 transition hover:bg-ink/5 sm:block dark:hover:bg-white/10"
              aria-label="Wishlist"
            >
              <Heart className="h-[18px] w-[18px]" />
              {wishlist.length > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-vermilion px-1 text-[9px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="relative rounded-full p-2.5 transition hover:bg-ink/5 dark:hover:bg-white/10"
              aria-label="Cart"
            >
              <ShoppingBag className="h-[19px] w-[19px]" />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-vermilion px-1 text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
        <div className="border-t border-ink/10 dark:border-white/10">
          <div className="container-shell py-3">
            <form
              onSubmit={submitSearch}
              className="group mx-auto flex h-12 max-w-5xl items-center gap-3 rounded-2xl border border-ink/10 bg-white/70 px-4 shadow-sm transition focus-within:border-brass focus-within:ring-4 focus-within:ring-sandal/15 dark:border-white/10 dark:bg-white/5"
              role="search"
            >
              <Search className="h-[18px] w-[18px] shrink-0 text-brass" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink/40 dark:placeholder:text-white/35"
                placeholder="Search South Indian groceries, coffee, sweets, sarees and more..."
                aria-label="Search products"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-full p-1 text-ink/40 transition hover:bg-ink/5 hover:text-ink dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="submit"
                className="hidden rounded-full bg-leaf px-5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#173a2b] sm:block dark:bg-sandal dark:text-ink"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-ink/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 250 }}
              onClick={(event) => event.stopPropagation()}
              className="h-full w-[88%] max-w-sm overflow-y-auto bg-cream p-6 dark:bg-[#101713]"
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full border border-ink/10 p-2 dark:border-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <Link
                href="/"
                className="mt-8 flex items-center gap-3 rounded-2xl bg-leaf px-4 py-3 text-sm font-bold text-white"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <p className="mb-3 mt-10 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45 dark:text-white/45">
                Shop collections
              </p>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="block border-b border-ink/10 py-3.5 font-display text-xl font-semibold dark:border-white/10"
                >
                  {category.name}
                </Link>
              ))}
              <div className="mt-8 grid grid-cols-2 gap-3 text-sm font-semibold">
                {[...links.slice(1), { label: "Contact", href: "/contact" }].map(
                  (link) => (
                    <Link key={link.href} href={link.href}>
                      {link.label}
                    </Link>
                  )
                )}
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="button-secondary mt-8 w-full"
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {dark ? "Light mode" : "Dark mode"}
              </button>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
