import type { Metadata } from "next";
import { HomeContent } from "@/components/home-content";

export const metadata: Metadata = {
  title: "Shop Authentic South Indian Products Online",
  description:
    "Shop premium South Indian coffee, groceries, sweets, snacks, sarees, Ayurveda, pooja and home products, delivered across India and worldwide."
};

export default function HomePage() {
  return <HomeContent />;
}
