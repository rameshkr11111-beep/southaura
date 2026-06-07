import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/api-auth";
import { writeAuditLog } from "@/lib/audit";

const settingsInput = z.object({
  key: z.string().min(2),
  group: z.string().min(2),
  value: z.unknown()
});

export async function GET(request: Request) {
  const access = await authorize("settings:manage");
  if (access.error) return access.error;
  const group = new URL(request.url).searchParams.get("group");
  const settings = await prisma.siteSetting.findMany({
    where: group ? { group } : {},
    orderBy: { key: "asc" }
  });
  return Response.json({ items: settings });
}

export async function PUT(request: Request) {
  const access = await authorize("settings:manage");
  if (access.error) return access.error;
  const parsed = settingsInput.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const setting = await prisma.siteSetting.upsert({
    where: { key: parsed.data.key },
    update: { group: parsed.data.group, value: parsed.data.value as object },
    create: {
      key: parsed.data.key,
      group: parsed.data.group,
      value: parsed.data.value as object
    }
  });
  await writeAuditLog({
    userId: access.session.user.id,
    action: "UPSERT",
    entity: "SiteSetting",
    entityId: setting.id,
    metadata: { key: setting.key }
  });
  return Response.json(setting);
}
