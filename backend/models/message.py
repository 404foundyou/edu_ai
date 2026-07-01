# models/message.py
# Defines the structure for chat messages and requests

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    conversation_id: Optional[str] = None
    message: str
    persona: Optional[str] = "default"

class MessageInDB(BaseModel):
    conversation_id: str
    role: str
    content: str
    created_at: datetime