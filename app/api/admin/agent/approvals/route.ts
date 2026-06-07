import { authorize } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

const demoApprovals = [
  {
    id: "demo-approval-product",
    type: "CREATE_PRODUCT",
    title: "Create product: Mysore Pak 500g",
    description: "Draft product with generated content and SEO metadata.",
    riskLevel: "MEDIUM",
    status: "PENDING_APPROVAL",
    requestedBy: { name: "Dakshin AI Manager" },
    createdAt: new Date().toISOString(),
    preview: { price: "₹299", category: "Sweets", status: "Draft" }
  },
  {
    id: "demo-approval-coupon",
    type: "CREATE_COUPON",
    title: "Activate DIWALI20 coupon",
    description: "20% discount, limited to ₹1,000 per order.",
    riskLevel: "HIGH",
    status: "PENDING_APPROVAL",
    requestedBy: { name: "Dakshin AI Manager" },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    preview: { audience: "All customers", usageLimit: 5000 }
  },
  {
    id: "demo-approval-whatsapp",
    type: "SEND_WHATSAPP",
    title: "Send abandoned cart reminders",
    description: "Personalized WhatsApp campaign for 28 customers.",
    riskLevel: "HIGH",
    status: "PENDING_APPROVAL",
    requestedBy: { name: "Dakshin AI Manager" },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    preview: { recipients: 28, estimatedRevenue: "₹84,620" }
  }
];

export async function GET(request: Request) {
  const access = await authorize("agent:approve");
  if (access.error) return access.error;
  const status =
    new URL(request.url).searchParams.get("status") ?? "PENDING_APPROVAL";
  try {
    const actions = await prisma.agentAction.findMany({
      where: status === "ALL" ? {} : { status },
      include: {
        requestedBy: { select: { name: true, email: true } },
        reviewedBy: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 100
    });
    return Response.json({ items: actions.length ? actions : demoApprovals });
  } catch {
    return Response.json({ items: demoApprovals });
  }
}
