import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/api-auth";

export async function GET() {
  const access = await authorize("dashboard:view");
  if (access.error) return access.error;
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [ordersToday, customers, pendingShipments, lowStock, revenue] =
    await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.customer.count(),
      prisma.shipment.count({
        where: { status: { in: ["PENDING", "LABEL_CREATED"] } }
      }),
      prisma.product.count({
        where: { trackInventory: true, stock: { lte: 10 } }
      }),
      prisma.order.aggregate({
        _sum: { grandTotal: true },
        where: {
          createdAt: { gte: startOfDay },
          paymentStatus: "PAID"
        }
      })
    ]);

  return Response.json({
    ordersToday,
    customers,
    pendingShipments,
    lowStock,
    revenueToday: revenue._sum.grandTotal ?? 0
  });
}
