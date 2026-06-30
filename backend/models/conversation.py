# models/conversation.py
# Defines the structure for a conversation (chat thread)

from pydantic import BaseModel
from datetime import datetime

class ConversationInDB(BaseModel):
    user_id: str
    title: str
    created_at: datetime
    updated_at: datetime

class ConversationResponse(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime