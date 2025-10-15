import { useState } from "react";
import { IntegrationCard } from "../integration-card";
import { Mail } from "lucide-react";

export default function IntegrationCardExample() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="p-4 max-w-2xl">
      <IntegrationCard
        icon={Mail}
        name="Email"
        description="Connect your email for smart inbox management"
        enabled={enabled}
        onToggle={setEnabled}
      />
    </div>
  );
}
