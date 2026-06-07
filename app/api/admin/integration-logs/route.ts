import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/api-auth";

export async function GET(request: Request) {
  const access = await authorize("settings:manage");
  if (access.error) return access.error;
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider");
  try {
    const [logs, retries, webhooks] = await Promise.all([
      prisma.apiCallLog.findMany({
        where: provider ? { provider } : undefined,
        orderBy: { createdAt: "desc" },
        take: 100
      }),
      prisma.integrationRetry.findMany({
        where: { status: { in: ["PENDING", "FAILED"] }, ...(provider ? { provider } : {}) },
        orderBy: { nextRunAt: "asc" },
        take: 50
      }),
      prisma.webhookEvent.findMany({
        where: provider ? { provider } : undefined,
        orderBy: { createdAt: "desc" },
        take: 50
      })
    ]);
    return Response.json({ logs, retries, webhooks });
  } catch {
    return Response.json({ logs: [], retries: [], webhooks: [], databaseReady: false });
  }
}
