from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PreferenceCreate(BaseModel):
    communication_style: str = "professional"
    theme: str = "dark"
    language: str = "english"


class PreferenceUpdate(BaseModel):
    communication_style: Optional[str] = None
    theme: Optional[str] = None
    language: Optional[str] = None


class PreferenceResponse(BaseModel):
    id: str
    communicationStyle: str
    theme: str
    language: str
    createdAt: Optional[datetime]
    updatedAt: Optional[datetime]

    class Config:
        from_attributes = True
