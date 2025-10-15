import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
  timestamp?: Date;
}

export function ChatMessage({ content, role, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-3 mb-4", isUser && "flex-row-reverse")} data-testid={`message-${role}`}>
      <Avatar className="h-8 w-8 mt-1">
        <AvatarFallback className={cn(isUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      <div className={cn("flex flex-col gap-1 max-w-[70%]", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-lg px-4 py-2",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-card-border"
          )}
        >
          <p className="text-sm leading-relaxed">{content}</p>
        </div>
        {timestamp && (
          <span className="text-xs text-muted-foreground px-1">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
}
