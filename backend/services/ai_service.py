from typing import List, Dict, Optional
from openai import AsyncOpenAI
from anthropic import AsyncAnthropic
from backend.config import settings
from backend.models.stm import ShortTermMemory
from backend.models.ltm import LongTermMemory
from sqlalchemy.orm import Session


class AIService:
    """Service for handling AI model interactions with STM/LTM context"""
    
    def __init__(self):
        self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
        self.anthropic_client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY) if settings.ANTHROPIC_API_KEY else None
    
    async def get_model_response(
        self,
        message: str,
        model_size: str,
        db: Session,
        conversation_id: str,
        user_id: str = "default_user"
    ) -> tuple[str, str]:
        """
        Get AI response using selected model size with STM/LTM context
        
        Returns: (response_content, model_name_used)
        """
        # Get context from STM and LTM
        context = await self._build_context(db, user_id, conversation_id)
        
        # Select model based on size
        model_name = self._get_model_name(model_size)
        
        # Build messages with context
        messages = context + [{"role": "user", "content": message}]
        
        # Get response based on model provider
        if model_size in ["small", "medium"]:
            # OpenAI models
            response = await self._get_openai_response(messages, model_name)
        else:
            # Anthropic model for large
            response = await self._get_anthropic_response(messages, model_name)
        
        return response, model_name
    
    async def _build_context(self, db: Session, user_id: str, conversation_id: str) -> List[Dict]:
        """Build context from STM and LTM"""
        messages = []
        
        # Get LTM (user preferences and important info)
        ltm_entries = db.query(LongTermMemory).filter(
            LongTermMemory.user_id == user_id
        ).all()
        
        # Build system message with LTM context
        system_context = self._build_system_message(ltm_entries)
        if system_context:
            messages.append({"role": "system", "content": system_context})
        
        # Get STM (recent conversation history)
        stm_entries = db.query(ShortTermMemory).filter(
            ShortTermMemory.conversation_id == conversation_id
        ).order_by(ShortTermMemory.created_at.desc()).limit(
            settings.STM_CONVERSATION_LIMIT * 2  # Get last 5 exchanges (10 messages)
        ).all()
        
        # Add STM to messages (reverse to get chronological order)
        for entry in reversed(stm_entries):
            messages.append({
                "role": entry.role,
                "content": entry.content
            })
        
        return messages
    
    def _build_system_message(self, ltm_entries: List[LongTermMemory]) -> str:
        """Build system message from LTM data"""
        if not ltm_entries:
            return "You are a helpful AI assistant."
        
        context_parts = ["You are a helpful AI assistant with the following context about the user:"]
        
        for entry in ltm_entries:
            if entry.key == "user_preferences":
                prefs = entry.value
                context_parts.append(f"\nUser Preferences:")
                context_parts.append(f"- Communication style: {prefs.get('communication_style', 'professional')}")
                context_parts.append(f"- Language: {prefs.get('language', 'english')}")
            elif entry.key == "important_facts":
                context_parts.append(f"\nImportant facts: {entry.value}")
        
        return "\n".join(context_parts)
    
    def _get_model_name(self, model_size: str) -> str:
        """Get model name based on size"""
        models = {
            "small": settings.SMALL_MODEL,
            "medium": settings.MEDIUM_MODEL,
            "large": settings.LARGE_MODEL
        }
        return models.get(model_size, settings.MEDIUM_MODEL)
    
    async def _get_openai_response(self, messages: List[Dict], model: str) -> str:
        """Get response from OpenAI"""
        if not self.openai_client:
            return "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable."
        
        try:
            response = await self.openai_client.chat.completions.create(
                model=model,
                messages=messages
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error getting OpenAI response: {str(e)}"
    
    async def _get_anthropic_response(self, messages: List[Dict], model: str) -> str:
        """Get response from Anthropic"""
        if not self.anthropic_client:
            return "Anthropic API key not configured. Please set ANTHROPIC_API_KEY environment variable."
        
        try:
            # Extract system message if present
            system_msg = ""
            user_messages = []
            for msg in messages:
                if msg["role"] == "system":
                    system_msg = msg["content"]
                else:
                    user_messages.append(msg)
            
            response = await self.anthropic_client.messages.create(
                model=model,
                max_tokens=1024,
                system=system_msg if system_msg else None,
                messages=user_messages
            )
            return response.content[0].text
        except Exception as e:
            return f"Error getting Anthropic response: {str(e)}"


ai_service = AIService()
