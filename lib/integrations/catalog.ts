export type IntegrationDefinition = {
  provider: string;
  name: string;
  category: string;
  secretRefs: string[];
  optionalRefs?: string[];
  webhookSecretRef?: string;
};

export const integrationCatalog: IntegrationDefinition[] = [
  { provider: "razorpay", name: "Razorpay", category: "PAYMENT", secretRefs: ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET"], webhookSecretRef: "RAZORPAY_WEBHOOK_SECRET" },
  { provider: "shiprocket", name: "Shiprocket", category: "DELIVERY", secretRefs: ["SHIPROCKET_TOKEN"], optionalRefs: ["SHIPROCKET_EMAIL", "SHIPROCKET_PASSWORD"], webhookSecretRef: "SHIPROCKET_WEBHOOK_SECRET" },
  { provider: "whatsapp", name: "WhatsApp Business", category: "MESSAGING", secretRefs: ["WHATSAPP_ACCESS_TOKEN", "WHATSAPP_PHONE_NUMBER_ID"], webhookSecretRef: "META_APP_SECRET" },
  { provider: "openai", name: "OpenAI-compatible AI", category: "AI", secretRefs: ["OPENAI_API_KEY"], optionalRefs: ["OPENAI_BASE_URL", "OPENAI_MODEL"] },
  { provider: "google_analytics", name: "Google Analytics 4", category: "ANALYTICS", secretRefs: ["GA_MEASUREMENT_ID", "GA_API_SECRET"], optionalRefs: ["NEXT_PUBLIC_GA_MEASUREMENT_ID"] },
  { provider: "search_console", name: "Google Search Console", category: "SEO", secretRefs: ["GOOGLE_SEARCH_CONSOLE_CREDENTIALS"], optionalRefs: ["GOOGLE_SITE_URL"] },
  { provider: "facebook", name: "Facebook Page", category: "SOCIAL", secretRefs: ["FACEBOOK_PAGE_ACCESS_TOKEN", "FACEBOOK_PAGE_ID"], webhookSecretRef: "META_APP_SECRET" },
  { provider: "instagram", name: "Instagram Business", category: "SOCIAL", secretRefs: ["INSTAGRAM_ACCESS_TOKEN", "INSTAGRAM_BUSINESS_ACCOUNT_ID"], webhookSecretRef: "META_APP_SECRET" },
  { provider: "email", name: "Transactional Email", category: "EMAIL", secretRefs: ["RESEND_API_KEY"], optionalRefs: ["EMAIL_FROM"] },
  { provider: "sms", name: "SMS Gateway", category: "SMS", secretRefs: ["MSG91_AUTH_KEY", "MSG91_TEMPLATE_ID"], optionalRefs: ["MSG91_SENDER_ID"] }
];

export function getIntegrationDefinition(provider: string) {
  return integrationCatalog.find((item) => item.provider === provider);
}

export function getEnvironmentStatus(definition: IntegrationDefinition) {
  const missing = definition.secretRefs.filter((name) => !process.env[name]);
  return {
    configured: missing.length === 0,
    missing,
    optionalConfigured: (definition.optionalRefs ?? []).filter((name) => Boolean(process.env[name]))
  };
}
