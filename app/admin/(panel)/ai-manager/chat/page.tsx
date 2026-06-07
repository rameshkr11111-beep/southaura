import { Suspense } from "react";
import { AgentChat } from "@/components/admin/ai-manager/agent-chat";

export default function AgentChatPage() {
  return (
    <Suspense>
      <AgentChat />
    </Suspense>
  );
}
