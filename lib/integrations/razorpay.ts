import { createHmac, timingSafeEqual } from "crypto";
import { providerRequest } from "@/lib/integrations/http";

function credentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("Razorpay is not configured.");
  return { keyId, keySecret };
}

export async function createRazorpayOrder(input: {
  amount: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}) {
  const { keyId, keySecret } = credentials();
  return providerRequest<{ id: string; amount: number; currency: string; status: string }>({
    provider: "razorpay",
    operation: "CREATE_ORDER",
    endpoint: "https://api.razorpay.com/v1/orders",
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}` },
    body: {
      amount: Math.round(input.amount * 100),
      currency: input.currency ?? "INR",
      receipt: input.receipt,
      notes: input.notes ?? {}
    }
  });
}

export function verifyRazorpayPayment(input: {
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  const { keySecret } = credentials();
  const expected = createHmac("sha256", keySecret)
    .update(`${input.orderId}|${input.paymentId}`)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(input.signature);
  return expectedBuffer.length === suppliedBuffer.length &&
    timingSafeEqual(expectedBuffer, suppliedBuffer);
}

export function verifyRazorpayWebhook(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(signature);
  return expectedBuffer.length === suppliedBuffer.length &&
    timingSafeEqual(expectedBuffer, suppliedBuffer);
}
