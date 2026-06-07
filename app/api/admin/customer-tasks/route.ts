import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/api-auth";
import { writeAuditLog } from "@/lib/audit";

const taskInput = z.object({
  customerId: z.string().min(1),
  assignedToId: z.string().optional(),
  title: z.string().min(2),
  description: z.string().optional(),
  type: z.string().default("FOLLOW_UP"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  dueAt: z.coerce.date().optional()
});

export async function GET(request: Request) {
  const access = await authorize("customers:manage");
  if (access.error) return access.error;
  const status = new URL(request.url).searchParams.get("status") ?? "OPEN";
  const tasks = await prisma.customerTask.findMany({
    where: status === "ALL" ? {} : { status },
    include: { customer: true, assignedTo: true },
    orderBy: [{ dueAt: "asc" }, { priority: "desc" }],
    take: 100
  });
  return Response.json({ items: tasks });
}

export async function POST(request: Request) {
  const access = await authorize("customers:manage");
  if (access.error) return access.error;
  const parsed = taskInput.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const task = await prisma.customerTask.create({ data: parsed.data });
  await writeAuditLog({
    userId: access.session.user.id,
    action: "CREATE",
    entity: "CustomerTask",
    entityId: task.id,
    metadata: { customerId: task.customerId, priority: task.priority }
  });
  return Response.json(task, { status: 201 });
}
