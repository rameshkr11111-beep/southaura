import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/api-auth";
import { customerInput } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";

export async function GET(request: Request) {
  const access = await authorize("customers:manage");
  if (access.error) return access.error;
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const customers = await prisma.customer.findMany({
    where: query
      ? {
          OR: [
            { firstName: { contains: query, mode: "insensitive" } },
            { lastName: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { phone: { contains: query } }
          ]
        }
      : {},
    include: { orders: { take: 5, orderBy: { createdAt: "desc" } }, segments: { include: { segment: true } } },
    orderBy: { updatedAt: "desc" },
    take: 100
  });
  return Response.json({ items: customers });
}

export async function POST(request: Request) {
  const access = await authorize("customers:manage");
  if (access.error) return access.error;
  const parsed = customerInput.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const customer = await prisma.customer.create({ data: parsed.data });
  await writeAuditLog({
    userId: access.session.user.id,
    action: "CREATE",
    entity: "Customer",
    entityId: customer.id
  });
  return Response.json(customer, { status: 201 });
}
