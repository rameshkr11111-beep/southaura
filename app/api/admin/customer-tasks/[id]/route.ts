import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/api-auth";
import { writeAuditLog } from "@/lib/audit";

const taskUpdate = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  assignedToId: z.string().nullable().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  dueAt: z.coerce.date().nullable().optional()
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await authorize("customers:manage");
  if (access.error) return access.error;
  const parsed = taskUpdate.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { id } = await params;
  const task = await prisma.customerTask.update({
    where: { id },
    data: {
      ...parsed.data,
      completedAt:
        parsed.data.status === "COMPLETED" ? new Date() : undefined
    }
  });
  await writeAuditLog({
    userId: access.session.user.id,
    action: "UPDATE",
    entity: "CustomerTask",
    entityId: id,
    metadata: parsed.data
  });
  return Response.json(task);
}
