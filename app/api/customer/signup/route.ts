import { hash } from "bcryptjs";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const inputSchema = z.object({
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().max(80).optional(),
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  phone: z.string().trim().min(7).max(25).optional(),
  password: z.string().min(8).max(128)
    .regex(/[A-Z]/, "Include one uppercase letter.")
    .regex(/[a-z]/, "Include one lowercase letter.")
    .regex(/[0-9]/, "Include one number."),
  marketingOptIn: z.boolean().default(false)
});

export async function POST(request: Request) {
  const parsed = inputSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    const existingUser = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existingUser) return Response.json({ error: "An account already exists for this email." }, { status: 409 });
    const passwordHash = await hash(parsed.data.password, 12);
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: `${parsed.data.firstName} ${parsed.data.lastName ?? ""}`.trim(),
          email: parsed.data.email,
          passwordHash,
          role: Role.CUSTOMER,
          status: "ACTIVE"
        }
      });
      const existingCustomer = await tx.customer.findUnique({ where: { email: parsed.data.email } });
      const customer = existingCustomer
        ? await tx.customer.update({
            where: { id: existingCustomer.id },
            data: {
              userId: user.id,
              firstName: parsed.data.firstName,
              lastName: parsed.data.lastName,
              phone: parsed.data.phone ?? existingCustomer.phone,
              marketingOptIn: parsed.data.marketingOptIn
            }
          })
        : await tx.customer.create({
            data: {
              userId: user.id,
              firstName: parsed.data.firstName,
              lastName: parsed.data.lastName,
              email: parsed.data.email,
              phone: parsed.data.phone,
              tags: ["Online Account"],
              source: "Website signup",
              marketingOptIn: parsed.data.marketingOptIn
            }
          });
      return { userId: user.id, customerId: customer.id };
    });
    return Response.json(result, { status: 201 });
  } catch {
    return Response.json(
      { error: "Account creation requires the PostgreSQL database. Demo customer login remains available." },
      { status: 503 }
    );
  }
}
