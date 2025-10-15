# AI Assistant Backend

FastAPI backend for the Personal AI Assistant application with multi-model support, STM/LTM memory system, and tool integration capabilities.

## Architecture

### Core Components

1. **FastAPI Application** (`main.py`)
   - REST API endpoints
   - WebSocket for real-time chat
   - CORS configuration
   - Auto-generated OpenAPI docs at `/docs`

2. **Database Layer** (`database.py`, `models/`)
   - SQLAlchemy ORM
   - PostgreSQL database
   - Models:
     - `ShortTermMemory` (STM): Stores last 5 conversations
     - `LongTermMemory` (LTM): Stores user preferences, important info
     - `Task`: Task management
     - `Preference`: User personalization settings

3. **Services Layer** (`services/`)
   - `ai_service.py`: Multi-model AI integration (OpenAI, Anthropic)
   - `memory_service.py`: STM/LTM management
   - `task_service.py`: Task CRUD operations

4. **API Routers** (`routers/`)
   - `chat.py`: WebSocket & REST chat endpoints
   - `tasks.py`: Task management endpoints
   - `preferences.py`: User preferences endpoints
   - `settings.py`: Settings management endpoints

5. **Celery Tasks** (`celery_app.py`, `tasks/`)
   - Asynchronous task processing
   - Background job execution
   - Redis as message broker

6. **Tool Integrations** (`utils/tool_integrations.py`)
   - Web search (placeholder)
   - Gmail integration (placeholder)
   - WhatsApp integration (placeholder)
   - Playwright automation (placeholder)

## Multi-Model Support

The backend supports three model sizes:

- **Small** (`gpt-4o-mini`): Fast, cost-effective for simple queries
- **Medium** (`gpt-4o`): Balanced performance for most tasks
- **Large** (`claude-3-5-sonnet-20241022`): Most capable for complex reasoning

Models are selected via the `model_size` parameter in chat requests.

## Memory System

### Short-Term Memory (STM)
- Stores recent conversation history
- Maintains last 5 exchanges (10 messages)
- Automatically cleaned up when limit exceeded
- Used for conversation context

### Long-Term Memory (LTM)
- Stores user preferences
- Persists important information
- Flexible JSON storage
- Used for AI personalization

### Context Building
The AI service automatically:
1. Fetches user preferences from LTM
2. Retrieves recent conversation from STM
3. Builds system prompt with user context
4. Sends to selected AI model

## API Endpoints

### Chat
- `WebSocket /api/chat/ws`: Real-time chat
- `POST /api/chat/message`: REST chat endpoint

### Tasks
- `POST /api/tasks`: Create task
- `GET /api/tasks`: List all tasks
- `GET /api/tasks/{id}`: Get specific task
- `PUT /api/tasks/{id}`: Update task
- `DELETE /api/tasks/{id}`: Delete task

### Preferences
- `GET /api/preferences`: Get user preferences
- `POST /api/preferences`: Create/update preferences
- `PUT /api/preferences`: Update preferences

### Settings
- `GET /api/settings/integrations`: Get integration settings
- `PUT /api/settings/integrations`: Update integration settings
- `GET /api/settings/account`: Get account settings
- `PUT /api/settings/account`: Update account settings

## Setup Instructions

### 1. Environment Variables
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `OPENAI_API_KEY`: OpenAI API key
- `ANTHROPIC_API_KEY`: Anthropic API key

### 2. Database Setup
The application will automatically create tables on startup. For migrations, use Alembic:
```bash
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

### 3. Run the Application
```bash
# Development
uvicorn backend.main:app --reload --port 8000

# Production
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

### 4. Run Celery Worker (Optional)
```bash
celery -A backend.celery_app worker --loglevel=info
```

### 5. Run Redis (for Celery)
```bash
redis-server
```

## WebSocket Chat Example

```javascript
const ws = new WebSocket('ws://localhost:8000/api/chat/ws');

ws.onopen = () => {
  ws.send(JSON.stringify({
    message: "Hello, AI!",
    model_size: "medium",
    conversation_id: "unique-conversation-id"
  }));
};

ws.onmessage = (event) => {
  const response = JSON.parse(event.data);
  console.log('AI Response:', response.content);
  console.log('Model Used:', response.model_used);
};
```

## Future Tool Integrations

The `utils/tool_integrations.py` module provides placeholders for:

1. **Web Search**: Integrate with Google/Bing API
2. **Gmail**: Email management via Gmail API
3. **WhatsApp**: Messaging via WhatsApp Business API or Twilio
4. **Playwright**: Browser automation for web tasks

Each tool has a standardized interface ready for implementation.

## Development

### Project Structure
```
backend/
├── __init__.py
├── main.py                 # FastAPI application
├── config.py              # Configuration and settings
├── database.py            # Database setup
├── celery_app.py          # Celery configuration
├── models/                # SQLAlchemy models
│   ├── stm.py
│   ├── ltm.py
│   ├── task.py
│   └── preference.py
├── schemas/               # Pydantic schemas
│   ├── task.py
│   ├── preference.py
│   └── chat.py
├── routers/               # API route handlers
│   ├── chat.py
│   ├── tasks.py
│   ├── preferences.py
│   └── settings.py
├── services/              # Business logic
│   ├── ai_service.py
│   ├── memory_service.py
│   └── task_service.py
├── tasks/                 # Celery tasks
└── utils/                 # Utilities and tools
    └── tool_integrations.py
```

### Adding New Features

1. **New Model**: Add to `services/` directory
2. **New Schema**: Add to `schemas/` directory
3. **New Router**: Add to `routers/` and include in `main.py`
4. **New Tool**: Add to `utils/tool_integrations.py`
5. **New Celery Task**: Add to `tasks/` directory

## Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
