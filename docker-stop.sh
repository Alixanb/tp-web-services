#!/bin/bash

echo "🛑 Arrêt d'EventPass Docker"
echo "============================"
echo ""

docker-compose down

echo ""
echo "✅ Tous les conteneurs sont arrêtés"
echo ""
echo "💡 Pour supprimer aussi les données:"
echo "   docker-compose down -v"
echo ""

