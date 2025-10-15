#!/usr/bin/env python3
"""
Database initialization script
Creates all tables and sets up initial data
"""

from backend.database import engine, Base
from backend.models import ShortTermMemory, LongTermMemory, Task, Preference

def init_database():
    """Initialize database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully!")
    print("\nTables created:")
    print("  - short_term_memory (STM)")
    print("  - long_term_memory (LTM)")
    print("  - tasks")
    print("  - preferences")
    

if __name__ == "__main__":
    init_database()
