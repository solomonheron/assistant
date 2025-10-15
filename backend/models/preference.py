from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from backend.database import Base


class Preference(Base):
    """User preferences and personalization settings"""
    __tablename__ = "preferences"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True, default="default_user")
    communication_style = Column(String, default="professional")
    theme = Column(String, default="dark")
    language = Column(String, default="english")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "communicationStyle": self.communication_style,
            "theme": self.theme,
            "language": self.language,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None
        }
