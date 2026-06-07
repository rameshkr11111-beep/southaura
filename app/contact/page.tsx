import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact the southAura team for product, order, gifting or delivery support."
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="We are here"
        title="Good service should feel personal."
        description="Questions about a product, an order or a meaningful gift? Our team will help you find a clear answer."
        crumbs={[{ label: "Contact us" }]}
      />
      <div className="container-shell grid gap-8 py-12 sm:py-16 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <div className="space-y-4">
            {[
              [MessageCircle, "WhatsApp", "+91 98718 77072", "Fastest response"],
              [Mail, "Email", "hello@southaura.in", "Replies within one business day"],
              [Phone, "Call", "+91 80 4567 8900", "Mon–Sat, 10 AM–7 PM IST"],
              [MapPin, "Studio", "Indiranagar, Bengaluru", "Visits by appointment"]
            ].map(([Icon, label, value, note]) => {
              const ContactIcon = Icon as typeof Mail;
              return (
                <div key={String(label)} className="flex gap-4 rounded-2xl bg-mist/60 p-5 dark:bg-white/5">
                  <ContactIcon className="mt-1 h-5 w-5 text-brass" />
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-ink/40 dark:text-white/40">
                      {String(label)}
                    </p>
                    <p className="mt-1 font-display text-xl font-semibold">{String(value)}</p>
                    <p className="mt-1 text-[10px] text-ink/45 dark:text-white/45">{String(note)}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-brass/30 p-4 text-xs">
            <Clock className="h-4 w-4 text-brass" />
            Current response time: under 3 hours
          </div>
        </div>
        <form className="surface p-6 sm:p-10">
          <p className="eyebrow">Send a note</p>
          <h2 className="mt-3 font-display text-4xl font-semibold">How may we help?</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <input required className="field" placeholder="Your name" />
            <input required className="field" type="email" placeholder="Email address" />
            <input className="field" type="tel" placeholder="Phone number" />
            <select className="field" defaultValue="">
              <option value="" disabled>What is this about?</option>
              <option>Product question</option>
              <option>Order support</option>
              <option>Corporate gifting</option>
              <option>International delivery</option>
              <option>Partnerships</option>
            </select>
            <textarea
              required
              className="min-h-36 rounded-2xl border border-ink/10 bg-white p-4 text-sm outline-none focus:border-brass dark:border-white/10 dark:bg-white/5 sm:col-span-2"
              placeholder="Tell us a little more..."
            />
          </div>
          <button className="button-primary mt-5">Send message</button>
        </form>
      </div>
    </>
  );
}
