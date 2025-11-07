#!/bin/bash

echo "🚀 EventPass - Démarrage avec Docker"
echo "===================================="
echo ""

# Arrêter les services locaux s'ils tournent
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
docker-compose up -d --build
docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1



echo ""
echo "Frontend:  http://localhost:5173"
echo "Backend:   http://localhost:3000/api"
echo "Swagger:   http://localhost:3000/api/docs"
echo ""
echo ""
echo "   Admin: admin@eventpass.com / password123"
echo ""
echo ""
echo ""
echo "   Voir logs:     docker-compose logs -f"
echo "   Arrêter:       docker-compose down"
echo "   Reset BDD:     docker-compose down -v && docker-compose up -d"
echo ""

