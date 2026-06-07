import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createLocalReply } from "@/lib/customer-assistant/engine";
import { detectLanguage } from "@/lib/customer-assistant/knowledge";
import { createProviderReply } from "@/lib/customer-assistant/provider";

const inputSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationId: z.string().optional(),
  visitorId: z.string().min(3).max(200).optional(),
  channel: z.enum(["WEBSITE", "WHATSAPP", "MOBILE_APP", "MESSENGER", "INSTAGRAM"]).default("WEBSITE"),
  language: z.string().optional(),
  page: z.string().max(500).optional(),
  cart: z.array(z.object({ name: z.string(), quantity: z.number(), price: z.number() })).max(25).optional(),
  wishlist: z.array(z.object({ name: z.string(), price: z.number() })).max(25).optional()
});

const rateLimit = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  const parsed = inputSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  const key = parsed.data.visitorId ?? request.headers.get("x-forwarded-for") ?? "anonymous";
  const now = Date.now();
  const current = rateLimit.get(key);
  if (current && current.resetAt > now && current.count >= 30) {
    return Response.json({ error: "Too many messages. Please try again shortly." }, { status: 429 });
  }
  rateLimit.set(key, current && current.resetAt > now ? { ...current, count: current.count + 1 } : { count: 1, resetAt: now + 60000 });

  const language = detectLanguage(parsed.data.message, parsed.data.language);
  const local = createLocalReply(parsed.data.message, language);
  const providerReply = await createProviderReply({
    message: parsed.data.message,
    language,
    groundedReply: local.reply,
    context: {
      products: local.products,
      articles: local.articles,
      cart: parsed.data.cart,
      wishlist: parsed.data.wishlist,
      page: parsed.data.page,
      safety: {
        refundApproval: false,
        priceChange: false,
        privateOrderDataRequiresVerification: true
      }
    }
  }).catch(() => null);

  let conversationId = parsed.data.conversationId;
  try {
    let conversation = conversationId
      ? await prisma.conversation.findUnique({ where: { id: conversationId } })
      : null;
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          channel: parsed.data.channel,
          visitorId: parsed.data.visitorId,
          locale: language,
          subject: parsed.data.message.slice(0, 100),
          status: local.escalated ? "WAITING_FOR_HUMAN" : "OPEN",
          humanTakeover: Boolean(local.escalated),
          aiEnabled: !local.escalated,
          metadata: {
            page: parsed.data.page,
            cart: parsed.data.cart ?? [],
            wishlist: parsed.data.wishlist ?? []
          } as Prisma.InputJsonValue
        }
      });
    }
    conversationId = conversation.id;
    await prisma.message.createMany({
      data: [
        {
          conversationId,
          direction: "INBOUND",
          senderType: "CUSTOMER",
          body: parsed.data.message,
          language,
          metadata: { channel: parsed.data.channel } as Prisma.InputJsonValue
        },
        {
          conversationId,
          direction: "OUTBOUND",
          senderType: "AI",
          body: providerReply ?? local.reply,
          language,
          aiGenerated: true,
          providerStatus: "DELIVERED",
          metadata: {
            intent: local.intent,
            products: local.products?.map((product) => product.id) ?? [],
            requiresVerification: local.requiresVerification ?? false
          } as Prisma.InputJsonValue
        }
      ]
    });
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        locale: language,
        status: local.escalated ? "WAITING_FOR_HUMAN" : conversation.status,
        humanTakeover: local.escalated ? true : conversation.humanTakeover,
        aiEnabled: local.escalated ? false : conversation.aiEnabled
      }
    });
  } catch {
    conversationId ??= `demo-support-${Date.now()}`;
  }

  return Response.json({
    ...local,
    reply: providerReply ?? local.reply,
    conversationId,
    language,
    provider: providerReply ? "OPENAI" : "LOCAL"
  });
}
