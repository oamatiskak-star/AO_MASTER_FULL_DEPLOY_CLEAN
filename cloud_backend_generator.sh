#!/bin/bash

set -e

echo "=== AO CLOUD BACKEND GENERATOR ==="
echo "Working directory: $(pwd)"

BASE="backend-cloud"

# Map-structuur
DIRS=(
  "$BASE/api"
  "$BASE/api/routes"
  "$BASE/api/controllers"
  "$BASE/api/models"
  "$BASE/services"
  "$BASE/engines"
  "$BASE/workers"
  "$BASE/storage"
)

for d in "${DIRS[@]}"; do
  if [ ! -d "$d" ]; then
    mkdir -p "$d"
    echo "Created: $d"
  else
    echo "Exists: $d"
  fi
done

echo "=== CLOUD BACKEND STRUCTURE GENERATED ==="
