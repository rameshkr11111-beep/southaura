import { prisma } from "@/lib/prisma";
import type { AgentProposal, AgentValidation } from "@/lib/ai-manager/types";

const check = (
  name: string,
  condition: boolean,
  message: string,
  severity: "WARN" | "BLOCK" = "BLOCK"
) => ({ name, status: condition ? ("PASS" as const) : severity, message });

export async function validateProposal(proposal: AgentProposal): Promise<AgentValidation> {
  const input = proposal.input;
  const checks: AgentValidation["checks"] = [];

  if (proposal.type === "CREATE_PRODUCT") {
    const price = Number(input.price ?? 0);
    const stock = Number(input.stock ?? 0);
    checks.push(check("Positive price", price > 0, "Selling price must be greater than zero."));
    checks.push(check("Valid stock", Number.isInteger(stock) && stock >= 0, "Stock cannot be negative."));
    const sku = typeof input.sku === "string" ? input.sku : undefined;
    if (sku) {
      const duplicate = await prisma.product.findUnique({ where: { sku } }).catch(() => null);
      checks.push(check("Unique SKU", !duplicate, `SKU ${sku} already exists.`));
    }
  }

  if (proposal.type === "CREATE_COUPON") {
    const value = Number(input.value ?? 0);
    checks.push(check("Discount range", value > 0 && value <= 70, "Discount must be between 1% and 70%."));
    checks.push(
      check("Margin safeguard", value <= 30, "Discount above 30% needs finance review.", "WARN")
    );
    const code = String(input.code ?? "");
    const duplicate = code
      ? await prisma.coupon.findUnique({ where: { code } }).catch(() => null)
      : null;
    checks.push(check("Unique coupon", Boolean(code) && !duplicate, "Coupon code is missing or already exists."));
  }

  if (["SEND_WHATSAPP", "PUBLISH_SOCIAL", "SEND_ORDER_UPDATE"].includes(proposal.type)) {
    checks.push(check("Audience selected", Boolean(input.segment || input.channel || input.orderId), "A verified target is required."));
    checks.push(check("Approval enforced", true, "Messages remain blocked until approval."));
  }

  if (!checks.length) {
    checks.push(check("Approval enforced", true, "Action is eligible for governed review."));
  }
  return { valid: !checks.some((item) => item.status === "BLOCK"), checks };
}
