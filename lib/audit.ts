import { headers } from "next/headers";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function writeAuditLog(input: {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    const requestHeaders = await headers();
    await prisma.auditLog.create({
      data: {
        userId: input.userId ?? null,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? null,
        metadata: input.metadata as Prisma.InputJsonValue | undefined,
        ipAddress:
          requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
        userAgent: requestHeaders.get("user-agent")
      }
    });
  } catch {
    // Audit persistence becomes active when PostgreSQL is configured.
  }
}
