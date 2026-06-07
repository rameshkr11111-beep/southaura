import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms governing use of the southAura website and purchases."
};

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Terms & conditions"
      description="The terms that govern browsing, purchasing and interacting with southAura."
      updated="June 5, 2026"
      sections={[
        { title: "Using the website", content: "By accessing southAura, you agree to use the website lawfully and not interfere with its security, availability, content or other customers." },
        { title: "Products and pricing", content: "We make every effort to present accurate descriptions, imagery, availability and prices. Natural and handmade products may show reasonable variation. We may correct genuine errors before dispatch." },
        { title: "Orders", content: "An order is accepted when we issue a confirmation. We may decline or cancel orders affected by stock errors, suspected fraud, delivery restrictions or pricing mistakes, with a full refund where payment was taken." },
        { title: "Intellectual property", content: "The southAura name, visual identity, copy, photography and site design are protected and may not be reproduced for commercial use without permission." },
        { title: "Liability and governing law", content: "To the extent permitted by law, liability is limited to the value of the relevant order. These terms are governed by the laws of India and courts in Bengaluru, Karnataka." }
      ]}
    />
  );
}
