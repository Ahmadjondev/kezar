#!/usr/bin/env bash
set -euo pipefail

#─────────────────────────────────────────────
# Kezar Teks — single-command deploy script
# Usage:  bash deploy.sh
#─────────────────────────────────────────────

PROJECT_DIR="/home/insoft/kezar"

echo "══════════════════════════════════════════"
echo "  Kezar Teks — Deploy"
echo "══════════════════════════════════════════"

# ── 1. Backend ──────────────────────────────
echo ""
echo "▶ Setting up backend..."
cd "$PROJECT_DIR/backend"

# Create venv if missing
if [ ! -d ".venv" ]; then
  echo "  Creating Python virtual environment..."
  python3 -m venv .venv
fi

echo "  Installing dependencies..."
.venv/bin/pip install --quiet --upgrade pip
.venv/bin/pip install --quiet -e .

# Create .env if missing
if [ ! -f ".env" ]; then
  echo "  Creating .env from template..."
  SECRET=$(python3 -c "import secrets; print(secrets.token_urlsafe(48))")
  cat > .env <<EOF
DATABASE_URL=sqlite+aiosqlite:///./kezar.db
SECRET_KEY=${SECRET}
ADMIN_USERNAME=kezar_admin
ADMIN_PASSWORD=Kezar2026
CORS_ORIGINS=["https://kezar.soften.uz"]
UPLOAD_DIR=uploads
EOF
  echo "  ⚠  IMPORTANT: Edit backend/.env and change ADMIN_PASSWORD & SECRET_KEY!"
fi

mkdir -p uploads
pm2 start ./.venv/bin/uvicorn --name "kezar-backend" --interpreter none -- main:app --host 0.0.0.0 --port 8012
echo "  ✓ Backend ready"

# ── 2. Frontend ─────────────────────────────
echo ""
echo "▶ Setting up frontend..."
cd "$PROJECT_DIR/frontend"

echo "  Installing dependencies..."
pnpm install --frozen-lockfile

echo "  Building Next.js..."
NEXT_PUBLIC_API_URL="https://kezar.soften.uz" pnpm build
echo "  ✓ Frontend ready"


# ── 3. PM2 ──────────────────────────────────
echo ""
echo "▶ Starting services with PM2..."
cd "$PROJECT_DIR"

pm2 start "pnpm start" --name kezar-frontend
pm2 save
pm2 startup

# ── 4. Nginx + SSL ──────────────────────────
echo ""
echo "▶ Setting up Nginx..."
if [ ! -f /etc/nginx/sites-available/kezar.soften.uz ]; then
  sudo cp "$PROJECT_DIR/nginx.conf" /etc/nginx/sites-available/kezar.soften.uz
  sudo ln -sf /etc/nginx/sites-available/kezar.soften.uz /etc/nginx/sites-enabled/
  sudo nginx -t && sudo systemctl reload nginx
  echo "  Obtaining SSL certificate..."
  sudo certbot --nginx -d kezar.soften.uz --non-interactive --agree-tos --register-unsafely-without-email
  echo "  ✓ Nginx + SSL ready"
else
  echo "  Nginx config already exists, reloading..."
  sudo cp "$PROJECT_DIR/nginx.conf" /etc/nginx/sites-available/kezar.soften.uz
  sudo nginx -t && sudo systemctl reload nginx
  echo "  ✓ Nginx reloaded"
fi

echo ""
echo "══════════════════════════════════════════"
echo "  ✓ Deploy complete!"
echo ""
echo "  Frontend : http://127.0.0.1:3004"
echo "  Backend  : http://127.0.0.1:8012"
echo "  Domain   : https://kezar.soften.uz"
echo ""
echo "  PM2 logs : pm2 logs"
echo "  PM2 status: pm2 status"
echo "══════════════════════════════════════════"
