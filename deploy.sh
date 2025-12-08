#!/bin/zsh

PROJECT_PATH="/Users/bouwproffsnederlandbv/Desktop/AO_MASTER_FULL_DEPLOY_CLEAN"

cd "$PROJECT_PATH"

echo "Syncen met GitHub..."

git add .
git commit -m "sync update" || echo "Geen wijzigingen om te committen"
git pull --rebase
git push

echo "Update gepusht. Vercel en Render starten deployment."
