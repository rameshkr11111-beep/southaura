import type { AssistantLanguage } from "@/lib/customer-assistant/types";

export async function createProviderReply(input: {
  message: string;
  language: AssistantLanguage;
  groundedReply: string;
  context: Record<string, unknown>;
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const baseUrl = (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/responses`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.CUSTOMER_ASSISTANT_MODEL ?? process.env.OPENAI_MODEL ?? "gpt-5.4-mini",
      instructions:
        "You are Dakshin AI Assistant for an e-commerce store. Answer only from the supplied verified context. Never invent price, stock, delivery, order, refund, warranty or product details. Never approve refunds or change prices. Ask for verification before private order data. Escalate uncertainty. Keep the answer concise and in the requested language.",
      input: JSON.stringify(input)
    }),
    signal: AbortSignal.timeout(20000)
  });
  if (!response.ok) return null;
  const payload = (await response.json()) as {
    output_text?: string;
    output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  };
  return (
    payload.output_text ??
    payload.output?.flatMap((item) => item.content ?? []).find((item) => item.type === "output_text")?.text ??
    null
  );
}
