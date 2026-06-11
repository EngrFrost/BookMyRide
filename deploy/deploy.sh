#!/usr/bin/env bash
# Deploy BookMyRide frontend + API to clawd.
# Usage: ./deploy/deploy.sh
set -euo pipefail

HOST="${DEPLOY_HOST:-clawd}"
REMOTE_DIR="${DEPLOY_REMOTE_DIR:-/home/ubuntu/vehicle-appointment}"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "==> Building client (production)..."
(cd "$REPO_ROOT/client" && npm run build)

echo "==> Packaging server + deploy configs..."
tar -czf /tmp/bookmyride-deploy.tgz \
  -C "$REPO_ROOT" server \
  -C "$REPO_ROOT/deploy" \
  docker-compose.yml nginx-spa.conf api.env.example Caddyfile.snippet

echo "==> Uploading dist..."
ssh "$HOST" "mkdir -p $REMOTE_DIR/dist $REMOTE_DIR/server"
if command -v rsync >/dev/null 2>&1; then
  rsync -avz --delete "$REPO_ROOT/client/dist/" "$HOST:$REMOTE_DIR/dist/"
else
  tar -czf /tmp/vehicle-dist.tgz -C "$REPO_ROOT/client/dist" .
  scp /tmp/vehicle-dist.tgz "$HOST:/tmp/"
  ssh "$HOST" "rm -rf $REMOTE_DIR/dist && mkdir -p $REMOTE_DIR/dist && tar -xzf /tmp/vehicle-dist.tgz -C $REMOTE_DIR/dist"
fi
scp /tmp/bookmyride-deploy.tgz "$HOST:/tmp/"

echo "==> Extracting on server..."
ssh "$HOST" bash -s <<EOF
set -euo pipefail
cd "$REMOTE_DIR"
tar -xzf /tmp/bookmyride-deploy.tgz
if [ ! -f api.env ]; then
  cp api.env.example api.env
  echo "Created api.env from example — edit Firebase Admin creds on server."
fi
EOF

echo "==> Building API image..."
ssh "$HOST" "docker rm -f vehicle-web bookmyride-web bookmyride-api 2>/dev/null || true"
ssh "$HOST" "cd $REMOTE_DIR && docker-compose build bookmyride-api"

echo "==> Running database migrations..."
ssh "$HOST" "cd $REMOTE_DIR && docker-compose run --rm bookmyride-api npx prisma migrate deploy" \
  || ssh "$HOST" "cd $REMOTE_DIR && docker-compose run --rm bookmyride-api npx prisma migrate resolve --applied 20260611000000_init"

echo "==> Starting stack..."
ssh "$HOST" "cd $REMOTE_DIR && docker-compose up -d --force-recreate"

echo "==> Updating Caddy (bookmyride block with /api route)..."
ssh "$HOST" bash -s <<'CADDY'
set -euo pipefail
CADDYFILE=/home/ubuntu/infra/Caddyfile
SNIPPET=/home/ubuntu/vehicle-appointment/Caddyfile.snippet
python3 <<'PY'
from pathlib import Path
import re
caddy = Path("/home/ubuntu/infra/Caddyfile")
snippet = Path("/home/ubuntu/vehicle-appointment/Caddyfile.snippet")
text = caddy.read_text()
text = re.sub(r"\n\s*reverse_proxy vehicle-web:80\n\}\n*$", "\n", text)
block = snippet.read_text().strip()
if re.search(r"bookmyride\.crabdance\.com\s*\{[^}]*handle /api\*", text, re.DOTALL):
    print("Caddy bookmyride block already routes /api.")
else:
    if "bookmyride.crabdance.com" in text:
        text = re.sub(
            r"bookmyride\.crabdance\.com\s*\{.*?\n\}",
            block,
            text,
            count=1,
            flags=re.DOTALL,
        )
    else:
        text = text.rstrip() + "\n\n" + block + "\n"
    caddy.write_text(text)
    print("Updated Caddyfile bookmyride block.")
PY
docker restart caddy-proxy
sleep 3
CADDY

echo "==> Done."
echo "    Site:  https://bookmyride.crabdance.com"
echo "    API:   https://bookmyride.crabdance.com/api/health"
echo "    Note:  set $REMOTE_DIR/api.env (Firebase Admin) on server for auth endpoints"
