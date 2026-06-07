import { Prisma } from "@prisma/client";
import { authorize } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { createDemoAgentPlan } from "@/lib/ai-manager/planner";
import { planWithOpenAI } from "@/lib/ai-manager/provider";
import type { AgentPlan } from "@/lib/ai-manager/types";
import { routeSpecialist, specialistForAction } from "@/lib/ai-manager/specialists";
import { validateProposal } from "@/lib/ai-manager/validation";
import { enrichWithBusinessData } from "@/lib/ai-manager/business-context";

export async function POST(request: Request) {
  const access = await authorize("agent:use");
  if (access.error) return access.error;
  const body = (await request.json()) as {
    message?: string;
    conversationId?: string;
  };
  const message = body.message?.trim();
  if (!message) {
    return Response.json({ error: "Message is required." }, { status: 400 });
  }

  let plan: AgentPlan;
  let provider: "OPENAI" | "DEMO" = "DEMO";
  let usage = { inputTokens: 0, outputTokens: 0, estimatedCost: 0, latencyMs: 0 };
  const specialist = routeSpecialist(message);
  try {
    const providerResult = await planWithOpenAI(message);
    plan = providerResult?.plan ?? createDemoAgentPlan(message);
    if (providerResult) usage = providerResult.usage;
    provider = process.env.OPENAI_API_KEY ? "OPENAI" : "DEMO";
  } catch {
    plan = createDemoAgentPlan(message);
  }
  plan = await enrichWithBusinessData(message, { ...plan, specialist });
  plan.proposals = await Promise.all(
    plan.proposals.map(async (item) => ({
      ...item,
      specialist: item.specialist ?? specialistForAction(item.type),
      validation: await validateProposal(item)
    }))
  );

  let conversationId = body.conversationId;
  const persistedActions: Array<{ id: string }> = [];

  try {
    if (!access.session.user.id.startsWith("demo-")) {
      const conversation = conversationId
        ? await prisma.agentConversation.findFirst({
            where: {
              id: conversationId,
              userId: access.session.user.id
            }
          })
        : await prisma.agentConversation.create({
            data: {
              title: message.slice(0, 80),
              userId: access.session.user.id,
              specialist
            }
          });
      if (conversation) {
        conversationId = conversation.id;
        await prisma.agentMessage.createMany({
          data: [
            {
              conversationId,
              role: "USER",
              content: message
            },
            {
              conversationId,
              role: "ASSISTANT",
              content: plan.response,
              metadata: {
                provider,
                mode: plan.mode
              } as Prisma.InputJsonValue
            }
          ]
        });
        for (const item of plan.proposals) {
          const action = await prisma.agentAction.create({
            data: {
              conversationId,
              requestedById: access.session.user.id,
              type: item.type,
              specialist: item.specialist ?? specialist,
              title: item.title,
              description: item.description,
              riskLevel: item.riskLevel,
              targetType: item.targetType,
              targetId: item.targetId,
              status: "PENDING_APPROVAL",
              input: item.input as Prisma.InputJsonValue,
              preview: item.preview as Prisma.InputJsonValue
              ,
              validation: item.validation as unknown as Prisma.InputJsonValue
            }
          });
          persistedActions.push({ id: action.id });
          if (item.riskLevel === "HIGH" || item.riskLevel === "CRITICAL") {
            await prisma.notification.create({
              data: {
                userId: access.session.user.id,
                title: "High-risk AI approval waiting",
                message: item.title,
                type: "AGENT_APPROVAL",
                link: "/admin/ai-manager/approvals"
              }
            });
          }
        }
      }
      await prisma.agentUsage.create({
        data: {
          userId: access.session.user.id,
          conversationId,
          provider,
          model: provider === "OPENAI" ? process.env.OPENAI_MODEL ?? "gpt-5.4-mini" : "demo-planner",
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          estimatedCost: usage.estimatedCost,
          latencyMs: usage.latencyMs
        }
      });
    }
  } catch {
    // Demo mode remains available when PostgreSQL has not been configured.
  }

  await writeAuditLog({
    userId: access.session.user.id.startsWith("demo-")
      ? undefined
      : access.session.user.id,
    action: "AGENT_COMMAND",
    entity: "DakshinAIManager",
    entityId: conversationId,
    metadata: {
      provider,
      mode: plan.mode,
      proposalCount: plan.proposals.length
    }
  });

  return Response.json({
    ...plan,
    provider,
    specialist,
    usage,
    conversationId: conversationId ?? `demo-${Date.now()}`,
    proposals: plan.proposals.map((item, index) => ({
      ...item,
      id: persistedActions[index]?.id ?? `demo-action-${Date.now()}-${index}`
    }))
  });
}
