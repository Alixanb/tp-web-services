#!/bin/bash

echo "Cela va supprimer TOUTES les données !"
echo ""
read -p "Continuer ? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    docker-compose down -v
    docker-compose down --rmi local
    docker-compose up -d --build
fi

