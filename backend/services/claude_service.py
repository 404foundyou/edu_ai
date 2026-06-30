# services/claude_service.py
# Handles AI streaming — currently using Groq (free tier) for testing
# Will switch back to Claude once credits are added — same function signature

from groq import Groq
from config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

# System prompt — defines AI's personality in our app
SYSTEM_PROMPT = """You are a helpful AI assistant in edu_ai.
You explain things clearly and simply.
If asked about code, always give working examples.
Keep responses concise unless asked for detail."""


async def stream_claude_response(messages: list):
    """
    Streams response word by word.
    messages: list of {"role": "user"/"assistant", "content": "..."}
    Yields: text chunks as they arrive
    """
    # Add system prompt at the start
    full_messages = [{"role": "system", "content": SYSTEM_PROMPT}] + messages

    stream = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=full_messages,
        stream=True,
        max_tokens=2048
    )

    for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            yield content