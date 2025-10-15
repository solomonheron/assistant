#!/bin/bash
# Script to run the FastAPI backend

echo "Starting FastAPI backend..."

# Initialize database if needed
python init_db.py

# Run the FastAPI application
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
