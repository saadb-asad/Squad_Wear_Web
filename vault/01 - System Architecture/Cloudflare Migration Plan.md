# Cloudflare Migration Plan & Pricing Guide

#architecture #cloudflare #d1 #workers #pages #migration

This document outlines the complete strategy for migrating Squad Wear's backend API, database, and frontend hosting to **Cloudflare Serverless Infrastructure**.

---

## 💰 Cost Analysis: Is it Free?

**YES! Cloudflare's Free Tier is 100% sufficient to run Squad Wear for free.**

### Cloudflare Free Tier Breakdown:

| Service | Free Allowance | Squad Wear Usage | Monthly Cost |
| :--- | :--- | :--- | :--- |
| **Cloudflare Pages** | **Unlimited requests & bandwidth**, 500 builds/mo | Storefront hosting | **$0.00** |
| **Cloudflare Workers** | **100,000 requests / day** (~3 Million/mo) | REST API & Auth | **$0.00** |
| **Cloudflare D1** | **5 Million read rows / day**, **100K write rows / day**, 5 GB storage | Products & Orders DB | **$0.00** |
| **Cloudflare R2** | **10 GB storage**, 10M reads / mo, $0 egress fees | Product media & video | **$0.00** |

---

## 📐 Target Architecture Diagram

```mermaid
graph TD
    Client[Browser / Mobile] -->|Global CDN| Pages[Cloudflare Pages (Frontend SPA)]
    Client -->|REST & WebSockets| Worker[Cloudflare Workers API]
    Worker -->|D1 Driver| D1[(Cloudflare D1 SQL DB)]
    Worker -->|KV API| KV[(Cloudflare KV Cache)]
    Worker -->|Fetch| R2[(Cloudflare R2 Storage)]
```

---

## 🚀 Migration Roadmap

### Phase 1: Database Migration to D1
- Export SQLite schema from `squadgear.db` / `backend/models.py`.
- Provision D1 DB: `npx wrangler d1 create squadgear-db`.
- Execute schema & seed data: `npx wrangler d1 execute squadgear-db --file=schema.sql`.

### Phase 2: API Migration to Workers (Hono / Workers TS)
- Implement REST API routes in Cloudflare Workers using **Hono.js**.
- Bind D1 instance to Workers environment for < 20ms database queries.
- Deploy API: `npx wrangler deploy`.

### Phase 3: Storefront Deployment on Cloudflare Pages
- Connect production API endpoint in `frontend/src/config.ts`.
- Deploy build: `npx wrangler pages deploy dist --project-name=squadgear-web`.
- Configure custom domain & free SSL certificate.

---

## 🔗 Related Notes
- [[System Overview]]
- [[Database Schema]]
- [[API Reference]]
- [[Development Setup & Operations]]
