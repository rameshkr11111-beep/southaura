import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/api-auth";
import { productInput } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";

export async function GET(request: Request) {
  const access = await authorize("catalog:manage");
  if (access.error) return access.error;
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const status = searchParams.get("status");
  const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
  const take = Math.min(Number(searchParams.get("limit") ?? 25), 100);

  const where = {
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { sku: { contains: query, mode: "insensitive" as const } }
          ]
        }
      : {}),
    ...(status ? { status: status as "DRAFT" | "ACTIVE" | "OUT_OF_STOCK" | "ARCHIVED" } : {})
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, variants: true, media: true },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * take,
      take
    }),
    prisma.product.count({ where })
  ]);

  return Response.json({ items, pagination: { page, take, total } });
}

export async function POST(request: Request) {
  const access = await authorize("catalog:manage");
  if (access.error) return access.error;
  const parsed = productInput.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const product = await prisma.product.create({ data: parsed.data });
  await writeAuditLog({
    userId: access.session.user.id,
    action: "CREATE",
    entity: "Product",
    entityId: product.id,
    metadata: { sku: product.sku }
  });
  return Response.json(product, { status: 201 });
}
