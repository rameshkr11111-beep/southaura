import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/api-auth";
import { orderUpdateInput } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await authorize("orders:manage");
  if (access.error) return access.error;
  const parsed = orderUpdateInput.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { id } = await params;
  const order = await prisma.order.update({
    where: { id },
    data: parsed.data,
    include: { items: true, payments: true, shipments: true }
  });
  await writeAuditLog({
    userId: access.session.user.id,
    action: "UPDATE_STATUS",
    entity: "Order",
    entityId: id,
    metadata: parsed.data
  });
  return Response.json(order);
}
