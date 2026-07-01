# services/claude_service.py
# Handles all AI communication — streaming + title generation
# Currently using Groq (free tier) — swap back to Claude when credits available

from groq import Groq
from config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

# ── Persona System Prompts ────────────────────────────────

PERSONAS = {
    "default": """You are a helpful AI assistant in edu_ai.
You explain things clearly and simply.
If asked about code, always give working examples.
Keep responses concise unless asked for detail.""",

    "teacher": """You are a patient, encouraging teacher in edu_ai.
You explain everything step by step using simple language.
Always use real-world examples and analogies.
Break complex topics into small digestible pieces.
End explanations with a quick summary or key takeaway.""",

    "developer": """You are a senior software developer assistant in edu_ai.
Be technical, precise, and concise.
Always provide working code examples with best practices.
Point out edge cases, performance considerations, and potential bugs.
Skip basic explanations unless asked — assume the user knows how to code.""",

    "friend": """You are a friendly, casual AI companion in edu_ai.
Be warm, supportive, and conversational — like texting a smart friend.
Use simple everyday language, avoid jargon.
Be encouraging and positive.
Keep responses short and natural unless more detail is needed."""
}


async def stream_claude_response(messages: list, persona: str = "default"):
    """Streams response word by word using selected persona"""
    system_prompt = PERSONAS.get(persona, PERSONAS["default"])

    full_messages = [{"role": "system", "content": system_prompt}] + messages

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