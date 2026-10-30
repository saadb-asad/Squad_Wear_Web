# Catalog Management Scripts

#backend #automation #catalog #python

Squad Wear features Python pipelines for importing, processing, and staging inventory catalogs:

---

## 📜 Script Inventory

### 1. `process_winter26_catalog.py`
- Scans product photos inside `Winter 26/Squad Wears Web Pics/`.
- Extracts product SKUs (e.g., `SQD-TS-OLV-350`), names, descriptions, and formats high-resolution image paths.
- Generates structured catalog outputs (`winter26_products.json`).

### 2. `upload_products.py`
- Reads JSON catalog files and upserts products into PostgreSQL / SQLite database.
- Supports `--publish-immediately` flag for instant live catalog deployments.

### 3. `publish_catalog.py`
- Sets `is_published = True` across staged catalog products.

### 4. `clean_mockup_products.py`
- Cleans up duplicate or temporary mock product records.

---

## 🔗 Related Notes
- [[FastAPI Backend & DB Pipeline]]
- [[Database Schema]]
- [[Media Assets Optimization]]
