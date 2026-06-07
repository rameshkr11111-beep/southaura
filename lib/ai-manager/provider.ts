import type { AgentPlan } from "@/lib/ai-manager/types";

export type ProviderResult = {
  plan: AgentPlan;
  usage: {
    inputTokens: number;
    outputTokens: number;
    estimatedCost: number;
    latencyMs: number;
  };
};

const planSchema = {
  type: "object",
  additionalProperties: false,
  required: ["response", "mode", "proposals"],
  properties: {
    response: { type: "string" },
    mode: { type: "string", enum: ["READ_ONLY", "PROPOSAL", "CLARIFICATION"] },
    proposals: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "type",
          "title",
          "description",
          "riskLevel",
          "input",
          "preview",
          "status"
        ],
        properties: {
          type: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          riskLevel: {
            type: "string",
            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
          },
          targetType: { type: ["string", "null"] },
          targetId: { type: ["string", "null"] },
          input: { type: "object", additionalProperties: true },
          preview: { type: "object", additionalProperties: true },
          status: { type: "string", enum: ["PENDING_APPROVAL"] }
        }
      }
    },
    data: { type: ["object", "null"], additionalProperties: true },
    suggestions: {
      type: ["array", "null"],
      items: { type: "string" }
    }
  }
};

const systemPrompt = `You are Dakshin AI Manager, a governed e-commerce operations agent.
You may analyze and answer read-only questions immediately.
Never publish, delete, send a message, change a price, update live catalog data,
issue a refund, assign a courier, or otherwise mutate business state directly.
For every mutation return one or more PENDING_APPROVAL proposals with a clear
preview and risk level. Never claim an action is complete before approval.
Keep recommendations commercially useful for a South Indian e-commerce brand.`;

export async function planWithOpenAI(
  command: string
): Promise<ProviderResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const baseUrl = (
    process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1"
  ).replace(/\/$/, "");
  const startedAt = Date.now();
  const response = await fetch(`${baseUrl}/responses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-5.4-mini",
      instructions: systemPrompt,
      input: command,
      text: {
        format: {
          type: "json_schema",
          name: "dakshin_agent_plan",
          strict: false,
          schema: planSchema
        }
      }
    }),
    signal: AbortSignal.timeout(30000)
  });

  if (!response.ok) {
    throw new Error(`AI provider returned ${response.status}`);
  }

  const payload = (await response.json()) as {
    output_text?: string;
    output?: Array<{
      content?: Array<{ type?: string; text?: string }>;
    }>;
    usage?: { input_tokens?: number; output_tokens?: number };
  };
  const text =
    payload.output_text ??
    payload.output
      ?.flatMap((item) => item.content ?? [])
      .find((item) => item.type === "output_text")?.text;
  if (!text) return null;
  const inputTokens = payload.usage?.input_tokens ?? 0;
  const outputTokens = payload.usage?.output_tokens ?? 0;
  return {
    plan: JSON.parse(text) as AgentPlan,
    usage: {
      inputTokens,
      outputTokens,
      estimatedCost: Number(((inputTokens * 0.0000004) + (outputTokens * 0.0000016)).toFixed(6)),
      latencyMs: Date.now() - startedAt
    }
  };
}
