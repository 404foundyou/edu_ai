# services/claude_service.py
# Handles all AI communication — streaming + title generation
# Currently using Groq (free tier) — swap back to Claude when credits available

from groq import Groq
from config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

SYSTEM_PROMPT = """You are a helpful AI assistant in edu_ai.
You explain things clearly and simply.
If asked about code, always give working examples.
Keep responses concise unless asked for detail."""


async def stream_claude_response(messages: list):
    """Streams response word by word"""
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


def generate_title(user_message: str, ai_response: str) -> str:
    """Generates a short 4-6 word title for a conversation"""
    prompt = f"""Based on this conversation, generate a short title (4-6 words max).
Return ONLY the title, nothing else. No quotes, no punctuation at the end.

User: {user_message[:200]}
Assistant: {ai_response[:200]}

Title:"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=20,
        messages=[{"role": "user", "content": prompt}]
    )

    title = response.choices[0].message.content.strip()
    return title[:60]