import { createHash, randomBytes } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const inputSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase())
});

export async function POST(request: Request) {
  const parsed = inputSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  try {
    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (user?.role === "CUSTOMER") {
      const token = randomBytes(32).toString("hex");
      const digest = createHash("sha256").update(token).digest("hex");
      await prisma.verificationToken.deleteMany({ where: { identifier: `password-reset:${parsed.data.email}` } });
      await prisma.verificationToken.create({
        data: {
          identifier: `password-reset:${parsed.data.email}`,
          token: digest,
          expires: new Date(Date.now() + 60 * 60 * 1000)
        }
      });
      // Send the raw token through the configured email provider in production.
    }
  } catch {
    // Keep the response identical to prevent account enumeration.
  }
  return Response.json({
    message: "If a customer account exists, password-reset instructions will be sent to that email."
  });
}
