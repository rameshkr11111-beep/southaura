import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/api-auth";

const schema = z.object({
  channel: z.enum(["WHATSAPP", "EMAIL", "SMS"]),
  recipient: z.string().min(3),
  subject: z.string().max(200).optional(),
  content: z.string().min(1).max(10000),
  template: z.string().optional(),
  payload: z.record(z.unknown()).optional()
});

export async function POST(request: Request) {
  const access = await authorize("marketing:manage");
  if (access.error) return access.error;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  const message = await prisma.outboundMessage.create({
    data: {
      ...parsed.data,
      status: "PENDING_APPROVAL",
      requiresApproval: true,
      payload: parsed.data.payload as Prisma.InputJsonValue | undefined
    }
  });
  return Response.json({ item: message, note: "Admin approval is required before sending." }, { status: 201 });
}
