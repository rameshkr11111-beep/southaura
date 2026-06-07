import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description: "Read southAura's return, replacement and refund policy."
};

export default function ReturnsPage() {
  return (
    <InfoPage
      eyebrow="Customer care"
      title="Returns & refunds"
      description="We want every order to arrive beautifully. Here is how we make things right when it does not."
      updated="June 5, 2026"
      sections={[
        { title: "Eligible returns", content: "Unused, unworn non-food products in original condition and packaging may be requested for return within seven days of delivery." },
        { title: "Non-returnable items", content: ["Food and perishable products unless damaged, spoiled or incorrect.", "Opened wellness, personal-care or hygiene products.", "Personalised, made-to-order or final-sale products."] },
        { title: "Damage or incorrect delivery", content: "Contact care@southaura.in within 48 hours with your order number and clear photographs of the item and outer packaging. We will review promptly and offer a replacement, credit or refund where appropriate." },
        { title: "Refund timing", content: "Approved refunds are issued to the original payment method, normally within 5–10 business days after approval or receipt of the returned item." },
        { title: "Return shipping", content: "We cover return shipping for damaged, defective or incorrect items. For approved preference-based returns, return courier charges may be deducted from the refund." }
      ]}
    />
  );
}
