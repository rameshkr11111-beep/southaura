import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/api-auth";

const schema = z.object({
  platform: z.enum(["FACEBOOK", "INSTAGRAM"]),
  content: z.string().min(1).max(2200),
  mediaUrl: z.string().url().optional(),
  scheduledAt: z.coerce.date().optional()
});

export async function POST(request: Request) {
  const access = await authorize("marketing:manage");
  if (access.error) return access.error;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  const post = await prisma.socialPost.create({
    data: { ...parsed.data, status: "PENDING_APPROVAL", requiresApproval: true }
  });
  return Response.json({ item: post, note: "Admin approval is required before publishing." }, { status: 201 });
}
