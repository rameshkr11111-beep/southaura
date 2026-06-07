import type { AgentPlan, AgentProposal } from "@/lib/ai-manager/types";

const money = (command: string) => {
  const explicitPrice = command.match(
    /\bprice(?:\s+of|\s+is|\s+at)?\s*(?:₹|rs\.?|inr)?\s*([\d,]+)(?:\.\d+)?/i
  );
  const match =
    explicitPrice ??
    command.match(/(?:₹|rs\.?|inr)\s*([\d,]+)(?:\.\d+)?/i);
  return match ? Number(match[1].replaceAll(",", "")) : undefined;
};

const percent = (command: string) => {
  const match = command.match(/(\d{1,2})\s*%/);
  return match ? Number(match[1]) : undefined;
};

const proposal = (
  input: Omit<AgentProposal, "status">
): AgentProposal => ({ ...input, status: "PENDING_APPROVAL" });

export function createDemoAgentPlan(command: string): AgentPlan {
  const lower = command.toLowerCase();

  if (lower.includes("analyze") && lower.includes("image")) {
    return {
      mode: "PROPOSAL",
      specialist: "PRODUCT",
      response:
        "I prepared an image-quality and merchandising analysis task. The original file remains unchanged until you approve any generated catalog updates.",
      proposals: [
        proposal({
          type: "ANALYZE_PRODUCT_IMAGE",
          specialist: "PRODUCT",
          title: "Analyze product image",
          description: "Checks image quality, background, packaging visibility, alt text and marketplace readiness.",
          riskLevel: "LOW",
          targetType: "ProductMedia",
          input: { source: "ADMIN_UPLOAD", preserveOriginal: true },
          preview: {
            checks: ["Resolution", "Background quality", "Label readability", "Visual authenticity", "SEO alt text"],
            generatedOutputs: ["Quality score", "Improvement suggestions", "Alt text", "Crop recommendations"],
            changesLiveData: false
          }
        })
      ],
      suggestions: ["Generate product alt text", "Prepare marketplace crop sizes"]
    };
  }

  if (lower.includes("add new product") || lower.startsWith("create product")) {
    const price = money(command) ?? 299;
    const rawName =
      command
        .replace(/add new product/i, "")
        .replace(/create product/i, "")
        .replace(/with price.*$/i, "")
        .trim() || "New South Indian Product";
    const title = rawName.replace(/\s+/g, " ");
    return {
      mode: "PROPOSAL",
      response:
        "I prepared a complete product draft. Review the title, pricing, SEO, category and stock settings before approval.",
      proposals: [
        proposal({
          type: "CREATE_PRODUCT",
          title: `Create product: ${title}`,
          description:
            "Creates a draft catalog product with generated merchandising and SEO fields.",
          riskLevel: "MEDIUM",
          targetType: "Product",
          input: {
            name: title,
            price,
            category: lower.includes("mysore pak") ? "Sweets" : "Suggested category",
            stock: 0,
            status: "DRAFT"
          },
          preview: {
            productTitle: title,
            shortDescription:
              "Authentic South Indian speciality, carefully sourced and packed fresh for delivery.",
            seoKeywords: [
              title.toLowerCase(),
              "south indian products online",
              "authentic south indian store"
            ],
            metaTitle: `${title} Online | DakshinKart`,
            metaDescription: `Buy authentic ${title} online from DakshinKart with trusted delivery across India.`,
            suggestedPrice: price,
            suggestedDiscountPrice: Math.round(price * 0.9),
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
          }
        })
      ],
      suggestions: [
        "Upload product images",
        "Add opening stock",
        "Create 250g and 1kg variants"
      ]
    };
  }

  if (lower.includes("blog") || lower.includes("buying guide")) {
    const topic =
      command.replace(/write (seo )?blog (on|about)?/i, "").trim() ||
      "Best South Indian snacks";
    return {
      mode: "PROPOSAL",
      response:
        "The article outline, SEO metadata and publishing draft are ready. Approval creates it as a scheduled CMS draft.",
      proposals: [
        proposal({
          type: "CREATE_BLOG",
          title: `Create SEO article: ${topic}`,
          description: "Creates a CMS article draft; it will not publish automatically.",
          riskLevel: "LOW",
          targetType: "BlogPost",
          input: { topic, status: "DRAFT" },
          preview: {
            title: `${topic}: A DakshinKart Buying Guide`,
            focusKeyword: topic.toLowerCase(),
            outline: [
              "What makes South Indian snacks distinctive",
              "Regional favourites worth trying",
              "How to choose fresh, authentic products",
              "Storage and serving suggestions"
            ],
            estimatedWords: 1200,
            publishingStatus: "Draft only"
          }
        })
      ]
    };
  }

  if (lower.includes("coupon") || lower.includes("discount")) {
    const value = percent(command) ?? 10;
    const festival =
      ["diwali", "onam", "pongal", "ugadi"].find((item) =>
        lower.includes(item)
      ) ?? "festival";
    const code = `${festival.toUpperCase()}${value}`;
    return {
      mode: "PROPOSAL",
      response:
        "I prepared the discount rule with limits and an expiry safeguard. It requires approval before becoming active.",
      proposals: [
        proposal({
          type: "CREATE_COUPON",
          title: `Activate ${code} coupon`,
          description: `${value}% campaign coupon for ${festival}.`,
          riskLevel: "HIGH",
          targetType: "Coupon",
          input: {
            code,
            type: "PERCENTAGE",
            value,
            minOrderValue: 999,
            maxDiscount: 1000,
            usageLimit: 5000,
            status: "ACTIVE"
          },
          preview: {
            code,
            customerSaving: `${value}% up to ₹1,000`,
            minimumOrder: "₹999",
            audience: "All eligible customers",
            projectedMarginImpact: "-3.8%"
          }
        })
      ]
    };
  }

  if (
    lower.includes("send whatsapp") ||
    lower.includes("message to pending") ||
    lower.includes("abandoned cart reminder")
  ) {
    return {
      mode: "PROPOSAL",
      response:
        "I prepared a WhatsApp audience and message preview. No customer will be contacted until an authorized admin approves it.",
      proposals: [
        proposal({
          type: "SEND_WHATSAPP",
          title: "Send WhatsApp recovery campaign",
          description: "Sends a personalized reminder to the selected customer segment.",
          riskLevel: "HIGH",
          targetType: "CustomerSegment",
          input: { segment: "Pending / abandoned customers", audienceSize: 28 },
          preview: {
            recipients: 28,
            message:
              "Namaste {{first_name}}, your DakshinKart selection is still waiting. Complete your order today and use AURA10 for a welcome saving.",
            productLinks: true,
            unsubscribeHandling: true
          }
        })
      ]
    };
  }

  if (
    lower.includes("post") &&
    (lower.includes("instagram") ||
      lower.includes("facebook") ||
      lower.includes("social"))
  ) {
    const channel = lower.includes("instagram") ? "Instagram" : "Facebook";
    return {
      mode: "PROPOSAL",
      response:
        `I created a ${channel} post draft with caption, hashtags and scheduling options. It will remain unpublished until approval.`,
      proposals: [
        proposal({
          type: "PUBLISH_SOCIAL",
          title: `Publish product post on ${channel}`,
          description: "Publishes approved campaign content through the connected business account.",
          riskLevel: "HIGH",
          targetType: "SocialChannel",
          input: { channel, schedule: "Next recommended slot" },
          preview: {
            caption:
              "A taste of the South, packed fresh and delivered to your door. Discover this week's DakshinKart favourites.",
            hashtags: [
              "#DakshinKart",
              "#SouthIndianFood",
              "#FilterCoffee",
              "#AuthenticIndia"
            ],
            scheduledFor: "Tomorrow, 7:30 PM IST"
          }
        })
      ]
    };
  }

  if (lower.includes("improve seo") || lower.includes("missing meta")) {
    return {
      mode: "PROPOSAL",
      response:
        "I audited the requested catalog group and prepared metadata changes. The current live values stay unchanged until approval.",
      proposals: [
        proposal({
          type: "BULK_UPDATE_SEO",
          title: "Improve SEO for 24 spice products",
          description: "Updates titles, descriptions, canonical URLs and product schema.",
          riskLevel: "MEDIUM",
          targetType: "ProductCollection",
          input: { category: "Spices & Masala", affectedProducts: 24 },
          preview: {
            affectedProducts: 24,
            missingDescriptionsFixed: 8,
            titleLengthIssuesFixed: 11,
            schemaEnhancements: 24,
            estimatedScoreChange: "74 → 91"
          }
        })
      ]
    };
  }

  if (lower.includes("banner")) {
    return {
      mode: "PROPOSAL",
      response:
        "Festival banner copy is ready as a draft. Approval will add it to the homepage banner manager, not publish it immediately.",
      proposals: [
        proposal({
          type: "CREATE_BANNER",
          title: "Create festival homepage banner",
          description: "Adds campaign creative copy to the banner manager as a draft.",
          riskLevel: "LOW",
          targetType: "Banner",
          input: { placement: "HOMEPAGE_HERO", status: "DRAFT" },
          preview: {
            eyebrow: "A festival of southern flavour",
            headline: "Celebrate with something truly from home.",
            subheading:
              "Fresh sweets, estate coffee and meaningful gifts, delivered everywhere.",
            cta: "Shop festival favourites"
          }
        })
      ]
    };
  }

  if (lower.includes("low stock")) {
    return {
      mode: "READ_ONLY",
      response:
        "12 products are below their reorder point. Three may stock out within 72 hours.",
      proposals: [],
      data: {
        products: [
          { name: "Temple Town Mysore Pak", available: 23, reorderAt: 30 },
          { name: "Brass Nilavilakku", available: 7, reorderAt: 10 },
          { name: "Kanchipuram Silk Stole", available: 5, reorderAt: 8 }
        ]
      },
      suggestions: ["Create purchase order", "Pause low-stock ads"]
    };
  }

  if (lower.includes("today") && lower.includes("order")) {
    return {
      mode: "READ_ONLY",
      response:
        "Today there are 186 orders worth ₹8,42,680. 42 are processing, 64 await shipment and 11 have pending payments.",
      proposals: [],
      data: {
        totalOrders: 186,
        revenue: "₹8,42,680",
        processing: 42,
        pendingShipments: 64,
        pendingPayments: 11
      },
      suggestions: ["Show pending orders", "Show payment failures"]
    };
  }

  if (lower.includes("delayed") || lower.includes("track shipment")) {
    return {
      mode: "READ_ONLY",
      response:
        "Seven shipments have crossed their courier SLA. Two international orders are awaiting customs clearance.",
      proposals: [],
      data: {
        delayed: 7,
        highPriority: 3,
        shipments: ["SH-88411", "SH-88398", "SH-88372"]
      },
      suggestions: ["Prepare customer updates", "Review courier performance"]
    };
  }

  return {
    mode: "CLARIFICATION",
    response:
      "I can manage products, SEO, content, offers, customers, orders, delivery and connected sales channels. Tell me the business outcome and the item, audience or date involved.",
    proposals: [],
    suggestions: [
      "Show low stock products",
      "Create 20% Diwali coupon",
      "Write SEO blog on South Indian snacks",
      "Show today's orders"
    ]
  };
}
