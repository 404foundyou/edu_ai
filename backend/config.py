# config.py
# Loads all environment variables from .env file
# Single source of truth for all settings

from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

# MongoDB
MONGODB_URL = os.getenv("MONGODB_URL")
DB_NAME = os.getenv("DB_NAME", "edu_ai")

# JWT
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRY_HOURS = int(os.getenv("JWT_EXPIRY_HOURS", "24"))

# Anthropic
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

# App
APP_ENV = os.getenv("APP_ENV", "development")