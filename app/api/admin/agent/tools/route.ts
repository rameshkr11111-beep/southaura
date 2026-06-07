import { z } from "zod";
import { Prisma } from "@prisma/client";
import { authorize } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";

const toolCatalog = [
  ["website_database", "Website database", "DATA", "DATABASE_URL"],
  ["product_catalog", "Product catalog", "DATA", "DATABASE_URL"],
  ["orders_database", "Orders database", "DATA", "DATABASE_URL"],
  ["customers_database", "Customers database", "DATA", "DATABASE_URL"],
  ["whatsapp", "WhatsApp Business API", "MESSAGING", "WHATSAPP_ACCESS_TOKEN"],
  ["facebook", "Facebook Page", "SOCIAL", "FACEBOOK_ACCESS_TOKEN"],
  ["instagram", "Instagram Business", "SOCIAL", "INSTAGRAM_ACCESS_TOKEN"],
  ["youtube", "YouTube Shorts", "SOCIAL", "YOUTUBE_API_KEY"],
  ["google_analytics", "Google Analytics", "ANALYTICS", "GOOGLE_ANALYTICS_CREDENTIALS"],
  ["search_console", "Google Search Console", "SEO", "GOOGLE_SEARCH_CONSOLE_CREDENTIALS"],
  ["razorpay", "Razorpay", "PAYMENT", "RAZORPAY_KEY_SECRET"],
  ["shiprocket", "Shiprocket", "DELIVERY", "SHIPROCKET_TOKEN"],
  ["smtp", "Email SMTP", "MESSAGING", "SMTP_PASSWORD"],
  ["sms", "SMS gateway", "MESSAGING", "SMS_API_KEY"],
  ["openai", "OpenAI-compatible provider", "AI", "OPENAI_API_KEY"]
];

const updateInput = z.object({
  provider: z.string().min(2),
  status: z.enum(["CONNECTED", "DISCONNECTED"]),
  secretRef: z.string().min(2).optional(),
  settings: z.record(z.unknown()).optional()
});

export async function GET() {
  const access = await authorize("agent:configure");
  if (access.error) return access.error;
  let stored: Array<{
    provider: string;
    status: string;
    secretRef: string | null;
    lastSyncAt: Date | null;
  }> = [];
  try {
    stored = await prisma.integration.findMany({
      select: {
        provider: true,
        status: true,
        secretRef: true,
        lastSyncAt: true
      }
    });
  } catch {
    // Return environment-aware tool catalog without a database.
  }

  return Response.json({
    items: toolCatalog.map(([provider, name, category, defaultSecretRef]) => {
      const saved = stored.find((item) => item.provider === provider);
      const secretRef = saved?.secretRef ?? defaultSecretRef;
      return {
        provider,
        name,
        category,
        status:
          saved?.status === "CONNECTED" || Boolean(process.env[secretRef])
            ? "CONNECTED"
            : "DISCONNECTED",
        secretRef,
        configured: Boolean(process.env[secretRef]),
        lastSyncAt: saved?.lastSyncAt ?? null
      };
    })
  });
}

export async function PUT(request: Request) {
  const access = await authorize("agent:configure");
  if (access.error) return access.error;
  const parsed = updateInput.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const settings = (parsed.data.settings ?? {}) as Prisma.InputJsonValue;
  const integration = await prisma.integration.upsert({
    where: { provider: parsed.data.provider },
    update: {
      status: parsed.data.status,
      secretRef: parsed.data.secretRef,
      settings
    },
    create: {
      provider: parsed.data.provider,
      category: "AGENT_TOOL",
      status: parsed.data.status,
      secretRef: parsed.data.secretRef,
      settings
    },
    select: {
      id: true,
      provider: true,
      category: true,
      status: true,
      secretRef: true,
      settings: true,
      lastSyncAt: true
    }
  });
  await writeAuditLog({
    userId: access.session.user.id,
    action: "AGENT_TOOL_CONFIGURE",
    entity: "Integration",
    entityId: integration.id,
    metadata: {
      provider: integration.provider,
      status: integration.status,
      secretRef: integration.secretRef
    }
  });
  return Response.json(integration);
}
