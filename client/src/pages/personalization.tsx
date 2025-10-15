import { useState } from "react";
import { PreferenceSection } from "@/components/preference-section";
import { Palette } from "lucide-react";

export default function Personalization() {
  // todo: remove mock functionality
  const [communicationStyle, setCommunicationStyle] = useState("professional");
  const [language, setLanguage] = useState("english");

  const communicationOptions = [
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
    {
      value: "concise",
      label: "Concise",
      description: "Brief and to-the-point answers",
    },
  ];

  const languageOptions = [
    {
      value: "english",
      label: "English",
      description: "Communicate in English",
    },
    {
      value: "spanish",
      label: "Spanish",
      description: "Communicate in Spanish",
    },
    {
      value: "french",
      label: "French",
      description: "Communicate in French",
    },
  ];

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Palette className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Personalization</h1>
            <p className="text-muted-foreground mt-1">Customize your AI assistant experience</p>
          </div>
        </div>

        <div className="space-y-6">
          <PreferenceSection
            title="Communication Style"
            description="Choose how your AI assistant communicates with you"
            options={communicationOptions}
            value={communicationStyle}
            onValueChange={setCommunicationStyle}
            testId="radio-communication"
          />

          <PreferenceSection
            title="Language"
            description="Select your preferred language for conversations"
            options={languageOptions}
            value={language}
            onValueChange={setLanguage}
            testId="radio-language"
          />
        </div>
      </div>
    </div>
  );
}
