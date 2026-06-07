import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createShiprocketReturn, createShiprocketShipment } from "@/lib/integrations/shiprocket";
import { sendEmail, sendSms, sendWhatsAppTemplate } from "@/lib/integrations/messaging";
import { publishFacebookPost, publishInstagramPost } from "@/lib/integrations/meta";

async function execute(provider: string, operation: string, payload: Record<string, unknown>) {
  if (provider === "shiprocket" && operation === "CREATE_SHIPMENT") return createShiprocketShipment(payload);
  if (provider === "shiprocket" && operation === "CREATE_RETURN") return createShiprocketReturn(payload);
  if (provider === "whatsapp" && operation === "SEND_TEMPLATE") {
    return sendWhatsAppTemplate(payload as Parameters<typeof sendWhatsAppTemplate>[0]);
  }
  if (provider === "email" && operation === "SEND_EMAIL") {
    return sendEmail(payload as Parameters<typeof sendEmail>[0]);
  }
  if (provider === "sms" && operation === "SEND_SMS") {
    return sendSms(payload as Parameters<typeof sendSms>[0]);
  }
  if (provider === "facebook" && operation === "PUBLISH_POST") {
    return publishFacebookPost(payload as Parameters<typeof publishFacebookPost>[0]);
  }
  if (provider === "instagram" && operation === "PUBLISH_MEDIA") {
    return publishInstagramPost(payload as Parameters<typeof publishInstagramPost>[0]);
  }
  throw new Error(`No retry executor exists for ${provider}:${operation}`);
}

export async function POST(request: Request) {
  const expected = process.env.CRON_SECRET;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || supplied !== expected) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobs = await prisma.integrationRetry.findMany({
    where: {
      status: "PENDING",
      nextRunAt: { lte: new Date() },
      attempts: { lt: 5 }
    },
    orderBy: { nextRunAt: "asc" },
    take: 10
  });
  const results = [];
  for (const job of jobs) {
    await prisma.integrationRetry.update({
      where: { id: job.id },
      data: { status: "PROCESSING", attempts: { increment: 1 } }
    });
    try {
      await execute(job.provider, job.operation, job.payload as Record<string, unknown>);
      await prisma.integrationRetry.update({
        where: { id: job.id },
        data: { status: "COMPLETED", completedAt: new Date(), lastError: null }
      });
      results.push({ id: job.id, status: "COMPLETED" });
    } catch (error) {
      const attempts = job.attempts + 1;
      await prisma.integrationRetry.update({
        where: { id: job.id },
        data: {
          status: attempts >= job.maxAttempts ? "FAILED" : "PENDING",
          lastError: error instanceof Error ? error.message : "Retry failed",
          nextRunAt: new Date(Date.now() + Math.min(60, 2 ** attempts) * 60 * 1000),
          payload: job.payload as Prisma.InputJsonValue
        }
      });
      results.push({ id: job.id, status: attempts >= job.maxAttempts ? "FAILED" : "PENDING" });
    }
  }
  return Response.json({ processed: results.length, results });
}
