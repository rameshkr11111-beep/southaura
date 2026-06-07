import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppTemplate } from "@/lib/integrations/messaging";
import { publishFacebookPost, publishInstagramPost } from "@/lib/integrations/meta";

export async function executeApprovedAction(actionId: string) {
  const action = await prisma.agentAction.findUnique({
    where: { id: actionId }
  });
  if (!action || action.status !== "APPROVED") {
    throw new Error("Action must be approved before execution.");
  }
  const validation = action.validation as
    | { valid?: boolean; checks?: Array<{ status?: string }> }
    | null;
  if (validation?.valid === false || validation?.checks?.some((item) => item.status === "BLOCK")) {
    throw new Error("Action failed validation and cannot execute.");
  }

  const input = action.input as Record<string, unknown>;
  let result: Prisma.InputJsonValue;

  switch (action.type) {
    case "CREATE_PRODUCT": {
      const name = String(input.name ?? "New product");
      const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const product = await prisma.product.create({
        data: {
          name,
          slug: `${baseSlug}-${Date.now().toString().slice(-6)}`,
          sku: `DK-AI-${Date.now().toString().slice(-8)}`,
          shortDescription:
            "AI-assisted catalog draft. Review merchandising details before activation.",
          price: Number(input.price ?? 0),
          stock: Number(input.stock ?? 0),
          status: "DRAFT"
        }
      });
      result = { productId: product.id, slug: product.slug, status: product.status };
      break;
    }
    case "CREATE_COUPON": {
      const coupon = await prisma.coupon.create({
        data: {
          code: String(input.code),
          description: "Created through approved Dakshin AI Manager action.",
          type: String(input.type ?? "PERCENTAGE") as "PERCENTAGE",
          value: Number(input.value ?? 0),
          minOrderValue: Number(input.minOrderValue ?? 0),
          maxDiscount: Number(input.maxDiscount ?? 0),
          usageLimit: Number(input.usageLimit ?? 1000),
          startsAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: "ACTIVE"
        }
      });
      result = { couponId: coupon.id, code: coupon.code, status: coupon.status };
      break;
    }
    case "SEND_WHATSAPP":
    case "SEND_ORDER_UPDATE": {
      const response = await sendWhatsAppTemplate({
        to: String(input.to ?? input.phone ?? ""),
        template: String(input.template ?? "order_update"),
        language: String(input.language ?? "en"),
        components: Array.isArray(input.components) ? input.components : []
      });
      result = {
        sent: true,
        provider: "whatsapp",
        response: response as Prisma.InputJsonValue
      };
      break;
    }
    case "PUBLISH_SOCIAL": {
      const platform = String(input.platform ?? "FACEBOOK").toUpperCase();
      const response =
        platform === "INSTAGRAM"
          ? await publishInstagramPost({
              caption: String(input.caption ?? input.content ?? ""),
              imageUrl: String(input.imageUrl ?? "")
            })
          : await publishFacebookPost({
              message: String(input.message ?? input.content ?? ""),
              link: input.link ? String(input.link) : undefined
            });
      result = {
        published: true,
        provider: platform.toLowerCase(),
        response: response as Prisma.InputJsonValue
      };
      break;
    }
    default:
      result = {
        approved: true,
        executionMode: "MANUAL_CONNECTOR_REQUIRED",
        note:
          "The action is approved. Connect the target service executor to complete it."
      };
  }

  return prisma.agentAction.update({
    where: { id: actionId },
    data: {
      status: "COMPLETED",
      executedAt: new Date(),
      result
    }
  });
}
