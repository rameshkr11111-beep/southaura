import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendGa4Event } from "@/lib/integrations/analytics";

const schema = z.object({
  eventName: z.enum(["page_view", "view_item", "add_to_cart", "begin_checkout", "purchase", "search", "generate_lead"]),
  sessionId: z.string().max(200).optional(),
  page: z.string().max(500).optional(),
  productRef: z.string().max(200).optional(),
  value: z.number().nonnegative().optional(),
  currency: z.string().length(3).default("INR"),
  metadata: z.record(z.unknown()).optional()
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    await prisma.analyticsEvent.create({
      data: {
        ...parsed.data,
        metadata: parsed.data.metadata as Prisma.InputJsonValue | undefined
      }
    });
  } catch {}
  void sendGa4Event({
    clientId: parsed.data.sessionId ?? crypto.randomUUID(),
    name: parsed.data.eventName,
    params: {
      page_location: parsed.data.page,
      item_id: parsed.data.productRef,
      value: parsed.data.value,
      currency: parsed.data.currency,
      ...parsed.data.metadata
    }
  }).catch(() => null);
  return Response.json({ accepted: true }, { status: 202 });
}
