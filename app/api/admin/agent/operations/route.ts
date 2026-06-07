import { Prisma } from "@prisma/client";
import { z } from "zod";
import { authorize } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

const createInput = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("TEMPLATE"),
    name: z.string().min(2),
    description: z.string().optional(),
    command: z.string().min(3),
    specialist: z.string().default("MANAGER"),
    category: z.string().default("General")
  }),
  z.object({
    kind: z.literal("TASK"),
    name: z.string().min(2),
    command: z.string().min(3),
    specialist: z.string().default("MANAGER"),
    schedule: z.string().optional(),
    nextRunAt: z.string().datetime().optional()
  })
]);

const demoTemplates = [
  { id: "demo-template-stock", name: "Daily stock risk", command: "Show low stock products and recommend reorder priorities", specialist: "PRODUCT", category: "Inventory", useCount: 12 },
  { id: "demo-template-summary", name: "Daily business summary", command: "Show today's orders, revenue, risks and opportunities", specialist: "ANALYTICS", category: "Analytics", useCount: 28 },
  { id: "demo-template-seo", name: "Catalog SEO audit", command: "Find missing metadata and weak SEO across active products", specialist: "SEO", category: "Growth", useCount: 9 }
];

const demoTasks = [
  { id: "demo-task-summary", name: "Morning business briefing", command: "Create daily business summary", specialist: "ANALYTICS", schedule: "Every day at 9:00 AM", status: "ACTIVE", runCount: 18, nextRunAt: new Date(Date.now() + 86400000).toISOString() },
  { id: "demo-task-stock", name: "Low-stock monitor", command: "Show low stock products", specialist: "PRODUCT", schedule: "Every 6 hours", status: "ACTIVE", runCount: 42, nextRunAt: new Date(Date.now() + 21600000).toISOString() }
];

export async function GET(request: Request) {
  const access = await authorize("agent:use");
  if (access.error) return access.error;
  const query = new URL(request.url).searchParams.get("q")?.trim();
  try {
    const [templates, tasks, conversations, usage, failed, notifications] = await Promise.all([
      prisma.agentTemplate.findMany({ where: { userId: access.session.user.id }, orderBy: { useCount: "desc" }, take: 30 }),
      prisma.agentTask.findMany({ where: { userId: access.session.user.id }, orderBy: { createdAt: "desc" }, take: 30 }),
      prisma.agentConversation.findMany({
        where: { userId: access.session.user.id, ...(query ? { title: { contains: query, mode: "insensitive" } } : {}) },
        orderBy: { updatedAt: "desc" },
        take: 30,
        include: { _count: { select: { messages: true, actions: true } } }
      }),
      prisma.agentUsage.aggregate({
        where: { userId: access.session.user.id },
        _sum: { inputTokens: true, outputTokens: true, estimatedCost: true },
        _count: true
      }),
      prisma.agentAction.count({ where: { requestedById: access.session.user.id, status: "FAILED" } }),
      prisma.notification.findMany({ where: { userId: access.session.user.id, read: false }, orderBy: { createdAt: "desc" }, take: 10 })
    ]);
    return Response.json({ templates, tasks, conversations, usage, failed, notifications });
  } catch {
    return Response.json({
      templates: demoTemplates,
      tasks: demoTasks,
      conversations: [
        { id: "demo-conversation-1", title: "Diwali offer planning", specialist: "MARKETING", updatedAt: new Date().toISOString(), _count: { messages: 4, actions: 1 } },
        { id: "demo-conversation-2", title: "Spice catalog SEO audit", specialist: "SEO", updatedAt: new Date(Date.now() - 3600000).toISOString(), _count: { messages: 6, actions: 2 } }
      ],
      usage: { _count: 48, _sum: { inputTokens: 32450, outputTokens: 12840, estimatedCost: 0.0348 } },
      failed: 2,
      notifications: [
        { id: "demo-notification", title: "Approval waiting", message: "A high-risk WhatsApp campaign needs review.", type: "AGENT_APPROVAL", link: "/admin/ai-manager/approvals" }
      ]
    });
  }
}

export async function POST(request: Request) {
  const access = await authorize("agent:use");
  if (access.error) return access.error;
  const parsed = createInput.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  if (access.session.user.id.startsWith("demo-")) {
    return Response.json({ id: `demo-${parsed.data.kind.toLowerCase()}-${Date.now()}`, ...parsed.data, status: "ACTIVE" }, { status: 201 });
  }
  if (parsed.data.kind === "TEMPLATE") {
    return Response.json(await prisma.agentTemplate.create({
      data: {
        userId: access.session.user.id,
        name: parsed.data.name,
        description: parsed.data.description,
        command: parsed.data.command,
        specialist: parsed.data.specialist,
        category: parsed.data.category
      }
    }), { status: 201 });
  }
  return Response.json(await prisma.agentTask.create({
    data: {
      userId: access.session.user.id,
      name: parsed.data.name,
      command: parsed.data.command,
      specialist: parsed.data.specialist,
      schedule: parsed.data.schedule,
      nextRunAt: parsed.data.nextRunAt ? new Date(parsed.data.nextRunAt) : undefined,
      lastResult: { mode: "SCHEDULED", approvalRequired: true } as Prisma.InputJsonValue
    }
  }), { status: 201 });
}
