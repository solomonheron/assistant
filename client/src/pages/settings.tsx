import { useState } from "react";
import { IntegrationCard } from "@/components/integration-card";
import { AIToolCard } from "@/components/ai-tool-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Settings as SettingsIcon, 
  Mail, 
  MessageCircle, 
  Calendar, 
  AlertTriangle,
  Globe,
  Code,
  Smartphone
} from "lucide-react";

export default function Settings() {
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [calendarEnabled, setCalendarEnabled] = useState(false);

  const integrations = [
    {
      icon: Mail,
      name: "Email",
      description: "Connect your email for smart inbox management",
      enabled: emailEnabled,
      onToggle: setEmailEnabled,
      testId: "switch-integration-email",
    },
    {
      icon: MessageCircle,
      name: "WhatsApp",
      description: "Receive updates and interact via WhatsApp",
      enabled: whatsappEnabled,
      onToggle: setWhatsappEnabled,
      testId: "switch-integration-whatsapp",
    },
    {
      icon: Calendar,
      name: "Calendar",
      description: "Sync your calendar for better scheduling",
      enabled: calendarEnabled,
      onToggle: setCalendarEnabled,
      testId: "switch-integration-calendar",
    },
  ];

  const aiTools = [
    {
      icon: Globe,
      name: "Web Search",
      description: "Enable AI to search the web for real-time information",
      status: "coming_soon" as const,
      testId: "card-tool-web-search",
    },
    {
      icon: Mail,
      name: "Gmail Integration",
      description: "Let AI read and compose emails on your behalf",
      status: "coming_soon" as const,
      testId: "card-tool-gmail",
    },
    {
      icon: Smartphone,
      name: "WhatsApp Automation",
      description: "Send messages and manage WhatsApp conversations",
      status: "coming_soon" as const,
      testId: "card-tool-whatsapp-auto",
    },
    {
      icon: Code,
      name: "Playwright Automation",
      description: "Automate browser tasks and web scraping",
      status: "coming_soon" as const,
      testId: "card-tool-playwright",
    },
  ];

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                defaultValue="demo@example.com"
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                placeholder="Your Name"
                defaultValue="Demo User"
                data-testid="input-name"
              />
            </div>
            <Button data-testid="button-save-account">Save Changes</Button>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Integrations</h2>
          <p className="text-sm text-muted-foreground">
            Connect external services to enhance your AI assistant
          </p>
          {integrations.map((integration) => (
            <IntegrationCard key={integration.name} {...integration} />
          ))}
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">AI Tools & Capabilities</h2>
          <p className="text-sm text-muted-foreground">
            Advanced tools that will be available to your AI assistant
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {aiTools.map((tool) => (
              <AIToolCard key={tool.name} {...tool} />
            ))}
          </div>
        </div>

        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible actions for your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" data-testid="button-delete-account">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
