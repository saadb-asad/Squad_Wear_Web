# Squad Wear — Cloudflare Migration Plan & Cost Analysis

## 1. Cost & Free Tier Analysis: Is it Free?

**YES! Cloudflare's Free Tier is extremely generous and 100% sufficient to run Squad Wear at zero cost** for small-to-medium traffic.

### Cloudflare Free Tier Breakdown:

| Service | Component | Free Allowance | Squad Wear Usage | Cost |
| :--- | :--- | :--- | :--- | :--- |
| **Cloudflare Pages** | Storefront Hosting | **Unlimited requests & bandwidth**, 500 builds/mo | Production React SPA | **$0.00 / mo** |
| **Cloudflare Workers** | Serverless Backend | **100,000 requests / day** (~3M requests/mo) | REST API & Auth | **$0.00 / mo** |
| **Cloudflare D1** | Serverless SQL DB | **5 Million read rows / day**, **100K write rows / day**, **5 GB storage** | Products, Orders, Users | **$0.00 / mo** |
| **Cloudflare R2** | Image & Video Storage | **10 GB storage**, **10M reads / mo**, $0 egress fees | Product photos & hero video | **$0.00 / mo** |
| **Cloudflare KV** | Session & Cache | **100K reads / day**, **1K writes / day** | Rate limiting & cache | **$0.00 / mo** |

> [!NOTE]
> If traffic eventually exceeds 100,000 API requests per day, Cloudflare Workers Paid Plan starts at only **$5/month**, which includes 10 Million requests/month and 25 GB D1 storage!

---

## 2. Architecture Target Mapping

```mermaid
graph TD
    Client[Browser / Mobile] -->|Global CDN| Pages[Cloudflare Pages (Frontend SPA)]
    Client -->|REST & WebSockets| Worker[Cloudflare Workers API]
    Worker -->|D1 Driver| D1[(Cloudflare D1 SQL DB)]
    Worker -->|KV API| KV[(Cloudflare KV Rate Limiter)]
    Worker -->|Fetch| R2[(Cloudflare R2 Asset Bucket)]
```

| Current Local/VPS Stack | Cloudflare Native Stack | Migration Strategy |
| :--- | :--- | :--- |
| **Frontend**: React + Vite (Local dev) | **Cloudflare Pages** | Deploy `frontend/dist` via `wrangler pages deploy` or GitHub integration. |
| **Database**: SQLite / PostgreSQL (`squadgear.db`) | **Cloudflare D1** | Export schema/SQL to `schema.sql` and run `wrangler d1 execute squadgear-db`. |
| **Backend**: FastAPI (Python) | **Cloudflare Workers** (Hono.js / Workers Python) | Migrate API routes to Workers (Hono framework recommended for sub-10ms latency). |
| **Rate Limiting**: SlowAPI | **Cloudflare Workers KV / Rate Limiter** | Use Cloudflare Rate Limiting binding or KV store. |
| **Media Assets**: `public/videos/hero.mp4` | **Cloudflare R2 / Cloudflare CDN** | Serve hero video & product media with global edge caching and 0 egress cost. |

---

## 3. Step-by-Step Migration Plan

### Phase 1: Database Migration to Cloudflare D1
1. **Export Database Schema**:
   - Generate D1-compatible SQLite SQL migration script from `backend/models.py` / `squadgear.db`.
2. **Provision D1 Database**:
   - Run `npx wrangler d1 create squadgear-db`
   - Bind D1 instance in `wrangler.toml`:
     ```toml
     [[d1_databases]]
     binding = "DB"
     database_name = "squadgear-db"
     database_id = "<YOUR_D1_DATABASE_ID>"
     ```
3. **Execute Schema & Seed Initial Products**:
   - Execute schema initialization: `npx wrangler d1 execute squadgear-db --file=schema.sql`
   - Import product catalog: `npx wrangler d1 execute squadgear-db --file=winter26_products.sql`

---

### Phase 2: Backend API Worker Migration
1. **Setup Workers API Router (Hono / Workers TS or Python)**:
   - Initialize worker environment in `backend-worker/`.
   - Implement Hono API routes corresponding to `/api/products`, `/api/orders`, `/api/auth`.
2. **D1 Query Integration**:
   - Replace SQLAlchemy async engine calls with D1 SQL bindings:
     ```typescript
     const { results } = await c.env.DB.prepare(
       "SELECT * FROM products WHERE is_published = 1 ORDER BY display_order"
     ).all();
     ```
3. **Deploy Worker API**:
   - Run `npx wrangler deploy` to launch production API at `https://api.squadgear.workers.dev`.

---

### Phase 3: Frontend Cloudflare Pages Deployment
1. **Update API Base URL Configuration**:
   - Update `frontend/src/config.ts` to target production worker endpoint `https://api.squadgear.workers.dev`.
2. **Build & Deploy Pages**:
   - Run `npm run build` inside `frontend/`.
   - Deploy using Wrangler: `npx wrangler pages deploy dist --project-name=squadgear-web`.
3. **Custom Domain & SSL Setup**:
   - Attach custom domain (e.g. `squadgear.com`) to Cloudflare Pages project with free SSL/TLS certificate.

---

### Phase 4: Verification & Go-Live Checklist
- [ ] Verify D1 product catalog querying performance (< 20ms response globally).
- [ ] Test order placement checkout flow and inventory decrement.
- [ ] Confirm 1080p hero video loading speed via Cloudflare CDN caching.
- [ ] Perform end-to-end user purchase testing on staging URL before domain switch.
