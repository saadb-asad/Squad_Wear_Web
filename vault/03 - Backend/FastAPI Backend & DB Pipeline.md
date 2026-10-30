# FastAPI Backend & DB Pipeline

#backend #fastapi #sqlalchemy

The Squad Wear backend is built with FastAPI and AsyncSQLAlchemy, offering high concurrency and automatic local fallback capabilities.

---

## ⚡ Async Database Engine (`backend/database.py`)

- **Database URL Handling**:
  - Automatically replaces `postgresql://` with `postgresql+asyncpg://` for async connection pooling.
  - Fallback: Uses SQLite `sqlite+aiosqlite:///squadgear.db` if `DATABASE_URL` is empty or unreachable.

- **SlowAPI Rate Limiting**:
  - `Limiter(key_func=get_remote_address)` initialized globally to rate-limit endpoints (e.g. `60/minute` on public product API).

---

## 🔗 Related Notes
- [[Database Schema]]
- [[API Reference]]
- [[Catalog Management Scripts]]
