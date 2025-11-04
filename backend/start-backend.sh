#!/bin/bash

# Script de démarrage du backend EventPass

echo "🚀 Démarrage du backend EventPass..."
echo ""

# Arrêter les processus existants sur le port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 2

# Démarrer l'application
cd "$(dirname "$0")"
nohup pnpm start:dev > logs.txt 2>&1 &
echo $! > .backend.pid

echo "⏳ Initialisation..."
sleep 35

# Vérifier que l'application est accessible
if curl -s http://localhost:3000/api/categories > /dev/null 2>&1; then
    echo ""
    echo "✅ BACKEND LANCÉ AVEC SUCCÈS !"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📍 LIENS:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "   🌐 API:     http://localhost:3000/api"
    echo "   📚 Swagger: http://localhost:3000/api/docs"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔑 COMPTES DE TEST:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "   Admin: admin@eventpass.com / password123"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📝 Logs: tail -f logs.txt"
    echo "🛑 Arrêt: ./stop-backend.sh"
    echo ""
else
    echo ""
    echo "❌ Erreur au démarrage"
    echo ""
    echo "Dernières lignes des logs:"
    tail -20 logs.txt
    exit 1
fi

