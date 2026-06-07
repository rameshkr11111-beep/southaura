import { prisma } from "@/lib/prisma";
import type { AgentPlan } from "@/lib/ai-manager/types";

export async function enrichWithBusinessData(
  command: string,
  plan: AgentPlan
): Promise<AgentPlan> {
  const lower = command.toLowerCase();
  try {
    if (lower.includes("low stock")) {
      const products = await prisma.product.findMany({
        where: { status: { not: "ARCHIVED" } },
        orderBy: { stock: "asc" },
        take: 12,
        select: { id: true, name: true, sku: true, stock: true, lowStockAt: true }
      });
      const lowStock = products.filter((item) => item.stock <= item.lowStockAt);
      return {
        ...plan,
        mode: "READ_ONLY",
        response: `${lowStock.length} products are currently at or below their reorder point.`,
        proposals: [],
        data: { products: lowStock }
      };
    }

    if (lower.includes("today") && lower.includes("order")) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const [orders, totals] = await Promise.all([
        prisma.order.count({ where: { createdAt: { gte: start } } }),
        prisma.order.aggregate({
          where: { createdAt: { gte: start } },
          _sum: { grandTotal: true }
        })
      ]);
      return {
        ...plan,
        mode: "READ_ONLY",
        response: `Today there are ${orders} orders with INR ${Number(totals._sum.grandTotal ?? 0).toLocaleString("en-IN")} in revenue.`,
        proposals: [],
        data: { totalOrders: orders, revenue: Number(totals._sum.grandTotal ?? 0) }
      };
    }

    if (lower.includes("vip") || lower.includes("customer segment")) {
      const customers = await prisma.customer.findMany({
        orderBy: { lifetimeValue: "desc" },
        take: 10,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          orderCount: true,
          lifetimeValue: true,
          tags: true
        }
      });
      return { ...plan, mode: "READ_ONLY", proposals: [], data: { customers } };
    }
  } catch {
    // The deterministic plan remains usable when PostgreSQL is unavailable.
  }
  return plan;
}
