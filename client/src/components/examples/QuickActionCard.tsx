import { QuickActionCard } from "../quick-action-card";
import { MessageSquare } from "lucide-react";

export default function QuickActionCardExample() {
  return (
    <div className="p-4">
      <QuickActionCard
        title="Start a Chat"
        description="Have a conversation with your AI assistant"
        icon={MessageSquare}
        href="/chat"
      />
    </div>
  );
}
