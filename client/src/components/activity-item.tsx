import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  iconColor?: string;
}

export function ActivityItem({ icon: Icon, title, description, time, iconColor = "text-primary" }: ActivityItemProps) {
  return (
    <div className="flex gap-3 pb-4 last:pb-0">
      <div className={cn("p-2 rounded-lg bg-muted h-fit", iconColor)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  );
}
