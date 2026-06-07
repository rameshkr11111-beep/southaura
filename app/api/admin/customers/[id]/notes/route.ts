import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/api-auth";
import { writeAuditLog } from "@/lib/audit";

const noteInput = z.object({
  body: z.string().min(2).max(3000)
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await authorize("customers:manage");
  if (access.error) return access.error;
  const parsed = noteInput.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { id } = await params;
  const note = await prisma.customerNote.create({
    data: {
      customerId: id,
      body: parsed.data.body,
      authorName: access.session.user.name ?? access.session.user.email ?? "Admin"
    }
  });
  await writeAuditLog({
    userId: access.session.user.id,
    action: "ADD_NOTE",
    entity: "Customer",
    entityId: id
  });
  return Response.json(note, { status: 201 });
}
