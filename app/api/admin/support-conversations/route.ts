import { z } from "zod";
import { authorize } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  id: z.string(),
  action: z.enum(["TAKEOVER", "RELEASE_TO_AI", "RESOLVE", "SPAM", "EDIT_AI_REPLY"]),
  messageId: z.string().optional(),
  body: z.string().max(4000).optional()
});

const demoConversations = [
  {
    id: "demo-support-1",
    channel: "WEBSITE",
    locale: "en",
    subject: "Which filter coffee is best for gifting?",
    status: "OPEN",
    humanTakeover: false,
    aiEnabled: true,
    spam: false,
    attributedRevenue: 449,
    lastMessageAt: new Date().toISOString(),
    customer: { firstName: "Priya", lastName: "Sharma", phone: "+91 98200 11234", email: "priya@example.com" },
    lead: null,
    messages: [
      { id: "dm1", direction: "INBOUND", senderType: "CUSTOMER", body: "Which filter coffee is best for gifting?", aiGenerated: false, createdAt: new Date(Date.now() - 120000).toISOString() },
      { id: "dm2", direction: "OUTBOUND", senderType: "AI", body: "Coorg Estate Filter Coffee is the strongest gift option currently in stock.", aiGenerated: true, createdAt: new Date(Date.now() - 60000).toISOString() }
    ]
  },
  {
    id: "demo-support-2",
    channel: "WHATSAPP",
    locale: "hi",
    subject: "Delayed order assistance",
    status: "WAITING_FOR_HUMAN",
    humanTakeover: true,
    aiEnabled: false,
    spam: false,
    attributedRevenue: 0,
    lastMessageAt: new Date(Date.now() - 900000).toISOString(),
    customer: { firstName: "Rohan", lastName: "Gupta", phone: "+91 98100 22110", email: "rohan@example.com" },
    lead: null,
    messages: [
      { id: "dm3", direction: "INBOUND", senderType: "CUSTOMER", body: "My order is delayed, please connect me to support.", aiGenerated: false, createdAt: new Date(Date.now() - 900000).toISOString() }
    ]
  },
  {
    id: "demo-support-3",
    channel: "INSTAGRAM",
    locale: "en",
    subject: "Corporate festival gifting quotation",
    status: "OPEN",
    humanTakeover: false,
    aiEnabled: true,
    spam: false,
    attributedRevenue: 84000,
    lastMessageAt: new Date(Date.now() - 1800000).toISOString(),
    customer: null,
    lead: { name: "Anita Mehra", companyName: "Northstar Consulting", phone: "+91 98765 11002", productInterest: "100 festival gift boxes", status: "NEW" },
    messages: [
      { id: "dm4", direction: "INBOUND", senderType: "CUSTOMER", body: "Need 100 premium gift boxes for clients.", aiGenerated: false, createdAt: new Date(Date.now() - 1800000).toISOString() }
    ]
  }
];

export async function GET(request: Request) {
  const access = await authorize("customers:manage");
  if (access.error) return access.error;
  const url = new URL(request.url);
  if (url.searchParams.get("export") === "csv") {
    try {
      const conversations = await prisma.conversation.findMany({
        include: { customer: true, lead: true },
        orderBy: { lastMessageAt: "desc" }
      });
      const rows = [
        ["id", "channel", "status", "customer", "email", "phone", "lead", "revenue"],
        ...conversations.map((item) => [
          item.id,
          item.channel,
          item.status,
          item.customer ? `${item.customer.firstName} ${item.customer.lastName ?? ""}` : "",
          item.customer?.email ?? item.lead?.email ?? "",
          item.customer?.phone ?? item.lead?.phone ?? "",
          item.lead?.productInterest ?? "",
          String(item.attributedRevenue)
        ])
      ];
      const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
      return new Response(csv, { headers: { "Content-Type": "text/csv", "Content-Disposition": 'attachment; filename="support-conversations.csv"' } });
    } catch {
      return new Response("id,channel,status,customer,revenue\n", { headers: { "Content-Type": "text/csv" } });
    }
  }
  try {
    const items = await prisma.conversation.findMany({
      include: {
        customer: { select: { firstName: true, lastName: true, email: true, phone: true, loyaltyPoints: true, orderCount: true } },
        lead: true,
        messages: { orderBy: { createdAt: "asc" }, take: 100 }
      },
      orderBy: { lastMessageAt: "desc" },
      take: 100
    });
    const stats = await prisma.conversation.aggregate({ _sum: { attributedRevenue: true }, _count: true });
    return Response.json({ items: items.length ? items : demoConversations, stats });
  } catch {
    return Response.json({ items: demoConversations, stats: { _count: 3, _sum: { attributedRevenue: 84449 } } });
  }
}

export async function PATCH(request: Request) {
  const access = await authorize("customers:manage");
  if (access.error) return access.error;
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  if (parsed.data.id.startsWith("demo-")) {
    return Response.json({ id: parsed.data.id, action: parsed.data.action, demo: true });
  }
  if (parsed.data.action === "EDIT_AI_REPLY") {
    if (!parsed.data.messageId || !parsed.data.body) return Response.json({ error: "Message and body are required." }, { status: 400 });
    return Response.json(await prisma.message.update({ where: { id: parsed.data.messageId }, data: { editedBody: parsed.data.body, body: parsed.data.body } }));
  }
  const data =
    parsed.data.action === "TAKEOVER"
      ? { humanTakeover: true, aiEnabled: false, status: "IN_PROGRESS", assignedToId: access.session.user.id, assignedToName: access.session.user.name }
      : parsed.data.action === "RELEASE_TO_AI"
        ? { humanTakeover: false, aiEnabled: true, status: "OPEN", assignedToId: null, assignedToName: null }
        : parsed.data.action === "RESOLVE"
          ? { status: "RESOLVED", aiEnabled: false }
          : { spam: true, status: "SPAM", aiEnabled: false };
  return Response.json(await prisma.conversation.update({ where: { id: parsed.data.id }, data }));
}
