from pydantic import BaseModel
from typing import Optional, Literal


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str
    model_size: Literal["small", "medium", "large"] = "medium"
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    id: str
    role: str
    content: str
    model_used: str
    conversation_id: str
