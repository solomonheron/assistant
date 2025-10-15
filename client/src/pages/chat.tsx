import { useState } from "react";
import { ChatMessage } from "@/components/chat-message";
import { ChatInput } from "@/components/chat-input";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

type ChatMessage = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

export default function Chat() {
  // todo: remove mock functionality
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "Hello! I'm your personal AI assistant. How can I help you today?",
      role: "assistant" as const,
      timestamp: new Date(Date.now() - 3600000),
    },
  ]);

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      role: "user" as const,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);

    // todo: remove mock functionality - Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: "I understand your request. In a full implementation, I would process this and provide a helpful response based on your preferences and context.",
        role: "assistant" as const,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const suggestedPrompts = [
    "Help me plan my day",
    "What tasks should I prioritize?",
    "Give me productivity tips",
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              role={message.role}
              timestamp={message.timestamp}
            />
          ))}
          
          {messages.length === 1 && (
            <div className="mt-8 space-y-3">
              <p className="text-sm text-muted-foreground text-center">Try asking:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendMessage(prompt)}
                    className="hover-elevate"
                    data-testid={`button-suggested-${index}`}
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
}
