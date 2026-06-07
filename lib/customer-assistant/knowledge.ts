import { blogPosts, products } from "@/lib/data";
import type { Product } from "@/lib/types";
import type { AssistantLanguage } from "@/lib/customer-assistant/types";

export const policyKnowledge = {
  shipping:
    "Orders normally dispatch within 24-48 business hours. Delivery time depends on the destination and product preparation window. International orders may require customs clearance.",
  return:
    "Eligible unused non-food products may be returned within seven days. Food, opened wellness products, personalised products and final-sale items are generally non-returnable unless damaged or incorrect.",
  refund:
    "Approved refunds are returned to the original payment method, normally within 5-10 business days. The assistant cannot approve refunds.",
  warranty:
    "Warranty coverage, where available, is shown on the individual product page. Food and consumable products do not carry a usage warranty.",
  payment:
    "The checkout UI supports UPI, cards, net banking, wallets, PayPal, Stripe, Razorpay and cash on delivery where available.",
  delivery:
    "Indian delivery is available to serviceable PIN codes. Selected international destinations are supported. Exact estimates should be confirmed at checkout."
};

export const languageNames: Record<AssistantLanguage, string> = {
  en: "English",
  hi: "हिन्दी",
  ta: "தமிழ்",
  te: "తెలుగు",
  ml: "മലയാളം",
  kn: "ಕನ್ನಡ"
};

export function detectLanguage(message: string, preferred?: string): AssistantLanguage {
  if (preferred && ["en", "hi", "ta", "te", "ml", "kn"].includes(preferred)) {
    return preferred as AssistantLanguage;
  }
  if (/[\u0900-\u097F]/.test(message)) return "hi";
  if (/[\u0B80-\u0BFF]/.test(message)) return "ta";
  if (/[\u0C00-\u0C7F]/.test(message)) return "te";
  if (/[\u0D00-\u0D7F]/.test(message)) return "ml";
  if (/[\u0C80-\u0CFF]/.test(message)) return "kn";
  return "en";
}

export function recommendProducts(message: string): Product[] {
  const terms = message.toLowerCase().split(/\W+/).filter((term) => term.length > 2);
  const scored = products.map((product) => ({
    product,
    score: terms.reduce((total, term) => {
      const haystack = `${product.name} ${product.category} ${product.description} ${product.tags.join(" ")} ${product.origin}`.toLowerCase();
      return total + (haystack.includes(term) ? 2 : 0);
    }, product.featured ? 1 : 0)
  }));
  return scored.sort((a, b) => b.score - a.score).slice(0, 3).map((item) => item.product);
}

export function relatedArticles(message: string) {
  const lower = message.toLowerCase();
  return blogPosts
    .filter((post) =>
      `${post.title} ${post.category} ${post.excerpt}`.toLowerCase().split(" ").some(
        (word) => word.length > 5 && lower.includes(word)
      )
    )
    .slice(0, 2)
    .map((post) => ({ title: post.title, href: `/blog/${post.slug}` }));
}
