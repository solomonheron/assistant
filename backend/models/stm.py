from sqlalchemy import Column, String, Text, DateTime, Integer
from sqlalchemy.sql import func
from backend.database import Base


class ShortTermMemory(Base):
    """
    Short-Term Memory (STM) - Stores recent conversations
    Keeps only the last 5 conversations for context
    """
    __tablename__ = "short_term_memory"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True, default="default_user")
    role = Column(String, nullable=False)  # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    model_used = Column(String, nullable=True)  # Which model was used for this response
    conversation_id = Column(String, index=True)  # Group messages by conversation
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "role": self.role,
            "content": self.content,
            "model_used": self.model_used,
            "conversation_id": self.conversation_id,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
