# models/message.py
# Defines the structure for chat messages and requests

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Single message in a conversation
class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str

# What frontend sends when starting/continuing a chat
class ChatRequest(BaseModel):
    conversation_id: Optional[str] = None  # None = new conversation
    message: str

# What we store in MongoDB for each message
class MessageInDB(BaseModel):
    conversation_id: str
    role: str
    content: str
    created_at: datetime