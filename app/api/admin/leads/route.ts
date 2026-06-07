import { z } from "zod";
import { authorize } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  id: z.string(),
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"])
});

const demoLeads = [
  {
    id: "demo-lead-1",
    name: "Anita Mehra",
    phone: "+91 98765 11002",
    email: "anita@example.com",
    city: "Gurugram",
    productInterest: "Temple Town Mysore Pak (500 g)",
    source: "WEBSITE_PRODUCT",
    status: "NEW",
    estimatedValue: 699,
    notes: JSON.stringify({ requirement: "Bulk or corporate purchase", quantity: 20, preferredContact: "WhatsApp" }),
    createdAt: new Date().toISOString()
  }
];

export async function GET(request: Request) {
  const access = await authorize("customers:manage");
  if (access.error) return access.error;
  const url = new URL(request.url);
  try {
    const items = await prisma.supportLead.findMany({ orderBy: { createdAt: "desc" }, take: 250 });
    if (url.searchParams.get("export") === "csv") {
      const rows = [
        ["name", "phone", "email", "city", "product", "source", "status", "estimated_value", "created_at"],
        ...items.map((lead) => [
          lead.name,
          lead.phone,
          lead.email ?? "",
          lead.city ?? "",
          lead.productInterest,
          lead.source,
          lead.status,
          String(lead.estimatedValue ?? ""),
          lead.createdAt.toISOString()
        ])
      ];
      const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
      return new Response(csv, {
        headers: { "Content-Type": "text/csv", "Content-Disposition": 'attachment; filename="southaura-leads.csv"' }
      });
    }
    return Response.json({ items: items.length ? items : demoLeads });
  } catch {
    return Response.json({ items: demoLeads });
  }
}

export async function PATCH(request: Request) {
  const access = await authorize("customers:manage");
  if (access.error) return access.error;
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  if (parsed.data.id.startsWith("demo-")) return Response.json({ ...parsed.data, demo: true });
  return Response.json(
    await prisma.supportLead.update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status }
    })
  );
}
