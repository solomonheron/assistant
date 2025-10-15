import { ChatMessage } from "../chat-message";

export default function ChatMessageExample() {
  return (
    <div className="p-4 space-y-4 max-w-2xl">
      <ChatMessage
        content="Hello! How can I help you today?"
        role="assistant"
        timestamp={new Date()}
      />
      <ChatMessage
        content="I need help organizing my tasks for the week"
        role="user"
        timestamp={new Date()}
      />
    </div>
  );
}
