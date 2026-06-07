import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/api-auth";

export async function GET(request: Request) {
  const access = await authorize("orders:manage");
  if (access.error) return access.error;
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
  const take = Math.min(Number(searchParams.get("limit") ?? 25), 100);
  const where = status
    ? { status: status as "PENDING" | "CONFIRMED" | "PROCESSING" | "PACKED" | "SHIPPED" | "OUT_FOR_DELIVERY" | "DELIVERED" | "RETURN_REQUESTED" | "RETURNED" | "CANCELLED" | "REFUNDED" }
    : {};
  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { customer: true, items: true, payments: true, shipments: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * take,
      take
    }),
    prisma.order.count({ where })
  ]);
  return Response.json({ items, pagination: { page, take, total } });
}
