import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How southAura collects, uses and protects personal information."
};

export default function PrivacyPolicyPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Privacy policy"
      description="A clear account of the information we collect, why we use it and the choices available to you."
      updated="June 5, 2026"
      sections={[
        { title: "Information we collect", content: ["Contact and delivery details you provide at checkout or account creation.", "Order, payment status and customer support history.", "Device, browser and on-site interaction data used to improve performance and experience."] },
        { title: "How we use it", content: "We use personal information to fulfil orders, process payments, provide support, prevent fraud, improve our storefront and send marketing only where you have opted in." },
        { title: "Sharing and service providers", content: "We share only what is necessary with trusted payment, logistics, analytics and communication partners. We do not sell your personal information." },
        { title: "Your choices", content: "You may request access, correction or deletion of eligible personal information, or withdraw marketing consent, by writing to privacy@southaura.in." },
        { title: "Security and retention", content: "We use reasonable technical and organisational safeguards and retain information only as long as necessary for legal, operational and service purposes." }
      ]}
    />
  );
}
