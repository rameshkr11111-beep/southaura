import { createHmac, timingSafeEqual } from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyRazorpayWebhook } from "@/lib/integrations/razorpay";

const supportedProviders = ["razorpay", "whatsapp", "facebook", "instagram", "shiprocket"];

function safeEqual(expected: string, supplied: string) {
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  return a.length === b.length && timingSafeEqual(a, b);
}

function verifyMeta(rawBody: string, signature: string) {
  const secret = process.env.META_APP_SECRET;
  if (!secret || !signature.startsWith("sha256=")) return false;
  const expected = `sha256=${createHmac("sha256", secret).update(rawBody).digest("hex")}`;
  return safeEqual(expected, signature);
}

function verifyShiprocket(request: Request) {
  const secret = process.env.SHIPROCKET_WEBHOOK_SECRET;
  const supplied = request.headers.get("x-api-key") ?? request.headers.get("x-shiprocket-signature") ?? "";
  return Boolean(secret && supplied && safeEqual(secret, supplied));
}

export async function POST(request: Request, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  if (!supportedProviders.includes(provider)) {
    return Response.json({ error: "Unsupported provider" }, { status: 404 });
  }

  const rawBody = await request.text();
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const signatureValid =
    provider === "razorpay"
      ? verifyRazorpayWebhook(rawBody, request.headers.get("x-razorpay-signature") ?? "")
      : provider === "shiprocket"
        ? verifyShiprocket(request)
        : verifyMeta(rawBody, request.headers.get("x-hub-signature-256") ?? "");

  const eventType = String(payload.event ?? payload.type ?? payload.status ?? "unclassified");
  const externalEventId = String(payload.id ?? payload.event_id ?? "") || null;

  try {
    if (externalEventId) {
      await prisma.webhookEvent.upsert({
        where: { provider_externalEventId: { provider, externalEventId } },
        update: { signatureValid, payload: payload as Prisma.InputJsonValue },
        create: {
          provider,
          externalEventId,
          eventType,
          signatureValid,
          status: signatureValid ? "RECEIVED" : "REJECTED",
          payload: payload as Prisma.InputJsonValue
        }
      });
    } else {
      await prisma.webhookEvent.create({
        data: {
          provider,
          eventType,
          signatureValid,
          status: signatureValid ? "RECEIVED" : "REJECTED",
          payload: payload as Prisma.InputJsonValue
        }
      });
    }
  } catch {}

  if (!signatureValid) {
    return Response.json({ error: "Webhook signature verification failed." }, { status: 401 });
  }

  try {
    if (provider === "razorpay" && eventType === "payment.captured") {
      const payment = (payload.payload as Record<string, unknown> | undefined)?.payment as
        | { entity?: { id?: string; order_id?: string } }
        | undefined;
      if (payment?.entity?.order_id) {
        await prisma.payment.updateMany({
          where: { transactionId: payment.entity.order_id },
          data: {
            transactionId: payment.entity.id,
            status: "PAID",
            reconciled: true,
            providerPayload: payload as Prisma.InputJsonValue
          }
        });
      }
    }
    if (externalEventId) {
      await prisma.webhookEvent.update({
        where: { provider_externalEventId: { provider, externalEventId } },
        data: { status: "PROCESSED", processedAt: new Date() }
      });
    }
  } catch (error) {
    if (externalEventId) {
      await prisma.webhookEvent.update({
        where: { provider_externalEventId: { provider, externalEventId } },
        data: { status: "FAILED", errorMessage: error instanceof Error ? error.message : "Processing failed" }
      }).catch(() => null);
    }
    return Response.json({ error: "Webhook accepted but processing failed." }, { status: 500 });
  }

  return Response.json({ received: true });
}
