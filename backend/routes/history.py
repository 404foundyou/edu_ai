# routes/history.py
# Handles conversation history endpoints
# GET /history          — all conversations for current user
# GET /history/{id}     — all messages in a conversation
# DELETE /history/{id}  — delete a conversation
# PATCH /history/{id}   — rename a conversation

from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from pydantic import BaseModel
from middleware.auth_middleware import get_current_user
from database import get_db

router = APIRouter(prefix="/history", tags=["History"])


# ── Get all conversations ─────────────────────────────────

@router.get("/")
async def get_conversations(current_user: dict = Depends(get_current_user)):
    db = get_db()
    user_id = str(current_user["_id"])

    cursor = db.conversations.find(
        {"user_id": user_id}
    ).sort("updated_at", -1)

    conversations = await cursor.to_list(length=100)

    return [
        {
            "id": str(conv["_id"]),
            "title": conv["title"],
            "created_at": conv["created_at"],
            "updated_at": conv["updated_at"]
        }
        for conv in conversations
    ]


# ── Get messages in a conversation ───────────────────────

@router.get("/{conversation_id}")
async def get_messages(
    conversation_id: str,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    user_id = str(current_user["_id"])

    # Verify conversation belongs to current user
    conversation = await db.conversations.find_one({
        "_id": ObjectId(conversation_id),
        "user_id": user_id
    })

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    cursor = db.messages.find(
        {"conversation_id": conversation_id}
    ).sort("created_at", 1)

    messages = await cursor.to_list(length=500)

    return [
        {
            "id": str(msg["_id"]),
            "role": msg["role"],
            "content": msg["content"],
            "created_at": msg["created_at"]
        }
        for msg in messages
    ]


# ── Delete a conversation ─────────────────────────────────

@router.delete("/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    user_id = str(current_user["_id"])

    # Verify ownership
    conversation = await db.conversations.find_one({
        "_id": ObjectId(conversation_id),
        "user_id": user_id
    })

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Delete conversation and all its messages
    await db.conversations.delete_one({"_id": ObjectId(conversation_id)})
    await db.messages.delete_many({"conversation_id": conversation_id})

    return {"message": "Conversation deleted"}


# ── Rename a conversation ─────────────────────────────────

class RenameRequest(BaseModel):
    title: str

@router.patch("/{conversation_id}")
async def rename_conversation(
    conversation_id: str,
    body: RenameRequest,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    user_id = str(current_user["_id"])

    conversation = await db.conversations.find_one({
        "_id": ObjectId(conversation_id),
        "user_id": user_id
    })

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    await db.conversations.update_one(
        {"_id": ObjectId(conversation_id)},
        {"$set": {"title": body.title}}
    )

    return {"message": "Conversation renamed"}