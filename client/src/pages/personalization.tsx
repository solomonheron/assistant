import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PreferenceSection } from "@/components/preference-section";
import { Button } from "@/components/ui/button";
import { Palette, Loader2, Check } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { useToast } from "@/hooks/use-toast";

interface Preferences {
  id: string;
  communicationStyle: string;
  theme: string;
  language: string;
}

export default function Personalization() {
  const [communicationStyle, setCommunicationStyle] = useState("professional");
  const [language, setLanguage] = useState("english");
  const [hasChanges, setHasChanges] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch preferences
  const { data: preferences, isLoading } = useQuery<Preferences>({
    queryKey: ["/api/preferences"],
  });

  // Set initial values when preferences are loaded
  useEffect(() => {
    if (preferences) {
      setCommunicationStyle(preferences.communicationStyle);
      setLanguage(preferences.language);
    }
  }, [preferences]);

  // Track changes
  useEffect(() => {
    if (preferences) {
      const changed =
        communicationStyle !== preferences.communicationStyle ||
        language !== preferences.language;
      setHasChanges(changed);
    }
  }, [communicationStyle, language, preferences]);

  // Update preferences mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Preferences>) =>
      apiClient.put("/api/preferences/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/preferences"] });
      setHasChanges(false);
      toast({
        title: "Success",
        description: "Your preferences have been updated and saved to your AI's memory",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update preferences",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      communicationStyle,
      language,
    });
  };

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

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Palette className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Personalization</h1>
              <p className="text-muted-foreground mt-1">
                Customize your AI assistant experience
              </p>
            </div>
          </div>
          
          {hasChanges && (
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              data-testid="button-save-preferences"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          )}
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

        <div className="bg-muted/50 border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Note:</strong> Your preferences are automatically saved to your AI's
            long-term memory. The assistant will remember your communication style and language
            preference across all conversations.
          </p>
        </div>
      </div>
    </div>
  );
}
