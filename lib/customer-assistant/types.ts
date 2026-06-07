import type { Product } from "@/lib/types";

export type AssistantLanguage = "en" | "hi" | "ta" | "te" | "ml" | "kn";
export type AssistantIntent =
  | "GREETING"
  | "PRODUCT_SEARCH"
  | "PRODUCT_QUESTION"
  | "POLICY"
  | "ORDER_TRACKING"
  | "LEAD_CAPTURE"
  | "HUMAN_SUPPORT"
  | "GENERAL";

export type AssistantReply = {
  conversationId: string;
  intent: AssistantIntent;
  language: AssistantLanguage;
  reply: string;
  quickReplies: string[];
  products?: Product[];
  order?: Record<string, unknown>;
  articles?: Array<{ title: string; href: string }>;
  requiresVerification?: boolean;
  escalated?: boolean;
  provider: "LOCAL" | "OPENAI";
};
