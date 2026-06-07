import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const vendorRegistrationSchema = z.object({
  firstName: z.string().trim().min(2).max(60),
  lastName: z.string().trim().min(1).max(60),
  email: z.string().trim().email().toLowerCase(),
  phone: z.string().trim().min(8).max(20),
  password: z.string().min(8).regex(/[a-z]/).regex(/[A-Z]/).regex(/\d/),
  shopName: z.string().trim().min(3).max(100),
  category: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(80),
  gstin: z.string().trim().max(20).optional(),
  pan: z.string().trim().max(20).optional(),
  description: z.string().trim().min(30).max(1200)
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(request: Request) {
  const parsed = vendorRegistrationSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email }
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account already exists for this email." },
        { status: 409 }
      );
    }

    const baseSlug = slugify(parsed.data.shopName);
    const slugExists = await prisma.vendorShop.findUnique({
      where: { slug: baseSlug }
    });
    const slug = slugExists ? `${baseSlug}-${Date.now().toString().slice(-6)}` : baseSlug;
    const passwordHash = await hash(parsed.data.password, 12);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: `${parsed.data.firstName} ${parsed.data.lastName}`,
          email: parsed.data.email,
          passwordHash,
          role: Role.VENDOR,
          status: "ACTIVE"
        }
      });
      const shop = await tx.vendorShop.create({
        data: {
          ownerId: user.id,
          name: parsed.data.shopName,
          slug,
          email: parsed.data.email,
          phone: parsed.data.phone,
          gstin: parsed.data.gstin || null,
          pan: parsed.data.pan || null,
          description: parsed.data.description,
          address: {
            city: parsed.data.city,
            country: "India"
          },
          status: "PENDING_REVIEW"
        }
      });
      return { user, shop };
    });

    return NextResponse.json(
      {
        message: "Your vendor account and shop were created.",
        shop: { id: result.shop.id, name: result.shop.name, slug: result.shop.slug }
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "Vendor registration needs the PostgreSQL database. Configure DATABASE_URL and run Prisma migrations."
      },
      { status: 503 }
    );
  }
}
