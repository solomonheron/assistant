import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";

interface IntegrationCardProps {
  icon: LucideIcon;
  name: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  testId?: string;
}

export function IntegrationCard({ icon: Icon, name, description, enabled, onToggle, testId }: IntegrationCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-muted">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id={`integration-${name}`}
              checked={enabled}
              onCheckedChange={onToggle}
              data-testid={testId}
            />
            <Label htmlFor={`integration-${name}`} className="sr-only">
              Toggle {name}
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
