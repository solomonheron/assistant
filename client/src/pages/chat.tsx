import { useState, useEffect, useRef } from "react";
import { ChatMessage as ChatMessageComponent } from "@/components/chat-message";
import { ChatInput } from "@/components/chat-input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Sparkles, Bot, Upload, Image as ImageIcon } from "lucide-react";
import { wsClient, type ChatMessage, type WSResponse } from "@/lib/websocket";
import { useToast } from "@/hooks/use-toast";

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [modelSize, setModelSize] = useState<"small" | "medium" | "large">("medium");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Connect to WebSocket
    wsClient.connect();

    wsClient.onMessage((response: WSResponse) => {
      setIsTyping(false);
      const assistantMessage: ChatMessage = {
        id: response.id,
        role: "assistant",
        content: response.content,
        model_used: response.model_used,
        conversation_id: response.conversation_id,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      
      if (!conversationId) {
        setConversationId(response.conversation_id);
      }
    });

    wsClient.onError((error: string) => {
      setIsTyping(false);
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    });

    wsClient.onClose(() => {
      setIsConnecting(false);
    });

    // Check connection status
    const checkConnection = setInterval(() => {
      setIsConnecting(!wsClient.isConnected());
    }, 1000);

    return () => {
      clearInterval(checkConnection);
      wsClient.disconnect();
    };
  }, [conversationId, toast]);

  const handleSendMessage = (content: string) => {
    // Add user message to UI
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Send via WebSocket
    wsClient.sendMessage({
      message: content,
      model_size: modelSize,
      conversation_id: conversationId,
    });

    // Clear file selection
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const suggestedPrompts = [
    "Help me plan my day",
    "What tasks should I prioritize?",
    "Give me productivity tips",
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header with model selection */}
      <div className="border-b p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <span className="font-semibold">AI Assistant</span>
          {isConnecting && (
            <Badge variant="outline" className="text-xs">Connecting...</Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Model:</span>
          <Select value={modelSize} onValueChange={(value: "small" | "medium" | "large") => setModelSize(value)}>
            <SelectTrigger className="w-32" data-testid="select-model-size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small" data-testid="option-model-small">
                Small (Fast)
              </SelectItem>
              <SelectItem value="medium" data-testid="option-model-medium">
                Medium
              </SelectItem>
              <SelectItem value="large" data-testid="option-model-large">
                Large (Best)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-primary/10">
                  <Sparkles className="h-12 w-12 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Welcome to Your AI Assistant</h3>
                <p className="text-muted-foreground">
                  Ask me anything! I can help with tasks, answer questions, and provide insights.
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id}>
              <ChatMessageComponent
                content={message.content}
                role={message.role}
                timestamp={message.timestamp}
              />
              {message.model_used && message.role === "assistant" && (
                <div className="flex justify-end mt-1">
                  <Badge variant="outline" className="text-xs">
                    {message.model_used}
                  </Badge>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <Card className="p-4 max-w-[70%]">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            </Card>
          )}
          
          {messages.length === 0 && (
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

      {/* File preview */}
      {previewUrl && (
        <div className="border-t p-4">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <img src={previewUrl} alt="Preview" className="h-20 w-20 object-cover rounded" />
            <div className="flex-1">
              <p className="text-sm font-medium">{selectedFile?.name}</p>
              <p className="text-xs text-muted-foreground">
                {selectedFile && (selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
              data-testid="button-remove-file"
            >
              Remove
            </Button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t">
        <div className="flex items-end gap-2 p-4 max-w-4xl mx-auto">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.txt,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            data-testid="button-upload-file"
            title="Upload file or image"
          >
            {selectedFile?.type.startsWith("image/") ? (
              <ImageIcon className="h-4 w-4" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </Button>
          <div className="flex-1">
            <ChatInput onSend={handleSendMessage} placeholder="Type your message..." />
          </div>
        </div>
      </div>
    </div>
  );
}
