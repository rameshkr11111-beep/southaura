import { z } from "zod";
import { prisma } from "@/lib/prisma";

const inputSchema = z.object({
  conversationId: z.string().optional(),
  name: z.string().min(2),
  companyName: z.string().optional(),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal("")),
  city: z.string().optional(),
  productInterest: z.string().min(2),
  productSlug: z.string().optional(),
  category: z.string().optional(),
  quantity: z.coerce.number().int().positive().max(10000).optional(),
  estimatedValue: z.coerce.number().nonnegative().optional(),
  page: z.string().optional(),
  source: z.string().max(80).optional(),
  campaign: z.string().max(120).optional(),
  medium: z.string().max(80).optional(),
  requirement: z.string().max(200).optional(),
  preferredContact: z.string().max(40).optional(),
  consent: z.literal("yes").optional(),
  notes: z.string().max(2000).optional()
});

export async function POST(request: Request) {
  const parsed = inputSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    const {
      productSlug,
      category,
      quantity,
      page,
      campaign,
      medium,
      requirement,
      preferredContact,
      consent,
      estimatedValue,
      ...leadData
    } = parsed.data;
    const context = {
      productSlug,
      category,
      quantity,
      page,
      campaign,
      medium,
      requirement,
      preferredContact,
      consent: consent === "yes",
      customerNotes: leadData.notes
    };
    const lead = await prisma.supportLead.create({
      data: {
        ...leadData,
        email: leadData.email || undefined,
        source: parsed.data.source ?? "AI_CHAT",
        estimatedValue,
        notes: JSON.stringify(context)
      }
    });
    return Response.json({ id: lead.id, status: lead.status }, { status: 201 });
  } catch {
    if (process.env.NODE_ENV === "production") {
      return Response.json(
        { error: "Lead storage is not configured. Please use WhatsApp for immediate assistance." },
        { status: 503 }
      );
    }
    return Response.json({ id: `demo-lead-${Date.now()}`, status: "NEW", demo: true }, { status: 201 });
  }
}
