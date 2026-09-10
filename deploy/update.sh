#!/usr/bin/env bash
set -euo pipefail

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck disable=SC1091
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
fi

APP_DIR="${APP_DIR:-$HOME/OYI-Media-Backend-master}"
cd "$APP_DIR"

if command -v resolvectl >/dev/null 2>&1; then
  sudo resolvectl domain ens5 "" || true
fi

git fetch origin
git reset --hard origin/main

npm install
npx prisma generate
npx prisma db push
npm run build
pm2 restart oymedia-backend
pm2 save

echo "Deployed $(git rev-parse --short HEAD) to api.oyimedia.com"
