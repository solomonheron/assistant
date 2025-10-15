import { useState } from "react";
import { PreferenceSection } from "../preference-section";

export default function PreferenceSectionExample() {
  const [value, setValue] = useState("professional");

  const options = [
    {
      value: "professional",
      label: "Professional",
      description: "Formal and business-oriented responses",
    },
    {
      value: "casual",
      label: "Casual",
      description: "Friendly and conversational tone",
    },
  ];

  return (
    <div className="p-4 max-w-2xl">
      <PreferenceSection
        title="Communication Style"
        description="Choose how your AI assistant communicates"
        options={options}
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
}
