import { authorize } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await authorize("settings:manage");
  if (access.error) return access.error;
  const { id } = await params;
  try {
    const item = await prisma.integrationRetry.update({
      where: { id },
      data: { status: "PENDING", nextRunAt: new Date(), attempts: { increment: 1 } }
    });
    return Response.json({ item, note: "Retry queued for the worker." });
  } catch {
    return Response.json({ error: "Retry record was not found." }, { status: 404 });
  }
}
