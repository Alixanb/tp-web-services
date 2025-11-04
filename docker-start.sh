#!/bin/bash

echo "🚀 EventPass - Démarrage avec Docker"
echo "===================================="
echo ""

# Arrêter les services locaux s'ils tournent
echo "🧹 Nettoyage des services locaux..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

echo "✅ Ports libérés"
echo ""

# Démarrer Docker Compose
echo "🐳 Lancement des conteneurs Docker..."
echo ""
docker-compose up -d --build

echo ""
echo "⏳ Attente du démarrage complet (40 secondes)..."
sleep 40

echo ""
echo "🔍 Vérification des services..."
echo ""

# Vérifier PostgreSQL
docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ PostgreSQL: Actif"
else
    echo "❌ PostgreSQL: Problème"
fi

# Vérifier Backend
if curl -s http://localhost:3000/api/categories > /dev/null 2>&1; then
    echo "✅ Backend API: Actif"
else
    echo "❌ Backend API: Problème"
fi

# Vérifier Frontend
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend: Actif"
else
    echo "❌ Frontend: Problème"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 EVENTPASS EST PRÊT !"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 URLS:"
echo ""
echo "   🌐 Frontend:  http://localhost:5173"
echo "   🔌 Backend:   http://localhost:3000/api"
echo "   📚 Swagger:   http://localhost:3000/api/docs"
echo ""
echo "🔑 COMPTES:"
echo ""
echo "   Admin: admin@eventpass.com / password123"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Commandes utiles:"
echo ""
echo "   Voir logs:     docker-compose logs -f"
echo "   Arrêter:       docker-compose down"
echo "   Reset BDD:     docker-compose down -v && docker-compose up -d"
echo ""

