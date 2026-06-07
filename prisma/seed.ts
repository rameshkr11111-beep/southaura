import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@southaura.in";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "DakshinKart Admin",
      passwordHash,
      role: Role.SUPER_ADMIN,
      status: "ACTIVE"
    },
    create: {
      name: "DakshinKart Admin",
      email: adminEmail,
      passwordHash,
      role: Role.SUPER_ADMIN,
      status: "ACTIVE"
    }
  });

  const categorySeeds = [
    ["South Indian Groceries", "south-indian-groceries"],
    ["Namkeen & Snacks", "namkeen-snacks"],
    ["Sweets", "sweets"],
    ["Sarees & Garments", "sarees-garments"],
    ["Pooja Items", "pooja-items"],
    ["Ayurvedic Products", "ayurvedic-products"],
    ["Home & Kitchen", "home-kitchen"],
    ["Spices & Masala", "spices-masala"],
    ["Pickles & Papad", "pickles-papad"],
    ["Coffee & Tea", "coffee-tea"]
  ];

  const categories = new Map<string, string>();
  for (const [name, slug] of categorySeeds) {
    const category = await prisma.category.upsert({
      where: { slug },
      update: { name, status: "ACTIVE" },
      create: { name, slug, status: "ACTIVE" }
    });
    categories.set(slug, category.id);
  }

  const supplier = await prisma.supplier.upsert({
    where: { code: "KODAGU-EST-01" },
    update: { status: "ACTIVE" },
    create: {
      name: "Kodagu Estate Collective",
      code: "KODAGU-EST-01",
      contactName: "Vikram Rao",
      email: "trade@kodagu.example",
      phone: "+91 98765 43210",
      paymentTerms: "Net 30",
      rating: 4.9,
      status: "ACTIVE"
    }
  });

  const product = await prisma.product.upsert({
    where: { sku: "DK-CF-1001" },
    update: { stock: 342, status: "ACTIVE" },
    create: {
      name: "Coorg Estate Filter Coffee",
      slug: "coorg-estate-filter-coffee",
      sku: "DK-CF-1001",
      barcode: "8901234561001",
      shortDescription: "Rich 80:20 coffee-chicory blend from Coorg.",
      description:
        "Shade-grown coffee, slow roasted for a full-bodied South Indian decoction.",
      categoryId: categories.get("coffee-tea"),
      supplierId: supplier.id,
      price: 449,
      compareAtPrice: 525,
      costPrice: 238,
      wholesalePrice: 359,
      distributorPrice: 329,
      stock: 342,
      lowStockAt: 50,
      taxRate: 5,
      hsnCode: "0901",
      status: "ACTIVE",
      featured: true,
      media: {
        create: {
          url: "https://images.unsplash.com/photo-1447933601403-0c6688de566e",
          alt: "Coorg Estate Filter Coffee"
        }
      },
      seo: {
        create: {
          metaTitle: "Coorg Filter Coffee Online | DakshinKart",
          metaDescription:
            "Shop authentic Coorg filter coffee, roasted fresh and delivered across India.",
          focusKeyword: "filter coffee online",
          score: 96
        }
      }
    }
  });

  const customer = await prisma.customer.upsert({
    where: { email: "meera@example.com" },
    update: { lifetimeValue: 42680, totalSpent: 42680, orderCount: 18 },
    create: {
      firstName: "Meera",
      lastName: "Khanna",
      email: "meera@example.com",
      phone: "+91 98111 22334",
      tags: ["VIP", "Coffee Lover", "Repeat Buyer"],
      source: "Organic Search",
      marketingOptIn: true,
      lifetimeValue: 42680,
      totalSpent: 42680,
      orderCount: 18,
      loyaltyPoints: 1840
    }
  });

  const customerPassword = process.env.CUSTOMER_DEMO_PASSWORD ?? "Welcome123!";
  const customerPasswordHash = await hash(customerPassword, 12);
  const customerUser = await prisma.user.upsert({
    where: { email: customer.email! },
    update: {
      name: `${customer.firstName} ${customer.lastName ?? ""}`.trim(),
      passwordHash: customerPasswordHash,
      role: Role.CUSTOMER,
      status: "ACTIVE"
    },
    create: {
      name: `${customer.firstName} ${customer.lastName ?? ""}`.trim(),
      email: customer.email!,
      passwordHash: customerPasswordHash,
      role: Role.CUSTOMER,
      status: "ACTIVE"
    }
  });
  await prisma.customer.update({
    where: { id: customer.id },
    data: { userId: customerUser.id }
  });

  const vendorEmail = process.env.VENDOR_DEMO_EMAIL ?? "vendor@southaura.in";
  const vendorPassword = process.env.VENDOR_DEMO_PASSWORD ?? "Vendor123!";
  const vendorPasswordHash = await hash(vendorPassword, 12);
  const vendorUser = await prisma.user.upsert({
    where: { email: vendorEmail },
    update: {
      name: "Ananya Iyer",
      passwordHash: vendorPasswordHash,
      role: Role.VENDOR,
      status: "ACTIVE"
    },
    create: {
      name: "Ananya Iyer",
      email: vendorEmail,
      passwordHash: vendorPasswordHash,
      role: Role.VENDOR,
      status: "ACTIVE"
    }
  });
  await prisma.vendorShop.upsert({
    where: { slug: "ananya-foods" },
    update: { ownerId: vendorUser.id, email: vendorEmail },
    create: {
      ownerId: vendorUser.id,
      name: "Ananya Foods",
      slug: "ananya-foods",
      legalName: "Ananya Traditional Foods",
      description: "Small-batch Kerala snacks and sweets made from family recipes.",
      email: vendorEmail,
      phone: "+91 98765 41020",
      gstin: "29ABCDE1234F1Z5",
      pan: "ABCDE1234F",
      address: {
        line1: "18 Market Road",
        city: "Kozhikode",
        state: "Kerala",
        postalCode: "673001",
        country: "India"
      },
      status: "PENDING_REVIEW",
      commissionRate: 12
    }
  });

  const existingTask = await prisma.customerTask.findFirst({
    where: { customerId: customer.id, title: "Confirm replacement delivery" }
  });
  if (!existingTask) {
    await prisma.customerTask.create({
      data: {
        customerId: customer.id,
        assignedToId: admin.id,
        title: "Confirm replacement delivery",
        description: "Check that the replacement coffee shipment is delivered.",
        priority: "HIGH",
        dueAt: new Date("2026-06-06T14:00:00+05:30")
      }
    });
  }

  const existingSupportConversation = await prisma.conversation.findFirst({
    where: { externalId: "seed-support-filter-coffee" }
  });
  if (!existingSupportConversation) {
    await prisma.conversation.create({
      data: {
        customerId: customer.id,
        channel: "WEBSITE",
        externalId: "seed-support-filter-coffee",
        locale: "en",
        subject: "Which filter coffee is best for gifting?",
        status: "OPEN",
        attributedRevenue: 449,
        metadata: { sourcePage: "/products/coorg-estate-filter-coffee" },
        messages: {
          create: [
            {
              direction: "INBOUND",
              senderType: "CUSTOMER",
              body: "Which filter coffee is best for gifting?"
            },
            {
              direction: "OUTBOUND",
              senderType: "AI",
              aiGenerated: true,
              body: "Coorg Estate Filter Coffee is the strongest gift option currently in stock.",
              metadata: { groundedProductSku: "DK-CF-1001" }
            }
          ]
        }
      }
    });
  }

  await prisma.abandonedCart.upsert({
    where: { recoveryToken: "demo-recovery-priya" },
    update: { status: "ABANDONED" },
    create: {
      email: "priya@example.com",
      phone: "+91 98200 11234",
      items: [
        { sku: "DK-CF-1001", name: "Coorg Estate Filter Coffee", quantity: 2 }
      ],
      itemCount: 2,
      subtotal: 898,
      recoveryToken: "demo-recovery-priya",
      status: "ABANDONED",
      lastActivityAt: new Date()
    }
  });

  await prisma.order.upsert({
    where: { orderNumber: "DK10482" },
    update: { status: "PROCESSING", paymentStatus: "PAID" },
    create: {
      orderNumber: "DK10482",
      customerId: customer.id,
      email: customer.email!,
      phone: customer.phone,
      status: "PROCESSING",
      paymentStatus: "PAID",
      subtotal: 2245,
      taxTotal: 103,
      shippingTotal: 0,
      grandTotal: 2348,
      shippingAddress: {
        firstName: "Meera",
        lastName: "Khanna",
        line1: "42 Golf Course Road",
        city: "Gurugram",
        state: "Haryana",
        postalCode: "122002",
        country: "India"
      },
      items: {
        create: {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          quantity: 5,
          unitPrice: product.price,
          taxAmount: 103,
          total: 2348
        }
      },
      payments: {
        create: {
          provider: "Razorpay",
          method: "UPI",
          transactionId: "pay_Q2f84Kx_seed",
          status: "PAID",
          amount: 2348,
          reconciled: true
        }
      }
    }
  });

  await prisma.coupon.upsert({
    where: { code: "AURA10" },
    update: { status: "ACTIVE" },
    create: {
      code: "AURA10",
      description: "First-order welcome saving",
      type: "PERCENTAGE",
      value: 10,
      maxDiscount: 500,
      usageLimit: 10000,
      firstOrderOnly: true,
      startsAt: new Date("2026-01-01"),
      expiresAt: new Date("2026-12-31"),
      status: "ACTIVE"
    }
  });

  const integrations = [
    ["razorpay", "PAYMENT"],
    ["stripe", "PAYMENT"],
    ["paypal", "PAYMENT"],
    ["whatsapp", "MESSAGING"],
    ["shiprocket", "DELIVERY"],
    ["delhivery", "DELIVERY"],
    ["openai", "AI"],
    ["google_analytics", "ANALYTICS"],
    ["search_console", "SEO"],
    ["facebook", "SOCIAL"],
    ["instagram", "SOCIAL"],
    ["email", "EMAIL"],
    ["sms", "SMS"]
  ];
  for (const [provider, category] of integrations) {
    const secretRefs: Record<string, string> = {
      razorpay: "RAZORPAY_KEY_SECRET",
      stripe: "STRIPE_SECRET_KEY",
      paypal: "PAYPAL_CLIENT_SECRET",
      whatsapp: "WHATSAPP_ACCESS_TOKEN",
      shiprocket: "SHIPROCKET_TOKEN",
      delhivery: "DELHIVERY_API_TOKEN",
      openai: "OPENAI_API_KEY",
      google_analytics: "GA_API_SECRET",
      search_console: "GOOGLE_SEARCH_CONSOLE_CREDENTIALS",
      facebook: "FACEBOOK_PAGE_ACCESS_TOKEN",
      instagram: "INSTAGRAM_ACCESS_TOKEN",
      email: "RESEND_API_KEY",
      sms: "MSG91_AUTH_KEY"
    };
    await prisma.integration.upsert({
      where: { provider },
      update: { category, secretRef: secretRefs[provider] },
      create: {
        provider,
        category,
        status: "DISCONNECTED",
        secretRef: secretRefs[provider]
      }
    });
  }

  const existingAgentAction = await prisma.agentAction.findFirst({
    where: {
      requestedById: admin.id,
      type: "CREATE_COUPON",
      title: "Activate DIWALI20 coupon"
    }
  });
  if (!existingAgentAction) {
    const conversation = await prisma.agentConversation.create({
    data: {
      title: "Diwali offer and catalog planning",
      userId: admin.id,
      messages: {
        create: [
          {
            role: "USER",
            content: "Create 20% discount coupon for Diwali"
          },
          {
            role: "ASSISTANT",
            content:
              "I prepared DIWALI20 with margin safeguards. It requires approval before activation.",
            metadata: { provider: "DEMO", mode: "PROPOSAL" }
          }
        ]
      }
    }
  });

  await prisma.agentAction.create({
    data: {
      conversationId: conversation.id,
      requestedById: admin.id,
      type: "CREATE_COUPON",
      title: "Activate DIWALI20 coupon",
      description: "20% discount with an INR 999 minimum order and INR 1,000 cap.",
      riskLevel: "HIGH",
      status: "PENDING_APPROVAL",
      targetType: "Coupon",
      input: {
        code: "DIWALI20",
        type: "PERCENTAGE",
        value: 20,
        minOrderValue: 999,
        maxDiscount: 1000
      },
      preview: {
        audience: "All eligible customers",
        projectedMarginImpact: "-3.8%",
        usageLimit: 5000
      }
    }
  });

  }

  const agentTemplates = [
    ["Daily business summary", "Show today's orders, revenue, delivery risks and revenue opportunities", "ANALYTICS", "Analytics"],
    ["Low-stock priority scan", "Show low stock products and recommend reorder priorities", "PRODUCT", "Inventory"],
    ["Catalog SEO audit", "Find active products with missing or weak SEO metadata", "SEO", "Growth"]
  ];
  for (const [name, command, specialist, category] of agentTemplates) {
    const existing = await prisma.agentTemplate.findFirst({
      where: { userId: admin.id, name }
    });
    if (!existing) {
      await prisma.agentTemplate.create({
        data: { userId: admin.id, name, command, specialist, category, shared: true }
      });
    }
  }

  const existingAgentTask = await prisma.agentTask.findFirst({
    where: { userId: admin.id, name: "Morning business briefing" }
  });
  if (!existingAgentTask) {
    await prisma.agentTask.create({
      data: {
        userId: admin.id,
        name: "Morning business briefing",
        command: "Review orders, revenue, stock, SEO and customer follow-ups",
        specialist: "MANAGER",
        schedule: "Every day at 9:00 AM",
        nextRunAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });
  }

  await prisma.siteSetting.upsert({
    where: { key: "store.profile" },
    update: {},
    create: {
      key: "store.profile",
      group: "STORE",
      value: {
        name: "DakshinKart",
        tagline: "Authentic South India, Delivered Everywhere",
        currency: "INR",
        timezone: "Asia/Kolkata"
      }
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "SEED",
      entity: "System",
      metadata: { version: "1.0.0" }
    }
  });

  console.log(`Seed complete. Admin: ${adminEmail}; Vendor: ${vendorEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
