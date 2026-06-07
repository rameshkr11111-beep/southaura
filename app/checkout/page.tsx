import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout-client";

export const metadata: Metadata = {
  title: "Secure Checkout",
  description: "Complete your southAura order with secure payment and tracked delivery."
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
