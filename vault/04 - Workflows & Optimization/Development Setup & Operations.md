# Development Setup & Operations

#dev-setup #operations #scripts

Instructions for local development, building, and running Squad Wear services.

---

## 🚀 Running Local Environment

### 1. Frontend Development (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*App will start on `http://localhost:5173/` or `http://localhost:5174/`.*

### 2. Backend Development (FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
*API will run on `http://localhost:8000/`.*

---

## 🛠 Production Build Verification

To verify TypeScript types and production bundle compilation:
```bash
cd frontend
npm run build
```

---

## 🔗 Related Notes
- [[System Overview]]
- [[React Frontend Architecture]]
- [[FastAPI Backend & DB Pipeline]]
