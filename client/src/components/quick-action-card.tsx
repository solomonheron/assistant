import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  testId?: string;
}

export function QuickActionCard({ title, description, icon: Icon, href, testId }: QuickActionCardProps) {
  return (
    <Link href={href}>
      <Card className="hover-elevate active-elevate-2 cursor-pointer transition-all" data-testid={testId}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
