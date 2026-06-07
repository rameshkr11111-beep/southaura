import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/api-auth";
import { productInput } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await authorize("catalog:manage");
  if (access.error) return access.error;
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      variants: true,
      media: true,
      reviews: true,
      seo: true,
      inventoryMoves: { take: 20, orderBy: { createdAt: "desc" } }
    }
  });
  if (!product) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(product);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await authorize("catalog:manage");
  if (access.error) return access.error;
  const parsed = productInput.partial().safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { id } = await params;
  const product = await prisma.product.update({
    where: { id },
    data: parsed.data
  });
  await writeAuditLog({
    userId: access.session.user.id,
    action: "UPDATE",
    entity: "Product",
    entityId: id,
    metadata: parsed.data
  });
  return Response.json(product);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await authorize("catalog:manage");
  if (access.error) return access.error;
  const { id } = await params;
  const product = await prisma.product.update({
    where: { id },
    data: { status: "ARCHIVED" }
  });
  await writeAuditLog({
    userId: access.session.user.id,
    action: "ARCHIVE",
    entity: "Product",
    entityId: id
  });
  return Response.json(product);
}
