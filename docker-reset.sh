#!/bin/bash

echo "🔄 Reset complet d'EventPass"
echo "============================"
echo ""
echo "⚠️  Cela va supprimer TOUTES les données !"
echo ""
read -p "Continuer ? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo ""
    echo "🧹 Arrêt et suppression des conteneurs et volumes..."
    docker-compose down -v
    
    echo ""
    echo "🗑️  Suppression des images..."
    docker-compose down --rmi local
    
    echo ""
    echo "🔨 Reconstruction et redémarrage..."
    docker-compose up -d --build
    
    echo ""
    echo "⏳ Attente du démarrage (40 secondes)..."
    sleep 40
    
    echo ""
    echo "✅ Reset terminé ! L'application redémarre avec une BDD neuve."
    echo ""
    echo "📍 http://localhost:5173"
    echo ""
else
    echo ""
    echo "❌ Annulé"
fi

