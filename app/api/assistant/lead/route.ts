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
  notes: z.string().max(2000).optional()
});

export async function POST(request: Request) {
  const parsed = inputSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    const lead = await prisma.supportLead.create({
      data: {
        ...parsed.data,
        email: parsed.data.email || undefined,
        source: "AI_CHAT"
      }
    });
    return Response.json({ id: lead.id, status: lead.status }, { status: 201 });
  } catch {
    return Response.json({ id: `demo-lead-${Date.now()}`, status: "NEW", demo: true }, { status: 201 });
  }
}
