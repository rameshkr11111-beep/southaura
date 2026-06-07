import { z } from "zod";
import { authorize } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { executeApprovedAction } from "@/lib/ai-manager/executor";
import { writeAuditLog } from "@/lib/audit";

const reviewInput = z.object({
  decision: z.enum(["APPROVE", "REJECT", "RETRY"]),
  executeNow: z.boolean().default(true),
  note: z.string().max(1000).optional()
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await authorize("agent:approve");
  if (access.error) return access.error;
  const parsed = reviewInput.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { id } = await params;

  if (id.startsWith("demo-")) {
    return Response.json({
      id,
      status: parsed.data.decision === "REJECT" ? "REJECTED" : "COMPLETED",
      demo: true,
      message:
        parsed.data.decision !== "REJECT"
          ? "Demo action approved. Connect PostgreSQL to persist and execute live actions."
          : "Demo action rejected."
    });
  }

  if (parsed.data.decision === "RETRY") {
    const retryAction = await prisma.agentAction.findUnique({ where: { id } });
    if (!retryAction || retryAction.status !== "FAILED") {
      return Response.json({ error: "Only failed actions can be retried." }, { status: 409 });
    }
    if (retryAction.retryCount >= retryAction.maxRetries) {
      return Response.json({ error: "Maximum retry count reached." }, { status: 409 });
    }
    await prisma.agentAction.update({
      where: { id },
      data: {
        status: "APPROVED",
        retryCount: { increment: 1 },
        failureReason: null,
        reviewedById: access.session.user.id
      }
    });
    try {
      return Response.json(await executeApprovedAction(id));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Retry failed.";
      return Response.json(
        await prisma.agentAction.update({
          where: { id },
          data: { status: "FAILED", failureReason: message }
        }),
        { status: 409 }
      );
    }
  }

  const action = await prisma.agentAction.update({
    where: { id },
    data:
      parsed.data.decision === "APPROVE"
        ? {
            status: "APPROVED",
            reviewedById: access.session.user.id,
            approvedAt: new Date()
          }
        : {
            status: "REJECTED",
            reviewedById: access.session.user.id,
            rejectedAt: new Date(),
            result: parsed.data.note ? { reviewNote: parsed.data.note } : undefined
          }
  });

  await writeAuditLog({
    userId: access.session.user.id,
    action: `AGENT_${parsed.data.decision}`,
    entity: "AgentAction",
    entityId: id,
    metadata: { type: action.type }
  });
  await prisma.notification.create({
    data: {
      userId: action.requestedById,
      title: parsed.data.decision === "APPROVE" ? "AI action approved" : "AI action rejected",
      message: action.title,
      type: "AGENT_REVIEW",
      link: "/admin/ai-manager/approvals"
    }
  });

  if (parsed.data.decision === "APPROVE" && parsed.data.executeNow) {
    try {
      const executed = await executeApprovedAction(id);
      return Response.json(executed);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Action execution failed.";
      const failed = await prisma.agentAction.update({
        where: { id },
        data: { status: "FAILED", failureReason: message }
      });
      return Response.json(failed, { status: 409 });
    }
  }

  return Response.json(action);
}
