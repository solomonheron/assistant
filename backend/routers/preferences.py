from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.preference import Preference
from backend.schemas.preference import PreferenceCreate, PreferenceUpdate, PreferenceResponse
from backend.services.memory_service import memory_service
import uuid

router = APIRouter(prefix="/api/preferences", tags=["preferences"])


@router.post("/", response_model=PreferenceResponse)
def create_preference(pref: PreferenceCreate, db: Session = Depends(get_db)):
    """Create or update user preferences"""
    user_id = "default_user"
    
    # Check if preferences already exist
    existing = db.query(Preference).filter(Preference.user_id == user_id).first()
    
    if existing:
        # Update existing
        existing.communication_style = pref.communication_style
        existing.theme = pref.theme
        existing.language = pref.language
        db.commit()
        db.refresh(existing)
        preference = existing
    else:
        # Create new
        preference = Preference(
            id=str(uuid.uuid4()),
            user_id=user_id,
            communication_style=pref.communication_style,
            theme=pref.theme,
            language=pref.language
        )
        db.add(preference)
        db.commit()
        db.refresh(preference)
    
    # Also save to LTM for AI context
    memory_service.save_to_ltm(
        db,
        user_id,
        "user_preferences",
        {
            "communication_style": pref.communication_style,
            "theme": pref.theme,
            "language": pref.language
        },
        "User's personalization preferences"
    )
    
    return preference.to_dict()


@router.get("/", response_model=PreferenceResponse)
def get_preferences(db: Session = Depends(get_db)):
    """Get user preferences"""
    user_id = "default_user"
    preference = db.query(Preference).filter(Preference.user_id == user_id).first()
    
    if not preference:
        # Return defaults
        return {
            "id": "default",
            "communicationStyle": "professional",
            "theme": "dark",
            "language": "english",
            "createdAt": None,
            "updatedAt": None
        }
    
    return preference.to_dict()


@router.put("/", response_model=PreferenceResponse)
def update_preferences(pref_data: PreferenceUpdate, db: Session = Depends(get_db)):
    """Update user preferences"""
    user_id = "default_user"
    preference = db.query(Preference).filter(Preference.user_id == user_id).first()
    
    if not preference:
        raise HTTPException(status_code=404, detail="Preferences not found")
    
    update_dict = pref_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(preference, field, value)
    
    db.commit()
    db.refresh(preference)
    
    # Update LTM
    memory_service.save_to_ltm(
        db,
        user_id,
        "user_preferences",
        {
            "communication_style": preference.communication_style,
            "theme": preference.theme,
            "language": preference.language
        },
        "User's personalization preferences"
    )
    
    return preference.to_dict()
