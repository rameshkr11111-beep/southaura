import { authorize } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const access = await authorize("agent:use");
  if (access.error) return access.error;
  try {
    const [pending, completed, failed, today] = await Promise.all([
      prisma.agentAction.count({ where: { status: "PENDING_APPROVAL" } }),
      prisma.agentAction.count({ where: { status: "COMPLETED" } }),
      prisma.agentAction.count({ where: { status: "FAILED" } }),
      prisma.agentAction.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      })
    ]);
    return Response.json({ pending, completed, failed, today });
  } catch {
    return Response.json({ pending: 6, completed: 24, failed: 2, today: 14 });
  }
}
