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
  echo "Erreur: docker compose n'est pas disponible. Installez Docker Desktop ou docker-compose." >&2
  exit 1
fi

echo "EventPass - démarrage Docker"
echo "============================="

for port in 3000 5173; do
  if lsof -ti:$port >/dev/null 2>&1; then
    echo "Arrêt du processus sur le port $port"
    lsof -ti:$port | xargs -r kill -TERM 2>/dev/null || true
    sleep 1
    if lsof -ti:$port >/dev/null 2>&1; then
      lsof -ti:$port | xargs -r kill -KILL 2>/dev/null || true
    fi
  fi
done

echo "Démarrage des services Docker..."
$COMPOSE_CMD up -d --build

echo "Attente de PostgreSQL..."
until $COMPOSE_CMD exec -T postgres pg_isready -U postgres >/dev/null 2>&1; do
  sleep 2
done

echo ""
echo "Services disponibles :"
echo "  Frontend : http://localhost:5173"
echo "  Backend  : http://localhost:3000/api"
echo "  Swagger  : http://localhost:3000/api/docs"
echo ""
echo "Comptes de test :"
echo "  Admin : admin@eventpass.com / password123"
echo ""
echo "Commandes utiles :"
echo "  Logs   : $COMPOSE_CMD logs -f"
echo "  Arrêt  : ./docker-stop.sh"
echo "  Reset  : $COMPOSE_CMD down -v && $COMPOSE_CMD up -d"

