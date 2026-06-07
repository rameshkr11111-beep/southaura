export const agentActivity = [
  {
    title: "Catalog SEO audit completed",
    detail: "24 spice products reviewed; 8 missing descriptions found.",
    status: "Completed",
    time: "18 min ago"
  },
  {
    title: "DIWALI20 coupon awaiting approval",
    detail: "20% off, ₹999 minimum order, maximum saving ₹1,000.",
    status: "Approval",
    time: "42 min ago"
  },
  {
    title: "Delayed shipment scan",
    detail: "7 shipments crossed courier SLA; 3 marked high priority.",
    status: "Completed",
    time: "1 hr ago"
  },
  {
    title: "WhatsApp cart recovery blocked",
    detail: "WhatsApp Business connection requires configuration.",
    status: "Failed",
    time: "2 hrs ago"
  }
];

export const businessSuggestions = [
  {
    category: "Revenue opportunity",
    title: "Recover 28 abandoned carts",
    detail: "₹84,620 of checkout value is still recoverable today.",
    impact: "High",
    command: "Send WhatsApp abandoned cart reminders"
  },
  {
    category: "Product alert",
    title: "Restock three fast-moving products",
    detail: "Mysore Pak, Nilavilakku and Kanchipuram Stole may stock out in 72 hours.",
    impact: "High",
    command: "Show low stock products"
  },
  {
    category: "SEO alert",
    title: "Improve spice category metadata",
    detail: "Estimated SEO score can improve from 74 to 91.",
    impact: "Medium",
    command: "Improve SEO of all spice products"
  },
  {
    category: "Customer follow-up",
    title: "Re-engage 12 at-risk VIP customers",
    detail: "No purchase in 60 days despite historically high order value.",
    impact: "Medium",
    command: "Create repeat purchase offer for VIP customers"
  }
];

export const toolCatalog = [
  ["website_database", "Website database", "DATA", "Database", true],
  ["product_catalog", "Product catalog", "DATA", "Database", true],
  ["orders_database", "Orders database", "DATA", "Database", true],
  ["customers_database", "Customers database", "DATA", "Database", true],
  ["whatsapp", "WhatsApp Business API", "MESSAGING", "Messaging", false],
  ["facebook", "Facebook Page", "SOCIAL", "Social", false],
  ["instagram", "Instagram Business", "SOCIAL", "Social", false],
  ["youtube", "YouTube Shorts", "SOCIAL", "Social", false],
  ["google_analytics", "Google Analytics", "ANALYTICS", "Analytics", false],
  ["search_console", "Google Search Console", "SEO", "Analytics", false],
  ["razorpay", "Razorpay", "PAYMENT", "Payments", false],
  ["shiprocket", "Shiprocket", "DELIVERY", "Delivery", false],
  ["smtp", "Email SMTP", "MESSAGING", "Messaging", false],
  ["sms", "SMS gateway", "MESSAGING", "Messaging", false],
  ["openai", "OpenAI-compatible provider", "AI", "Intelligence", false]
] as const;
