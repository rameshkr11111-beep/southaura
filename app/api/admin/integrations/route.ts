import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/api-auth";
import { writeAuditLog } from "@/lib/audit";
import { getEnvironmentStatus, integrationCatalog } from "@/lib/integrations/catalog";

const integrationInput = z.object({
  provider: z.string().min(2),
  category: z.string().min(2),
  status: z.enum(["CONNECTED", "DISCONNECTED", "ERROR", "PENDING"]),
  settings: z.record(z.unknown()).optional()
});

export async function GET() {
  const access = await authorize("settings:manage");
  if (access.error) return access.error;
  let records: Array<{ provider: string; status: string; lastSyncAt: Date | null; lastError: string | null }> = [];
  try {
    records = await prisma.integration.findMany({
      select: { provider: true, status: true, lastSyncAt: true, lastError: true },
      orderBy: [{ provider: "asc" }]
    });
  } catch {}
  const items = integrationCatalog.map((definition) => {
    const record = records.find((item) => item.provider === definition.provider);
    const environment = getEnvironmentStatus(definition);
    return {
      ...definition,
      configured: environment.configured,
      missing: environment.missing,
      status: environment.configured ? record?.status === "ERROR" ? "ERROR" : "CONNECTED" : "DISCONNECTED",
      lastSyncAt: record?.lastSyncAt ?? null,
      lastError: record?.lastError ?? null
    };
  });
  return Response.json({ items });
}

export async function PUT(request: Request) {
  const access = await authorize("settings:manage");
  if (access.error) return access.error;
  const parsed = integrationInput.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const integration = await prisma.integration.upsert({
    where: { provider: parsed.data.provider },
    update: {
      category: parsed.data.category,
      status: parsed.data.status,
      lastCheckedAt: new Date(),
      settings: (parsed.data.settings ?? {}) as Prisma.InputJsonValue
    },
    create: {
      provider: parsed.data.provider,
      category: parsed.data.category,
      status: parsed.data.status,
      lastCheckedAt: new Date(),
      settings: (parsed.data.settings ?? {}) as Prisma.InputJsonValue
    }
  });
  await writeAuditLog({
    userId: access.session.user.id,
    action: "CONFIGURE",
    entity: "Integration",
    entityId: integration.id,
    metadata: { provider: integration.provider, status: integration.status }
  });
  return Response.json(integration);
}
