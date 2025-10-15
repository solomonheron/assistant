from sqlalchemy.orm import Session
from backend.models.task import Task
from backend.schemas.task import TaskCreate, TaskUpdate
import uuid


class TaskService:
    """Service for task management operations"""
    
    @staticmethod
    def create_task(db: Session, task_data: TaskCreate, user_id: str = "default_user") -> Task:
        """Create a new task"""
        task = Task(
            id=str(uuid.uuid4()),
            user_id=user_id,
            title=task_data.title,
            description=task_data.description,
            completed=task_data.completed
        )
        db.add(task)
        db.commit()
        db.refresh(task)
        return task
    
    @staticmethod
    def get_tasks(db: Session, user_id: str = "default_user") -> list[Task]:
        """Get all tasks for a user"""
        return db.query(Task).filter(Task.user_id == user_id).all()
    
    @staticmethod
    def get_task(db: Session, task_id: str, user_id: str = "default_user") -> Task:
        """Get a specific task"""
        return db.query(Task).filter(
            Task.id == task_id,
            Task.user_id == user_id
        ).first()
    
    @staticmethod
    def update_task(
        db: Session,
        task_id: str,
        task_data: TaskUpdate,
        user_id: str = "default_user"
    ) -> Task:
        """Update a task"""
        task = TaskService.get_task(db, task_id, user_id)
        if not task:
            return None
        
        update_data = task_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)
        
        db.commit()
        db.refresh(task)
        return task
    
    @staticmethod
    def delete_task(db: Session, task_id: str, user_id: str = "default_user") -> bool:
        """Delete a task"""
        task = TaskService.get_task(db, task_id, user_id)
        if not task:
            return False
        
        db.delete(task)
        db.commit()
        return True


task_service = TaskService()
