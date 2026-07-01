# main.py
# Entry point of the FastAPI application
# Registers all routes and handles app startup/shutdown

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import connect_db, close_db
from routes.auth import router as auth_router
from routes.chat import router as chat_router
from routes.history import router as history_router



# Initialize FastAPI app
app = FastAPI(
    title="edu_ai API",
    description="Industry-level AI Chatbot Backend",
    version="1.0.0"
)

# CORS — allows React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(history_router)



# Connect to MongoDB on startup
@app.on_event("startup")
async def startup():
    await connect_db()

# Close MongoDB connection on shutdown
@app.on_event("shutdown")
async def shutdown():
    await close_db()

# Health check route — confirms API is running
@app.get("/")
async def root():
    return {
        "status": "online",
        "app": "edu_ai",
        "version": "1.0.0"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}