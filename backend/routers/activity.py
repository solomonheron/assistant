from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models.stm import ShortTermMemory
from backend.models.task import Task
from backend.models.preference import Preference
from datetime import datetime

router = APIRouter(prefix="/api/activity", tags=["activity"])


@router.get("/recent")
def get_recent_activity(db: Session = Depends(get_db)):
    """Get recent user activity across all features"""
    user_id = "default_user"
    activities = []
    
    # Get recent messages
    recent_messages = db.query(ShortTermMemory).filter(
        ShortTermMemory.user_id == user_id,
        ShortTermMemory.role == "user"
    ).order_by(ShortTermMemory.created_at.desc()).limit(3).all()
    
    for msg in recent_messages:
        activities.append({
            "id": msg.id,
            "type": "message",
            "title": "New conversation",
            "description": msg.content[:50] + "..." if len(msg.content) > 50 else msg.content,
            "timestamp": msg.created_at.isoformat() if msg.created_at else datetime.utcnow().isoformat()
        })
    
    # Get recent tasks
    recent_tasks = db.query(Task).filter(
        Task.user_id == user_id,
        Task.completed == True
    ).order_by(Task.updated_at.desc()).limit(2).all()
    
    for task in recent_tasks:
        activities.append({
            "id": task.id,
            "type": "task",
            "title": "Task completed",
            "description": task.title,
            "timestamp": task.updated_at.isoformat() if task.updated_at else datetime.utcnow().isoformat()
        })
    
    # Get preference updates
    prefs = db.query(Preference).filter(
        Preference.user_id == user_id
    ).order_by(Preference.updated_at.desc()).limit(1).all()
    
    for pref in prefs:
        if pref.updated_at:
            activities.append({
                "id": pref.id,
                "type": "preference",
                "title": "Preferences updated",
                "description": f"Changed to {pref.communication_style} style",
                "timestamp": pref.updated_at.isoformat()
            })
    
    # Sort by timestamp
    activities.sort(key=lambda x: x["timestamp"], reverse=True)
    
    return activities[:5]  # Return top 5 most recent
