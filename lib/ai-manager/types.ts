export type AgentActionType =
  | "CREATE_PRODUCT"
  | "UPDATE_PRODUCT"
  | "CHANGE_PRICE"
  | "UPDATE_INVENTORY"
  | "BULK_UPDATE_SEO"
  | "CREATE_BLOG"
  | "PUBLISH_CONTENT"
  | "CREATE_SOCIAL_POST"
  | "PUBLISH_SOCIAL"
  | "SEND_WHATSAPP"
  | "SEND_ORDER_UPDATE"
  | "CREATE_COUPON"
  | "ASSIGN_COURIER"
  | "GENERATE_LABEL"
  | "CREATE_REFUND"
  | "CREATE_BANNER"
  | "ANALYZE_PRODUCT_IMAGE";

export type AgentRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type AgentSpecialist =
  | "MANAGER"
  | "PRODUCT"
  | "ORDER"
  | "CRM"
  | "SEO"
  | "CONTENT"
  | "MARKETING"
  | "DELIVERY"
  | "ANALYTICS";

export type AgentValidation = {
  valid: boolean;
  checks: Array<{ name: string; status: "PASS" | "WARN" | "BLOCK"; message: string }>;
};

export type AgentProposal = {
  id?: string;
  type: AgentActionType;
  specialist?: AgentSpecialist;
  title: string;
  description: string;
  riskLevel: AgentRiskLevel;
  targetType?: string;
  targetId?: string;
  input: Record<string, unknown>;
  preview: Record<string, unknown>;
  validation?: AgentValidation;
  status: "PENDING_APPROVAL";
};

export type AgentPlan = {
  response: string;
  mode: "READ_ONLY" | "PROPOSAL" | "CLARIFICATION";
  proposals: AgentProposal[];
  data?: Record<string, unknown>;
  suggestions?: string[];
  specialist?: AgentSpecialist;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    estimatedCost: number;
    latencyMs: number;
  };
};
