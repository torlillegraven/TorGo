#!/usr/bin/env bash
set -euo pipefail

echo ">>> Pushing to GitHub repo: https://github.com/torgo/TorGo.git"
git config --global user.name "torgo" || true
git config --global user.email "tor.lillegraven@gmail.com" || true

git init
git add .gitignore || true
git add .
git commit -m "Initial commit: Teddy Travels" || true
git branch -M main

if git remote | grep -q '^origin$'; then
  git remote set-url origin https://github.com/torgo/TorGo.git
else
  git remote add origin https://github.com/torgo/TorGo.git
fi

git push -u origin main
echo ">>> Done. If Git asks for a password, use a Personal Access Token with 'repo' scope."
