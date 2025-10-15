from celery import Celery
from backend.config import settings

# Create Celery app
celery_app = Celery(
    "ai_assistant",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

# Configure Celery
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

# Auto-discover tasks
celery_app.autodiscover_tasks(["backend.tasks"])


# Example task - can be expanded
@celery_app.task
def example_async_task(message: str):
    """Example async task"""
    print(f"Processing async task: {message}")
    return f"Processed: {message}"
