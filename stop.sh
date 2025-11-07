#!/bin/bash

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_ROOT"

COMPOSE_CMD="docker compose"
if $COMPOSE_CMD version >/dev/null 2>&1; then
  :
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD="docker-compose"
else
  echo "Erreur: docker compose n'est pas disponible." >&2
  exit 1
fi

if $COMPOSE_CMD ps -q >/dev/null 2>&1 && [ -n "$($COMPOSE_CMD ps -q)" ]; then
  echo "Arrêt des services Docker..."
  $COMPOSE_CMD down
else
  echo "Aucun service Docker en cours pour ce projet."
fi