import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about southAura products, delivery, international shipping, returns and gifting."
};

const faqs = [
  ["Where does southAura deliver?", "We deliver across serviceable Indian PIN codes and to selected international destinations including the United States, Canada, the United Kingdom, UAE, Singapore and Australia."],
  ["How quickly do you dispatch?", "Most items leave our fulfilment centre in 24–48 business hours. Fresh sweets and limited-batch foods may have a clearly stated preparation window."],
  ["Are food products vegetarian?", "Most food products are vegetarian. Each product page clearly lists relevant dietary and ingredient details. Please contact us before ordering if you have a severe allergy."],
  ["How do international duties work?", "International prices exclude local customs duties or import taxes. These may be collected by the courier or local authority before delivery."],
  ["Can I send a gift note?", "Yes. Add your message during checkout or contact our concierge team for custom, corporate or multi-address gifting."],
  ["What can be returned?", "Eligible unused non-food products can be returned within seven days of delivery. For hygiene and freshness, food, wellness and personalised items are generally non-returnable unless damaged or incorrect."],
  ["What if my order arrives damaged?", "Photograph the outer package and item, then contact us within 48 hours. We will arrange a replacement, store credit or refund after a quick review."],
  ["Can I change or cancel my order?", "Contact us as soon as possible. We can usually help before an order enters packing, but cancellation is not guaranteed after dispatch."],
  ["How should I store fresh products?", "Follow the storage guidance on the product page and pack. Most pantry goods prefer a cool, dry place in an airtight container after opening."],
  ["Do you offer wholesale or corporate gifting?", "Yes. Our team can curate assortments, brand packaging and coordinate multi-address delivery for celebrations and client programmes."]
];

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="A clear answer"
        title="Frequently asked questions."
        description="Everything useful about products, delivery, gifting, returns and the way we work."
        crumbs={[{ label: "FAQs" }]}
      />
      <div className="container-shell py-12 sm:py-16">
        <div className="mx-auto max-w-3xl divide-y divide-ink/10 border-y border-ink/10 dark:divide-white/10 dark:border-white/10">
          {faqs.map(([question, answer], index) => (
            <details key={question} id={index === 1 ? "shipping" : undefined} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-xl font-semibold sm:text-2xl">
                {question}
                <ChevronDown className="h-5 w-5 shrink-0 transition group-open:rotate-180" />
              </summary>
              <p className="max-w-2xl pt-4 text-sm leading-7 text-ink/60 dark:text-white/60">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
