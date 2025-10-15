from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/settings", tags=["settings"])


class IntegrationSettings(BaseModel):
    email_enabled: bool = False
    whatsapp_enabled: bool = False
    calendar_enabled: bool = False


class AccountSettings(BaseModel):
    email: Optional[str] = None
    display_name: Optional[str] = None


@router.get("/integrations", response_model=IntegrationSettings)
def get_integration_settings(db: Session = Depends(get_db)):
    """Get integration settings - placeholder for future implementation"""
    # TODO: Implement actual storage and retrieval
    return IntegrationSettings()


@router.put("/integrations", response_model=IntegrationSettings)
def update_integration_settings(settings: IntegrationSettings, db: Session = Depends(get_db)):
    """Update integration settings - placeholder for future implementation"""
    # TODO: Implement actual storage
    return settings


@router.get("/account", response_model=AccountSettings)
def get_account_settings(db: Session = Depends(get_db)):
    """Get account settings - placeholder"""
    # TODO: Implement actual user management
    return AccountSettings(
        email="demo@example.com",
        display_name="Demo User"
    )


@router.put("/account", response_model=AccountSettings)
def update_account_settings(settings: AccountSettings, db: Session = Depends(get_db)):
    """Update account settings - placeholder"""
    # TODO: Implement actual user management
    return settings
