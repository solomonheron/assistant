import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface AIToolCardProps {
  icon: LucideIcon;
  name: string;
  description: string;
  status: "coming_soon" | "active" | "inactive";
  testId?: string;
}

export function AIToolCard({ icon: Icon, name, description, status, testId }: AIToolCardProps) {
  const statusConfig = {
    coming_soon: {
      label: "Coming Soon",
      variant: "outline" as const,
    },
    active: {
      label: "Active",
      variant: "default" as const,
    },
    inactive: {
      label: "Inactive",
      variant: "secondary" as const,
    },
  };

  const config = statusConfig[status];

  return (
    <Card className="hover-elevate transition-all" data-testid={testId}>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">{name}</CardTitle>
          </div>
        </div>
        <Badge variant={config.variant}>{config.label}</Badge>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
