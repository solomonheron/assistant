from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.services.ai_service import ai_service
from backend.services.memory_service import memory_service
from backend.schemas.chat import ChatRequest, ChatResponse
import json
import uuid

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, db: Session = Depends(get_db)):
    """WebSocket endpoint for real-time chat"""
    await websocket.accept()
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            request_data = json.loads(data)
            
            message = request_data.get("message")
            model_size = request_data.get("model_size", "medium")
            conversation_id = request_data.get("conversation_id") or str(uuid.uuid4())
            user_id = "default_user"
            
            # Save user message to STM
            memory_service.add_to_stm(
                db, user_id, "user", message, conversation_id
            )
            
            # Get AI response
            try:
                response_content, model_used = await ai_service.get_model_response(
                    message, model_size, db, conversation_id, user_id
                )
                
                # Save assistant response to STM
                assistant_message = memory_service.add_to_stm(
                    db, user_id, "assistant", response_content, conversation_id, model_used
                )
                
                # Send response back to client
                response = {
                    "id": assistant_message.id,
                    "role": "assistant",
                    "content": response_content,
                    "model_used": model_used,
                    "conversation_id": conversation_id
                }
                
                await websocket.send_text(json.dumps(response))
            
            except Exception as e:
                error_response = {
                    "error": str(e),
                    "conversation_id": conversation_id
                }
                await websocket.send_text(json.dumps(error_response))
    
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.close()


@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatRequest, db: Session = Depends(get_db)):
    """REST endpoint for chat (alternative to WebSocket)"""
    user_id = "default_user"
    conversation_id = request.conversation_id or str(uuid.uuid4())
    
    # Save user message to STM
    memory_service.add_to_stm(
        db, user_id, "user", request.message, conversation_id
    )
    
    # Get AI response
    response_content, model_used = await ai_service.get_model_response(
        request.message, request.model_size, db, conversation_id, user_id
    )
    
    # Save assistant response to STM
    assistant_message = memory_service.add_to_stm(
        db, user_id, "assistant", response_content, conversation_id, model_used
    )
    
    return ChatResponse(
        id=assistant_message.id,
        role="assistant",
        content=response_content,
        model_used=model_used,
        conversation_id=conversation_id
    )
