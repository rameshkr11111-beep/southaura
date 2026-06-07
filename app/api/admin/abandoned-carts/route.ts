import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/api-auth";

export async function GET(request: Request) {
  const access = await authorize("customers:manage");
  if (access.error) return access.error;
  const status =
    new URL(request.url).searchParams.get("status") ?? "ABANDONED";
  const carts = await prisma.abandonedCart.findMany({
    where: status === "ALL" ? {} : { status },
    include: { customer: true },
    orderBy: { lastActivityAt: "desc" },
    take: 100
  });
  return Response.json({ items: carts });
}
