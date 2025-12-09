#!/bin/bash

set -e

echo "=== AO CLOUD BACKEND GENERATOR START ==="
echo "WORKDIR: $(pwd)"

BASE="backend-cloud"

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
    echo "Made: $d"
  else
    echo "Exists: $d"
  fi
done

echo "=== AO CLOUD BACKEND GENERATOR DONE ==="
