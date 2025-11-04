#!/bin/bash

# Script d'arrêt du backend EventPass

echo "🛑 Arrêt du backend EventPass..."

# Arrêter le processus via PID
if [ -f .backend.pid ]; then
    PID=$(cat .backend.pid)
    if ps -p $PID > /dev/null 2>&1; then
        kill $PID
        echo "✅ Processus $PID arrêté"
    else
        echo "⚠️  Processus $PID n'existe plus"
    fi
    rm .backend.pid
fi

# Arrêter tous les processus sur le port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

echo "✅ Backend arrêté"

