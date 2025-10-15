from sqlalchemy.orm import Session
from sqlalchemy import desc
from backend.models.stm import ShortTermMemory
from backend.models.ltm import LongTermMemory
from backend.config import settings
import uuid


class MemoryService:
    """Service for managing STM and LTM"""
    
    @staticmethod
    def add_to_stm(
        db: Session,
        user_id: str,
        role: str,
        content: str,
        conversation_id: str,
        model_used: str = None
    ) -> ShortTermMemory:
        """Add message to short-term memory and maintain limit"""
        # Create new STM entry
        stm_entry = ShortTermMemory(
            id=str(uuid.uuid4()),
            user_id=user_id,
            role=role,
            content=content,
            conversation_id=conversation_id,
            model_used=model_used
        )
        db.add(stm_entry)
        
        # Clean up old entries beyond limit
        MemoryService._cleanup_stm(db, conversation_id)
        
        db.commit()
        db.refresh(stm_entry)
        return stm_entry
    
    @staticmethod
    def _cleanup_stm(db: Session, conversation_id: str):
        """Remove old STM entries beyond the conversation limit"""
        # Get count of messages in this conversation
        message_count = db.query(ShortTermMemory).filter(
            ShortTermMemory.conversation_id == conversation_id
        ).count()
        
        # If we exceed the limit (5 exchanges = 10 messages), remove oldest
        limit = settings.STM_CONVERSATION_LIMIT * 2
        if message_count > limit:
            # Get oldest messages to delete
            to_delete = db.query(ShortTermMemory).filter(
                ShortTermMemory.conversation_id == conversation_id
            ).order_by(ShortTermMemory.created_at).limit(
                message_count - limit
            ).all()
            
            for entry in to_delete:
                db.delete(entry)
    
    @staticmethod
    def get_stm_history(
        db: Session,
        conversation_id: str,
        limit: int = None
    ) -> list:
        """Get STM history for a conversation"""
        query = db.query(ShortTermMemory).filter(
            ShortTermMemory.conversation_id == conversation_id
        ).order_by(desc(ShortTermMemory.created_at))
        
        if limit:
            query = query.limit(limit)
        
        return query.all()
    
    @staticmethod
    def save_to_ltm(
        db: Session,
        user_id: str,
        key: str,
        value: dict,
        description: str = None
    ) -> LongTermMemory:
        """Save or update LTM entry"""
        # Check if entry exists
        existing = db.query(LongTermMemory).filter(
            LongTermMemory.user_id == user_id,
            LongTermMemory.key == key
        ).first()
        
        if existing:
            # Update existing
            existing.value = value
            if description:
                existing.description = description
            db.commit()
            db.refresh(existing)
            return existing
        else:
            # Create new
            ltm_entry = LongTermMemory(
                id=str(uuid.uuid4()),
                user_id=user_id,
                key=key,
                value=value,
                description=description
            )
            db.add(ltm_entry)
            db.commit()
            db.refresh(ltm_entry)
            return ltm_entry
    
    @staticmethod
    def get_ltm(db: Session, user_id: str, key: str = None):
        """Get LTM entries for user"""
        query = db.query(LongTermMemory).filter(
            LongTermMemory.user_id == user_id
        )
        
        if key:
            return query.filter(LongTermMemory.key == key).first()
        else:
            return query.all()


memory_service = MemoryService()
