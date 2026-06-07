import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { WishlistClient } from "@/components/wishlist-client";

export const metadata: Metadata = {
  title: "Your Wishlist",
  description: "Return to the southAura pieces and flavours you have saved."
};

export default function WishlistPage() {
  return (
    <>
      <PageHero
        eyebrow="Saved for later"
        title="Your private edit."
        description="A considered place for everything you would love to return to."
        crumbs={[{ label: "Wishlist" }]}
      />
      <WishlistClient />
    </>
  );
}
