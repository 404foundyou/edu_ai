# routes/chat.py
# Handles chat streaming endpoint
# /chat/stream — sends message, gets streaming response, saves to DB

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from datetime import datetime
from bson import ObjectId
from models.message import ChatRequest
from services.claude_service import stream_claude_response
from middleware.auth_middleware import get_current_user
from database import get_db

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/stream")
async def chat_stream(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    user_id = str(current_user["_id"])

    # ── Step 1: Get or create conversation ──────────────────
    if request.conversation_id:
        conversation_id = request.conversation_id
    else:
        # Create new conversation with temporary title
        new_conv = {
            "user_id": user_id,
            "title": request.message[:50],  # first 50 chars as temp title
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = await db.conversations.insert_one(new_conv)
        conversation_id = str(result.inserted_id)

    # ── Step 2: Save user's message to DB ────────────────────
    user_message = {
        "conversation_id": conversation_id,
        "role": "user",
        "content": request.message,
        "created_at": datetime.utcnow()
    }
    await db.messages.insert_one(user_message)

    # ── Step 3: Load full conversation history ───────────────
    history_cursor = db.messages.find(
        {"conversation_id": conversation_id}
    ).sort("created_at", 1)

    history = await history_cursor.to_list(length=100)
    claude_messages = [
        {"role": msg["role"], "content": msg["content"]}
        for msg in history
    ]

    # ── Step 4: Stream response from Claude ───────────────────
    async def generate():
        full_response = ""

        # Send conversation_id first so frontend knows it
        yield f"data: {{\"type\": \"conversation_id\", \"value\": \"{conversation_id}\"}}\n\n"

        async for chunk in stream_claude_response(claude_messages):
            full_response += chunk
            # Escape newlines for SSE format
            safe_chunk = chunk.replace("\n", "\\n").replace('"', '\\"')
            yield f"data: {{\"type\": \"chunk\", \"value\": \"{safe_chunk}\"}}\n\n"

        # Save Claude's full response to DB after streaming completes
        ai_message = {
            "conversation_id": conversation_id,
            "role": "assistant",
            "content": full_response,
            "created_at": datetime.utcnow()
        }
        await db.messages.insert_one(ai_message)

        # Update conversation's updated_at timestamp
        await db.conversations.update_one(
            {"_id": ObjectId(conversation_id)},
            {"$set": {"updated_at": datetime.utcnow()}}
        )

        yield f"data: {{\"type\": \"done\"}}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


@router.post("/regenerate")
async def chat_regenerate(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    conversation_id = request.conversation_id

    # Delete the last assistant message (the one being regenerated)
    last_assistant = await db.messages.find_one(
        {"conversation_id": conversation_id, "role": "assistant"},
        sort=[("created_at", -1)]
    )
    if last_assistant:
        await db.messages.delete_one({"_id": last_assistant["_id"]})

    # Load conversation history (without the deleted message)
    history_cursor = db.messages.find(
        {"conversation_id": conversation_id}
    ).sort("created_at", 1)

    history = await history_cursor.to_list(length=100)
    claude_messages = [
        {"role": msg["role"], "content": msg["content"]}
        for msg in history
    ]

    async def generate():
        full_response = ""

        async for chunk in stream_claude_response(claude_messages):
            full_response += chunk
            safe_chunk = chunk.replace("\n", "\\n").replace('"', '\\"')
            yield f"data: {{\"type\": \"chunk\", \"value\": \"{safe_chunk}\"}}\n\n"

        ai_message = {
            "conversation_id": conversation_id,
            "role": "assistant",
            "content": full_response,
            "created_at": datetime.utcnow()
        }
        await db.messages.insert_one(ai_message)

        yield f"data: {{\"type\": \"done\"}}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")