export type AdminNavItem = {
  label: string;
  href: string;
  icon: string;
  badge?: string;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

export const adminNavigation: AdminNavGroup[] = [
  {
    label: "Command center",
    items: [
      { label: "Overview", href: "/admin", icon: "LayoutDashboard" },
      { label: "Analytics", href: "/admin/analytics", icon: "ChartNoAxesCombined" },
      { label: "Dakshin AI Manager", href: "/admin/ai-manager", icon: "Bot", badge: "Agent" },
      { label: "AI operations", href: "/admin/ai-manager/operations", icon: "Workflow" },
      { label: "AI approvals", href: "/admin/ai-manager/approvals", icon: "ClipboardCheck", badge: "6" },
      { label: "AI tool connections", href: "/admin/ai-manager/tools", icon: "PlugZap" }
    ]
  },
  {
    label: "Commerce",
    items: [
      { label: "Products", href: "/admin/products", icon: "Package" },
      { label: "Inventory", href: "/admin/inventory", icon: "Boxes", badge: "12" },
      { label: "Pricing", href: "/admin/pricing", icon: "BadgeIndianRupee" },
      { label: "Orders", href: "/admin/orders", icon: "ShoppingBag", badge: "24" },
      { label: "Delivery", href: "/admin/delivery", icon: "Truck" },
      { label: "Returns", href: "/admin/returns", icon: "Undo2" },
      { label: "Coupons", href: "/admin/coupons", icon: "TicketPercent" }
    ]
  },
  {
    label: "Relationships",
    items: [
      { label: "Customer CRM", href: "/admin/customers", icon: "Users", badge: "12" },
      { label: "Follow-ups", href: "/admin/follow-ups", icon: "ListTodo", badge: "7" },
      { label: "Abandoned carts", href: "/admin/abandoned-carts", icon: "ShoppingCart", badge: "28" },
      { label: "Marketing", href: "/admin/marketing", icon: "Megaphone" },
      { label: "WhatsApp", href: "/admin/whatsapp", icon: "MessageCircle", badge: "8" },
      { label: "AI support inbox", href: "/admin/support-inbox", icon: "MessagesSquare", badge: "3" },
      { label: "Loyalty", href: "/admin/loyalty", icon: "Gem" }
    ]
  },
  {
    label: "Content & growth",
    items: [
      { label: "Website", href: "/admin/website", icon: "PanelsTopLeft" },
      { label: "CMS & blog", href: "/admin/content", icon: "Newspaper" },
      { label: "SEO", href: "/admin/seo", icon: "SearchCheck" },
      { label: "Domains", href: "/admin/domains", icon: "Globe2" }
    ]
  },
  {
    label: "Operations",
    items: [
      { label: "Vendors", href: "/admin/vendors", icon: "Handshake" },
      { label: "Purchasing", href: "/admin/purchasing", icon: "ClipboardList" },
      { label: "Payments", href: "/admin/payments", icon: "CreditCard" },
      { label: "Accounting", href: "/admin/accounting", icon: "Landmark" }
    ]
  },
  {
    label: "Administration",
    items: [
      { label: "Team & roles", href: "/admin/team", icon: "ShieldCheck" },
      { label: "Security", href: "/admin/security", icon: "LockKeyhole" },
      { label: "Integrations", href: "/admin/integrations", icon: "Cable" },
      { label: "Settings", href: "/admin/settings", icon: "Settings2" }
    ]
  }
];

export type ModuleConfig = {
  title: string;
  eyebrow: string;
  description: string;
  action: string;
  stats: Array<{ label: string; value: string; change: string; tone?: string }>;
  columns: string[];
  rows: string[][];
  filters: string[];
  features: string[];
};

export const moduleConfigs: Record<string, ModuleConfig> = {
  products: {
    title: "Product catalog",
    eyebrow: "Commerce / Catalog",
    description: "Create, enrich and govern every sellable item across channels.",
    action: "Add product",
    stats: [
      { label: "Active products", value: "1,284", change: "+42 this month" },
      { label: "Drafts", value: "36", change: "Needs review", tone: "amber" },
      { label: "Out of stock", value: "18", change: "-6 vs last week", tone: "red" },
      { label: "Catalog value", value: "₹48.2L", change: "+8.4%" }
    ],
    columns: ["Product", "SKU", "Category", "Price", "Inventory", "Status"],
    rows: [
      ["Coorg Estate Filter Coffee", "DK-CF-1001", "Coffee & Tea", "₹449", "342 units", "Active"],
      ["Temple Town Mysore Pak", "DK-SW-2042", "Sweets", "₹699", "84 units", "Low stock"],
      ["Kanchipuram Silk Stole", "DK-SR-3108", "Sarees", "₹3,490", "27 units", "Active"],
      ["Brass Nilavilakku", "DK-PJ-4021", "Pooja Items", "₹1,890", "16 units", "Active"],
      ["Nalpamaradi Body Oil", "DK-AY-5074", "Ayurveda", "₹875", "128 units", "Draft"]
    ],
    filters: ["All products", "Active", "Draft", "Low stock", "Archived"],
    features: ["Bulk upload", "Image gallery", "Product video", "Variants", "SKU & barcode", "Reviews"]
  },
  inventory: {
    title: "Inventory control",
    eyebrow: "Commerce / Supply",
    description: "Monitor stock, movements, ageing and replenishment across locations.",
    action: "Adjust stock",
    stats: [
      { label: "Units on hand", value: "18,642", change: "Across 2 locations" },
      { label: "Low-stock SKUs", value: "12", change: "Action required", tone: "amber" },
      { label: "Out of stock", value: "18", change: "1.4% of catalog", tone: "red" },
      { label: "Inventory value", value: "₹48.2L", change: "+3.1%" }
    ],
    columns: ["Product", "SKU", "On hand", "Committed", "Available", "Reorder at"],
    rows: [
      ["Temple Town Mysore Pak", "DK-SW-2042", "84", "61", "23", "30"],
      ["Brass Nilavilakku", "DK-PJ-4021", "16", "9", "7", "10"],
      ["Kanchipuram Silk Stole", "DK-SR-3108", "27", "6", "21", "8"],
      ["Malabar Garam Masala", "DK-SP-6088", "416", "48", "368", "80"],
      ["Avakaya Mango Pickle", "DK-PK-7024", "238", "32", "206", "45"]
    ],
    filters: ["All stock", "Low stock", "Out of stock", "Overstocked", "Movements"],
    features: ["Stock alerts", "Movement ledger", "Warehouse transfer", "Forecasting", "Barcode scan", "Valuation"]
  },
  pricing: {
    title: "Pricing studio",
    eyebrow: "Commerce / Revenue",
    description: "Control retail, sale, wholesale and distributor pricing at scale.",
    action: "Create price rule",
    stats: [
      { label: "Active sales", value: "8", change: "₹4.8L influenced" },
      { label: "Avg. discount", value: "12.6%", change: "-1.2% margin impact" },
      { label: "Flash sales", value: "2", change: "Scheduled" },
      { label: "Wholesale lists", value: "4", change: "126 buyers" }
    ],
    columns: ["Rule", "Audience", "Products", "Discount", "Window", "Status"],
    rows: [
      ["Monsoon Pantry Sale", "All customers", "184 products", "15%", "Jun 7–12", "Scheduled"],
      ["VIP Coffee Pricing", "VIP segment", "28 products", "10%", "Always on", "Active"],
      ["Distributor South Zone", "Distributors", "412 products", "22%", "Always on", "Active"],
      ["Weekend Flash Sale", "All customers", "16 products", "20%", "Jun 6–7", "Draft"],
      ["First Order Welcome", "New customers", "All products", "₹250", "Always on", "Active"]
    ],
    filters: ["All rules", "Active", "Scheduled", "Draft", "Expired"],
    features: ["Bulk update", "Sale pricing", "Flash sales", "Wholesale", "Dynamic rules", "Margin guardrails"]
  },
  orders: {
    title: "Order management",
    eyebrow: "Commerce / Fulfilment",
    description: "One operational view from payment confirmation to delivery.",
    action: "Create order",
    stats: [
      { label: "Today's orders", value: "186", change: "+18.4%" },
      { label: "Processing", value: "42", change: "Within SLA" },
      { label: "Pending payment", value: "11", change: "₹38,420", tone: "amber" },
      { label: "Returns", value: "7", change: "3.8% rate" }
    ],
    columns: ["Order", "Customer", "Placed", "Total", "Payment", "Fulfilment"],
    rows: [
      ["#DK10482", "Meera Khanna", "12 min ago", "₹2,348", "Paid", "Processing"],
      ["#DK10481", "Arjun Malhotra", "24 min ago", "₹6,790", "Paid", "Packed"],
      ["#DK10480", "Naina Kapoor", "41 min ago", "₹1,524", "COD", "Confirmed"],
      ["#DK10479", "Dev Menon", "58 min ago", "₹4,285", "Paid", "Shipped"],
      ["#DK10478", "Rhea Singh", "1 hr ago", "₹875", "Failed", "On hold"]
    ],
    filters: ["All orders", "Pending", "Processing", "Shipped", "Delivered", "Returned"],
    features: ["Status workflow", "GST invoice", "Refunds", "Bulk fulfil", "Order notes", "Fraud review"]
  },
  customers: {
    title: "Customer CRM",
    eyebrow: "Relationships / CRM",
    description: "Understand every customer, interaction and lifetime relationship.",
    action: "Add customer",
    stats: [
      { label: "Total customers", value: "48,392", change: "+1,284 this month" },
      { label: "Repeat rate", value: "42.8%", change: "+3.2%" },
      { label: "Avg. lifetime value", value: "₹8,640", change: "+11.6%" },
      { label: "VIP customers", value: "1,248", change: "₹1.8Cr LTV" }
    ],
    columns: ["Customer", "Segment", "Orders", "Total spent", "Last order", "Status"],
    rows: [
      ["Meera Khanna", "VIP · Coffee lover", "18", "₹42,680", "Today", "Active"],
      ["Arjun Malhotra", "International", "9", "₹38,220", "Today", "Active"],
      ["Naina Kapoor", "Corporate gifting", "12", "₹1,28,400", "Today", "VIP"],
      ["Dev Menon", "Repeat buyer", "7", "₹18,640", "Yesterday", "Active"],
      ["Rhea Singh", "At risk", "3", "₹4,120", "94 days ago", "Win back"]
    ],
    filters: ["All customers", "VIP", "New", "Repeat", "At risk", "International"],
    features: ["Purchase history", "Customer notes", "Segments", "VIP tags", "LTV", "Consent management"]
  },
  marketing: {
    title: "Marketing CRM",
    eyebrow: "Relationships / Growth",
    description: "Plan journeys across email, SMS, WhatsApp and push.",
    action: "Create campaign",
    stats: [
      { label: "Revenue attributed", value: "₹12.8L", change: "+24.6%" },
      { label: "Active journeys", value: "14", change: "6 automated" },
      { label: "Abandoned recovered", value: "₹2.4L", change: "18.2% recovery" },
      { label: "Campaign ROI", value: "8.4x", change: "+1.1x" }
    ],
    columns: ["Campaign", "Channel", "Audience", "Sent", "Engagement", "Revenue"],
    rows: [
      ["Monsoon pantry edit", "Email", "18,420", "18,204", "42.8% open", "₹3.82L"],
      ["Cart recovery · 1 hour", "WhatsApp", "1,284", "1,176", "22.4% convert", "₹2.14L"],
      ["VIP coffee drop", "SMS", "1,248", "1,241", "12.8% click", "₹1.46L"],
      ["New arrival alert", "Push", "28,420", "27,891", "8.6% click", "₹96K"],
      ["Win-back 90 days", "Email", "4,126", "4,088", "18.2% open", "₹74K"]
    ],
    filters: ["All campaigns", "Email", "WhatsApp", "SMS", "Push", "Automations"],
    features: ["Journey builder", "Abandoned carts", "Remarketing", "Referrals", "A/B tests", "AI copy"]
  },
  delivery: {
    title: "Delivery command",
    eyebrow: "Commerce / Logistics",
    description: "Coordinate courier allocation, tracking, COD and reverse logistics.",
    action: "Create shipment",
    stats: [
      { label: "Pending shipments", value: "64", change: "18 due in 2 hrs", tone: "amber" },
      { label: "In transit", value: "428", change: "97.2% on time" },
      { label: "Delivered today", value: "184", change: "+16.8%" },
      { label: "COD receivable", value: "₹2.84L", change: "Next remit Jun 7" }
    ],
    columns: ["Shipment", "Order", "Courier", "Destination", "ETA", "Status"],
    rows: [
      ["SH-88420", "#DK10479", "Delhivery", "New Delhi", "Jun 7", "In transit"],
      ["SH-88419", "#DK10476", "Blue Dart", "Toronto", "Jun 11", "Customs"],
      ["SH-88418", "#DK10475", "Shiprocket", "Gurugram", "Today", "Out for delivery"],
      ["SH-88417", "#DK10472", "DTDC", "Mumbai", "Jun 7", "In transit"],
      ["SH-88416", "#DK10468", "Blue Dart", "Bengaluru", "Today", "Delivered"]
    ],
    filters: ["All shipments", "Pending", "In transit", "Out for delivery", "Exceptions", "Returns"],
    features: ["Courier rules", "Partner assignment", "Labels", "Live tracking", "Return pickup", "COD reconciliation"]
  },
  content: {
    title: "Content studio",
    eyebrow: "Growth / CMS",
    description: "Publish stories, launches, press updates and editorial commerce.",
    action: "New article",
    stats: [
      { label: "Published", value: "184", change: "12 this month" },
      { label: "Scheduled", value: "8", change: "Next: Tomorrow 9 AM" },
      { label: "Organic sessions", value: "84.2K", change: "+28.4%" },
      { label: "Content revenue", value: "₹6.4L", change: "+17.2%" }
    ],
    columns: ["Title", "Type", "Author", "Publish date", "Traffic", "Status"],
    rows: [
      ["The quiet art of filter coffee", "Article", "Ananya Rao", "May 18", "24.8K", "Published"],
      ["Monsoon pantry essentials", "Buying guide", "Riya Nair", "Jun 7", "—", "Scheduled"],
      ["New Coorg estate partnership", "News", "Founder desk", "Jun 4", "8.2K", "Published"],
      ["Kanchipuram weave guide", "Article", "Ananya Rao", "Apr 27", "18.6K", "Published"],
      ["Festival gifting 2026", "Landing page", "Growth team", "—", "—", "Draft"]
    ],
    filters: ["All content", "Articles", "News", "Press", "Scheduled", "Drafts"],
    features: ["Rich editor", "AI writer", "Categories", "Tags", "Scheduling", "Featured stories"]
  },
  seo: {
    title: "SEO intelligence",
    eyebrow: "Growth / Organic",
    description: "Protect technical health and improve every commercial landing page.",
    action: "Run SEO audit",
    stats: [
      { label: "Site health", value: "92/100", change: "+4 points" },
      { label: "Indexed pages", value: "1,642", change: "98.6% coverage" },
      { label: "Organic clicks", value: "84.2K", change: "+28.4%" },
      { label: "Issues", value: "23", change: "7 high priority", tone: "amber" }
    ],
    columns: ["Page", "Type", "SEO score", "Keyword", "Clicks", "Issue"],
    rows: [
      ["/products/coorg-filter-coffee", "Product", "96", "filter coffee online", "12.4K", "None"],
      ["/category/spices-masala", "Category", "88", "south indian spices", "8.8K", "Meta length"],
      ["/blog/perfect-filter-coffee", "Article", "94", "filter coffee recipe", "18.2K", "None"],
      ["/category/sweets", "Category", "72", "south indian sweets", "4.1K", "Thin copy"],
      ["/products/brass-nilavilakku", "Product", "84", "nilavilakku online", "2.8K", "Missing FAQ"]
    ],
    filters: ["All pages", "Products", "Categories", "Articles", "High priority", "Opportunities"],
    features: ["Metadata", "Open Graph", "Canonicals", "Schema", "Sitemap", "AI recommendations"]
  },
  vendors: {
    title: "Vendor network",
    eyebrow: "Operations / Supply",
    description: "Manage supplier relationships, terms, quality and performance.",
    action: "Add vendor",
    stats: [
      { label: "Active vendors", value: "86", change: "Across 5 states" },
      { label: "Open POs", value: "24", change: "₹18.6L committed" },
      { label: "On-time supply", value: "94.2%", change: "+2.8%" },
      { label: "Payables", value: "₹12.4L", change: "₹4.2L due this week" }
    ],
    columns: ["Vendor", "Location", "Products", "Open POs", "Rating", "Status"],
    rows: [
      ["Kodagu Estate Collective", "Coorg, KA", "28", "3", "4.9", "Preferred"],
      ["Sri Lakshmi Foods", "Mysuru, KA", "42", "4", "4.8", "Active"],
      ["Kanchi Heritage Looms", "Kanchipuram, TN", "64", "2", "4.9", "Preferred"],
      ["Malabar Botanics", "Thrissur, KL", "36", "5", "4.6", "Active"],
      ["Guntur Family Foods", "Guntur, AP", "18", "1", "4.7", "Active"]
    ],
    filters: ["All vendors", "Preferred", "Active", "Review due", "Payment due"],
    features: ["Supplier database", "Purchase orders", "Payments", "Quality checks", "Scorecards", "Terms"]
  },
  payments: {
    title: "Payments & reconciliation",
    eyebrow: "Finance / Collections",
    description: "Monitor all gateways, settlements, refunds and reconciliation exceptions.",
    action: "Reconcile now",
    stats: [
      { label: "Collected today", value: "₹8.42L", change: "+18.4%" },
      { label: "Settlement pending", value: "₹12.8L", change: "3 providers" },
      { label: "Failed payments", value: "1.8%", change: "-0.4%" },
      { label: "Refunds pending", value: "₹48,620", change: "11 requests", tone: "amber" }
    ],
    columns: ["Transaction", "Order", "Provider", "Method", "Amount", "Status"],
    rows: [
      ["pay_Q2f84Kx", "#DK10482", "Razorpay", "UPI", "₹2,348", "Reconciled"],
      ["pi_3R82KM", "#DK10481", "Stripe", "Visa", "₹6,790", "Settling"],
      ["PAYID-M8X4", "#DK10479", "PayPal", "Wallet", "₹4,285", "Reconciled"],
      ["pay_Q2f71Ls", "#DK10478", "Razorpay", "UPI", "₹875", "Failed"],
      ["cod_88416", "#DK10468", "COD", "Cash", "₹1,680", "Collected"]
    ],
    filters: ["All payments", "Razorpay", "Stripe", "PayPal", "COD", "Exceptions"],
    features: ["Gateway status", "Reconciliation", "Refunds", "UPI", "COD remittance", "Settlement reports"]
  },
  accounting: {
    title: "Accounting & GST",
    eyebrow: "Finance / Reporting",
    description: "See sales, taxes, margins, expenses and inventory value in one place.",
    action: "Export report",
    stats: [
      { label: "Net sales", value: "₹1.84Cr", change: "+22.6% YTD" },
      { label: "Gross profit", value: "₹68.4L", change: "37.2% margin" },
      { label: "GST payable", value: "₹12.8L", change: "Due Jun 20" },
      { label: "Expenses", value: "₹42.6L", change: "23.1% of sales" }
    ],
    columns: ["Report", "Period", "Revenue", "Tax", "Cost", "Net"],
    rows: [
      ["Sales summary", "May 2026", "₹28.4L", "₹4.12L", "₹17.6L", "₹6.68L"],
      ["GST outward supplies", "May 2026", "₹28.4L", "₹4.12L", "—", "—"],
      ["Product profitability", "May 2026", "₹28.4L", "—", "₹16.9L", "₹11.5L"],
      ["Operating expenses", "May 2026", "—", "₹68K", "₹6.42L", "-₹6.42L"],
      ["Inventory valuation", "Jun 5, 2026", "—", "—", "₹48.2L", "₹48.2L"]
    ],
    filters: ["Overview", "GST", "Sales", "Profit", "Expenses", "Inventory"],
    features: ["GST reports", "P&L", "Expense tracking", "Inventory valuation", "Invoices", "Exports"]
  },
  domains: {
    title: "Domains & SSL",
    eyebrow: "Website / Infrastructure",
    description: "Connect storefront domains and monitor DNS and certificate health.",
    action: "Connect domain",
    stats: [
      { label: "Primary domain", value: "dakshinkart.com", change: "Healthy" },
      { label: "Connected domains", value: "4", change: "3 production" },
      { label: "SSL certificates", value: "4/4", change: "Auto-renewing" },
      { label: "DNS issues", value: "1", change: "Action required", tone: "amber" }
    ],
    columns: ["Domain", "Type", "Environment", "DNS", "SSL", "Status"],
    rows: [
      ["dakshinkart.com", "Primary", "Production", "Verified", "Active", "Live"],
      ["www.dakshinkart.com", "Redirect", "Production", "Verified", "Active", "Live"],
      ["admin.dakshinkart.com", "Subdomain", "Production", "Verified", "Active", "Live"],
      ["staging.dakshinkart.com", "Subdomain", "Preview", "Pending CNAME", "Pending", "Setup"],
      ["southaura.in", "Alias", "Production", "Verified", "Active", "Live"]
    ],
    filters: ["All domains", "Production", "Preview", "DNS issues", "SSL issues"],
    features: ["Custom domains", "Subdomains", "DNS instructions", "SSL status", "Redirects", "Verification"]
  }
};

const standardModules = [
  "analytics",
  "returns",
  "coupons",
  "whatsapp",
  "loyalty",
  "website",
  "purchasing",
  "team",
  "security",
  "integrations",
  "settings",
  "follow-ups",
  "abandoned-carts"
];

for (const slug of standardModules) {
  if (!moduleConfigs[slug]) {
    const title = slug
      .split("-")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
    moduleConfigs[slug] = {
      title,
      eyebrow: "DakshinKart OS",
      description: `Manage ${title.toLowerCase()} with connected workflows, permissions and reporting.`,
      action: `Configure ${title}`,
      stats: [
        { label: "Active", value: "24", change: "+8.4%" },
        { label: "Needs attention", value: "6", change: "Review today", tone: "amber" },
        { label: "Completed", value: "184", change: "+16.2%" },
        { label: "Efficiency", value: "94.8%", change: "+2.1%" }
      ],
      columns: ["Name", "Type", "Owner", "Updated", "Performance", "Status"],
      rows: [
        [`${title} workflow A`, "Automated", "Operations", "12 min ago", "98.4%", "Active"],
        [`${title} workflow B`, "Scheduled", "Growth team", "2 hrs ago", "92.6%", "Active"],
        [`${title} configuration`, "System", "Super Admin", "Yesterday", "100%", "Healthy"],
        [`${title} review queue`, "Manual", "Manager", "Yesterday", "84.2%", "Review"],
        [`${title} archive`, "Historical", "System", "Jun 2", "—", "Complete"]
      ],
      filters: ["All", "Active", "Needs review", "Scheduled", "Archived"],
      features: ["Workflow automation", "Team permissions", "Activity history", "Bulk actions", "Exports", "AI assistance"]
    };
  }
}
