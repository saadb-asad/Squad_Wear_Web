import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker

# Rate Limiting
from slowapi import Limiter
from slowapi.util import get_remote_address

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"), override=True)
load_dotenv(override=True)

# Setup SlowAPI Limiter
limiter = Limiter(key_func=get_remote_address)

DATABASE_URL = os.getenv("DATABASE_URL", "")
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

SQLITE_DB_PATH = os.path.join(BASE_DIR, "squadgear.db")
SQLITE_URL = f"sqlite+aiosqlite:///{SQLITE_DB_PATH}"

def create_engine_for_url(url: str):
    if url.startswith("sqlite"):
        return create_async_engine(url, echo=False)
    return create_async_engine(url, echo=False, connect_args={"statement_cache_size": 0})

try:
    if not DATABASE_URL:
        DATABASE_URL = SQLITE_URL
    engine = create_engine_for_url(DATABASE_URL)
except Exception:
    DATABASE_URL = SQLITE_URL
    engine = create_engine_for_url(DATABASE_URL)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

Base = declarative_base()

def use_sqlite_fallback():
    global engine, AsyncSessionLocal, DATABASE_URL
    DATABASE_URL = SQLITE_URL
    engine = create_engine_for_url(SQLITE_URL)
    AsyncSessionLocal.configure(bind=engine)

# Dependency for FastAPI
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

