import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/api-auth";
import { customerInput } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await authorize("customers:manage");
  if (access.error) return access.error;
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      addresses: true,
      notes: { orderBy: { createdAt: "desc" } },
      orders: {
        include: { items: true, payments: true, shipments: true },
        orderBy: { createdAt: "desc" }
      },
      segments: { include: { segment: true } },
      loyaltyEntries: { orderBy: { createdAt: "desc" }, take: 20 },
      conversations: {
        include: {
          messages: { orderBy: { createdAt: "desc" }, take: 20 }
        },
        orderBy: { lastMessageAt: "desc" }
      },
      tasks: { orderBy: [{ status: "asc" }, { dueAt: "asc" }] },
      abandonedCarts: { orderBy: { lastActivityAt: "desc" }, take: 10 }
    }
  });
  if (!customer) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(customer);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await authorize("customers:manage");
  if (access.error) return access.error;
  const parsed = customerInput.partial().safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { id } = await params;
  const customer = await prisma.customer.update({
    where: { id },
    data: parsed.data
  });
  await writeAuditLog({
    userId: access.session.user.id,
    action: "UPDATE",
    entity: "Customer",
    entityId: id,
    metadata: parsed.data
  });
  return Response.json(customer);
}
