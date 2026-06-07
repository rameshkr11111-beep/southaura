import Link from "next/link";
import { ArrowRight, Instagram, Linkedin, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/logo";

const footerLinks = {
  Shop: [
    ["All products", "/shop"],
    ["New arrivals", "/shop?sort=newest"],
    ["Bestsellers", "/shop?sort=popular"],
    ["Categories", "/categories"],
    ["Gift cards", "/shop?tag=gift"]
  ],
  "May we help?": [
    ["Contact", "/contact"],
    ["FAQs", "/faq"],
    ["Track order", "/track-order"],
    ["Returns", "/return-refund-policy"],
    ["Shipping", "/faq#shipping"]
  ],
  Company: [
    ["Our story", "/about"],
    ["Journal", "/blog"],
    ["Vendor login", "/vendor/login"],
    ["Create a shop", "/vendor/register"],
    ["Privacy", "/privacy-policy"],
    ["Terms", "/terms-conditions"]
  ]
};

export function Footer() {
  return (
    <footer className="mt-20 bg-ink text-white">
      <div className="border-b border-white/10">
        <div className="container-shell grid gap-10 py-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow">Notes from the South</p>
            <h2 className="mt-3 max-w-xl font-display text-4xl font-semibold leading-none sm:text-5xl">
              A more beautiful way to stay close to home.
            </h2>
          </div>
          <form className="relative" action="#">
            <input
              type="email"
              required
              className="h-14 w-full rounded-full border border-white/20 bg-white/5 px-6 pr-16 text-sm text-white outline-none placeholder:text-white/45 focus:border-sandal"
              placeholder="Your email address"
              aria-label="Email address"
            />
            <button
              className="absolute right-2 top-2 rounded-full bg-sandal p-3 text-ink transition hover:scale-105"
              aria-label="Join newsletter"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-3 text-xs text-white/45">
              Stories, rituals and private offers. No clutter.
            </p>
          </form>
        </div>
      </div>
      <div className="container-shell grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Logo inverse />
          <p className="mt-6 max-w-sm text-sm leading-6 text-white/55">
            Authentic South India, Delivered Everywhere. Thoughtfully sourced
            food, craft and rituals from makers we know.
          </p>
          <div className="mt-6 space-y-3 text-sm text-white/65">
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-sandal" /> hello@southaura.in
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-sandal" /> Bengaluru · Delhi ·
              Worldwide
            </p>
          </div>
          <div className="mt-7 flex gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="rounded-full border border-white/15 p-2.5 hover:border-sandal hover:text-sandal"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="rounded-full border border-white/15 p-2.5 hover:border-sandal hover:text-sandal"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-sandal">
                {title}
              </h3>
              <ul className="mt-5 space-y-3">
                {links.map(([label, href]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-white/60 transition hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <div className="container-shell flex flex-col gap-3 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 southAura Commerce Pvt. Ltd.</p>
          <p>Secure payments · Visa · Mastercard · UPI · Amex</p>
        </div>
      </div>
    </footer>
  );
}
