import { z } from "zod";

export const productInput = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  sku: z.string().min(2),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().positive().optional(),
  costPrice: z.coerce.number().positive().optional(),
  stock: z.coerce.number().int().min(0).default(0),
  lowStockAt: z.coerce.number().int().min(0).default(10),
  status: z
    .enum(["DRAFT", "ACTIVE", "OUT_OF_STOCK", "ARCHIVED"])
    .default("DRAFT")
});

export const orderUpdateInput = z.object({
  status: z
    .enum([
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "PACKED",
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "RETURN_REQUESTED",
      "RETURNED",
      "CANCELLED",
      "REFUNDED"
    ])
    .optional(),
  paymentStatus: z
    .enum([
      "PENDING",
      "AUTHORIZED",
      "PAID",
      "FAILED",
      "PARTIALLY_REFUNDED",
      "REFUNDED"
    ])
    .optional(),
  assignedToId: z.string().nullable().optional(),
  notes: z.string().max(2000).optional()
});

export const customerInput = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().min(8).optional(),
  tags: z.array(z.string()).default([]),
  source: z.string().optional(),
  marketingOptIn: z.boolean().default(false)
});

export const couponInput = z.object({
  code: z.string().min(3).transform((value) => value.toUpperCase()),
  description: z.string().optional(),
  type: z.enum(["PERCENTAGE", "FIXED", "BUY_ONE_GET_ONE", "FREE_SHIPPING"]),
  value: z.coerce.number().min(0),
  minOrderValue: z.coerce.number().min(0).optional(),
  usageLimit: z.coerce.number().int().positive().optional(),
  firstOrderOnly: z.boolean().default(false),
  startsAt: z.coerce.date(),
  expiresAt: z.coerce.date().optional()
});
