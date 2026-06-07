import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createRazorpayOrder } from "@/lib/integrations/razorpay";

const schema = z.object({
  amount: z.number().positive().max(10000000),
  currency: z.string().length(3).default("INR"),
  receipt: z.string().min(3).max(40),
  orderId: z.string().optional(),
  customerEmail: z.string().email().optional(),
  notes: z.record(z.string()).optional()
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const order = await createRazorpayOrder(parsed.data);
    if (parsed.data.orderId) {
      try {
        await prisma.payment.create({
          data: {
            orderId: parsed.data.orderId,
            provider: "Razorpay",
            method: "ONLINE",
            transactionId: order.id,
            status: "PENDING",
            amount: parsed.data.amount,
            providerPayload: order as Prisma.InputJsonValue
          }
        });
      } catch {
        // The provider order remains valid if local persistence is temporarily unavailable.
      }
    }
    return Response.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to create payment order." },
      { status: 503 }
    );
  }
}
