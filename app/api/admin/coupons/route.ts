import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/api-auth";
import { couponInput } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";

export async function GET() {
  const access = await authorize("marketing:manage");
  if (access.error) return access.error;
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return Response.json({ items: coupons });
}

export async function POST(request: Request) {
  const access = await authorize("marketing:manage");
  if (access.error) return access.error;
  const parsed = couponInput.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const coupon = await prisma.coupon.create({ data: parsed.data });
  await writeAuditLog({
    userId: access.session.user.id,
    action: "CREATE",
    entity: "Coupon",
    entityId: coupon.id,
    metadata: { code: coupon.code }
  });
  return Response.json(coupon, { status: 201 });
}
