from sqlalchemy import Column, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from backend.database import Base


class LongTermMemory(Base):
    """
    Long-Term Memory (LTM) - Stores user preferences, important information
    Persists critical data for personalization
    """
    __tablename__ = "long_term_memory"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True, default="default_user")
    key = Column(String, nullable=False, index=True)  # e.g., 'user_preferences', 'important_facts'
    value = Column(JSON, nullable=False)  # Flexible JSON storage
    description = Column(Text, nullable=True)  # Human-readable description
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "key": self.key,
            "value": self.value,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
