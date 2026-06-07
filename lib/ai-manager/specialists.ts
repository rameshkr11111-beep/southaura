import type { AgentActionType, AgentSpecialist } from "@/lib/ai-manager/types";

const specialistRules: Array<[AgentSpecialist, RegExp]> = [
  ["PRODUCT", /\b(product|catalog|sku|stock|inventory|variant|price)\b/i],
  ["ORDER", /\b(order|invoice|payment|cancel|refund)\b/i],
  ["CRM", /\b(customer|vip|follow.?up|repeat purchase|segment)\b/i],
  ["SEO", /\b(seo|keyword|meta|schema|sitemap|search console)\b/i],
  ["CONTENT", /\b(blog|article|buying guide|content|banner)\b/i],
  ["MARKETING", /\b(coupon|discount|campaign|whatsapp|instagram|facebook|social)\b/i],
  ["DELIVERY", /\b(delivery|shipment|courier|tracking|label|cod|return pickup)\b/i],
  ["ANALYTICS", /\b(analytics|revenue|conversion|traffic|performance|summary)\b/i]
];

export function routeSpecialist(command: string): AgentSpecialist {
  return specialistRules.find(([, rule]) => rule.test(command))?.[0] ?? "MANAGER";
}

export function specialistForAction(type: AgentActionType): AgentSpecialist {
  if (["CREATE_PRODUCT", "UPDATE_PRODUCT", "CHANGE_PRICE", "UPDATE_INVENTORY", "ANALYZE_PRODUCT_IMAGE"].includes(type)) return "PRODUCT";
  if (["BULK_UPDATE_SEO"].includes(type)) return "SEO";
  if (["CREATE_BLOG", "PUBLISH_CONTENT", "CREATE_BANNER"].includes(type)) return "CONTENT";
  if (["CREATE_SOCIAL_POST", "PUBLISH_SOCIAL", "SEND_WHATSAPP", "CREATE_COUPON"].includes(type)) return "MARKETING";
  if (["ASSIGN_COURIER", "GENERATE_LABEL"].includes(type)) return "DELIVERY";
  if (["SEND_ORDER_UPDATE", "CREATE_REFUND"].includes(type)) return "ORDER";
  return "MANAGER";
}
