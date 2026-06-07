import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyRazorpayPayment } from "@/lib/integrations/razorpay";
import { sendEmail, sendWhatsAppTemplate } from "@/lib/integrations/messaging";

const schema = z.object({
  razorpay_order_id: z.string().min(3),
  razorpay_payment_id: z.string().min(3),
  razorpay_signature: z.string().min(10),
  localOrderId: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional()
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  const valid = verifyRazorpayPayment({
    orderId: parsed.data.razorpay_order_id,
    paymentId: parsed.data.razorpay_payment_id,
    signature: parsed.data.razorpay_signature
  });
  if (!valid) return Response.json({ error: "Payment signature verification failed." }, { status: 400 });

  try {
    await prisma.payment.updateMany({
      where: { transactionId: parsed.data.razorpay_order_id },
      data: {
        transactionId: parsed.data.razorpay_payment_id,
        status: "PAID",
        reconciled: true,
        providerPayload: parsed.data as Prisma.InputJsonValue
      }
    });
    if (parsed.data.localOrderId) {
      await prisma.order.update({
        where: { id: parsed.data.localOrderId },
        data: { paymentStatus: "PAID", status: "CONFIRMED" }
      });
    }
  } catch {
    // Webhook reconciliation can complete persistence if the database was unavailable.
  }

  if (parsed.data.email) {
    void sendEmail({
      to: parsed.data.email,
      subject: "Payment confirmed for your southAura order",
      html: `<p>Your payment ${parsed.data.razorpay_payment_id} was confirmed successfully.</p>`
    }).catch(() => null);
  }
  if (parsed.data.phone) {
    void sendWhatsAppTemplate({
      to: parsed.data.phone,
      template: "payment_confirmation",
      components: [{ type: "body", parameters: [{ type: "text", text: parsed.data.razorpay_payment_id }] }]
    }).catch(() => null);
  }
  return Response.json({ verified: true, paymentId: parsed.data.razorpay_payment_id });
}
