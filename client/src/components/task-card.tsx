import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ id, title, description, completed, onToggle, onEdit, onDelete }: TaskCardProps) {
  return (
    <Card className="hover-elevate transition-all group" data-testid={`card-task-${id}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={completed}
            onCheckedChange={() => onToggle(id)}
            className="mt-1"
            data-testid={`checkbox-task-${id}`}
          />
          <div className="flex-1 min-w-0">
            <h3 className={cn("font-medium", completed && "line-through text-muted-foreground")}>
              {title}
            </h3>
            {description && (
              <p className={cn("text-sm text-muted-foreground mt-1", completed && "line-through")}>
                {description}
              </p>
            )}
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(id)}
              data-testid={`button-edit-task-${id}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDelete(id)}
              data-testid={`button-delete-task-${id}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
