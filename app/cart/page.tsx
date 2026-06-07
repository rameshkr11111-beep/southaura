import type { Metadata } from "next";
import { CartClient } from "@/components/cart-client";

export const metadata: Metadata = {
  title: "Your Shopping Bag",
  description: "Review your southAura selections and continue to secure checkout."
};

export default function CartPage() {
  return <CartClient />;
}
