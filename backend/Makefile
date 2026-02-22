# ─────────────────────────────────────────────────────────────────
#  KEZAR TEKS  —  Backend Makefile
# ─────────────────────────────────────────────────────────────────
#  All commands are run from the backend/ directory.
#  Activate your virtual environment first, or prefix with:
#    source .venv/bin/activate && make <target>
# ─────────────────────────────────────────────────────────────────

PYTHON     ?= ../.venv/bin/python
PYTHONPATH := $(shell pwd)

.PHONY: help install dev seed reseed reset-db

# Default target
help:
	@echo ""
	@echo "  KEZAR TEKS — Backend commands"
	@echo "  ─────────────────────────────────────────"
	@echo "  make install    Install Python dependencies"
	@echo "  make dev        Start development server (uvicorn)"
	@echo "  make seed       Seed DB for the first time (skips if data exists)"
	@echo "  make reseed     FORCE-reset all data and re-seed with official data"
	@echo "  make reset-db   Drop and recreate the SQLite database file"
	@echo ""

# Install dependencies into the active virtualenv
install:
	$(PYTHON) -m pip install sqlalchemy aiosqlite greenlet fastapi uvicorn \
	    pydantic pydantic-settings python-multipart python-jose passlib \
	    aiofiles orjson alembic pillow

# Run the development server
dev:
	PYTHONPATH=$(PYTHONPATH) $(PYTHON) -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Seed for the first time (idempotent — skips tables that already have rows)
seed:
	@echo "Seeding database with KEZAR TEKS official data ..."
	PYTHONPATH=$(PYTHONPATH) $(PYTHON) -m app.seed
	@echo "Done. Run 'make reseed' to overwrite existing data."

# FORCE-reset and re-seed every table
reseed:
	@echo "Clearing all seeded tables and re-seeding ..."
	PYTHONPATH=$(PYTHONPATH) $(PYTHON) -m app.reseed
	@echo "Database re-seeded with official KEZAR TEKS company data."

# Start completely fresh (delete the SQLite file and re-seed)
reset-db:
	@echo "Deleting kezar.db and re-seeding from scratch ..."
	rm -f kezar.db
	PYTHONPATH=$(PYTHONPATH) $(PYTHON) -m app.reseed
	@echo "Fresh database created and seeded."
