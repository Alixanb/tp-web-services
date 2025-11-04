# 🐳 Guide Docker - EventPass

## 📦 Qu'est-ce qui a été dockerisé ?

✅ **Backend NestJS** - API REST complète  
✅ **Frontend React + Vite** - Application web  
✅ **PostgreSQL 14** - Base de données  
✅ **Seeding automatique** - Données de test préchargées  
✅ **Hot reload** - Modifications en temps réel en dev  

---

## 🚀 Démarrage rapide

### Option 1: Script automatique (Recommandé)

```bash
./docker-start.sh
```

### Option 2: Commandes manuelles

```bash
# Lancer tous les services
docker-compose up -d

# Attendre 40 secondes...

# Accéder à l'application
open http://localhost:5173
```

---

## 📍 URLs des services

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Application React |
| **Backend API** | http://localhost:3000/api | API REST |
| **Swagger** | http://localhost:3000/api/docs | Documentation interactive |
| **PostgreSQL** | localhost:5432 | Base de données |

---

## 🔑 Comptes de test

Créés automatiquement au démarrage :

```
Admin:     admin@eventpass.com / password123
Organizer: organizer1@eventpass.com / password123
Client:    client1@example.com / password123
```

---

## 📝 Commandes Docker essentielles

### Démarrage et arrêt

```bash
# Démarrer
docker-compose up -d

# Démarrer avec rebuild
docker-compose up -d --build

# Arrêter
docker-compose down

# Arrêter et supprimer les volumes (données)
docker-compose down -v
```

### Logs et debug

```bash
# Voir tous les logs
docker-compose logs -f

# Logs du backend uniquement
docker-compose logs -f backend

# Logs du frontend uniquement
docker-compose logs -f frontend

# Logs de PostgreSQL
docker-compose logs -f postgres

# Dernières 100 lignes
docker-compose logs --tail=100
```

### Status et info

```bash
# Voir les conteneurs actifs
docker-compose ps

# Utilisation des ressources
docker stats

# Inspecter un conteneur
docker inspect eventpass-backend
```

### Accès aux conteneurs

```bash
# Shell dans le backend
docker-compose exec backend sh

# Shell dans PostgreSQL
docker-compose exec postgres psql -U postgres -d eventpass

# Exécuter une commande
docker-compose exec backend pnpm lint
```

### Gestion des volumes

```bash
# Lister les volumes
docker volume ls

# Inspecter un volume
docker volume inspect tp-web-services_postgres_data

# Supprimer les volumes inutilisés
docker volume prune
```

---

## 🔄 Scénarios courants

### Reset complet de la BDD

```bash
# Option 1: Script automatique
./docker-reset.sh

# Option 2: Manuel
docker-compose down -v
docker-compose up -d
```

La base de données sera reseedée automatiquement avec :
- 5 utilisateurs (tous rôles)
- 6 événements
- 6 venues
- 5 catégories

### Reconstruire les images

```bash
# Reconstruire tout
docker-compose build --no-cache

# Reconstruire un service spécifique
docker-compose build --no-cache backend

# Reconstruire et redémarrer
docker-compose up -d --build
```

### Redémarrer un service

```bash
# Redémarrer le backend
docker-compose restart backend

# Redémarrer tous les services
docker-compose restart
```

### Voir les modifications en temps réel

Les volumes sont montés, donc vos modifications de code sont reflétées immédiatement :

- **Backend**: Hot reload automatique avec Nest
- **Frontend**: HMR (Hot Module Replacement) avec Vite

---

## 🐛 Troubleshooting

### Le backend ne démarre pas

```bash
# Vérifier les logs
docker-compose logs backend

# Problème courant: PostgreSQL pas prêt
# Solution: Attendre 10 secondes de plus ou redémarrer
docker-compose restart backend
```

### Port déjà utilisé

```bash
# Identifier le processus
lsof -ti:3000

# Tuer le processus
lsof -ti:3000 | xargs kill -9

# Ou changer le port dans docker-compose.yml
```

### Erreur de connexion à la BDD

```bash
# Vérifier que PostgreSQL est healthy
docker-compose ps

# Tester la connexion
docker-compose exec postgres pg_isready -U postgres

# Recréer le conteneur
docker-compose up -d --force-recreate postgres
```

### Les modifications ne sont pas reflétées

```bash
# Vérifier les volumes
docker-compose ps

# Reconstruire l'image
docker-compose up -d --build backend
```

### Problème d'espace disque

```bash
# Nettoyer les images inutilisées
docker system prune -a

# Nettoyer tout (ATTENTION: supprime volumes)
docker system prune -a --volumes
```

---

## 🏭 Mode Production

### Lancer en production

```bash
# Utiliser le fichier de production
docker-compose -f docker-compose.prod.yml up -d --build

# Frontend sera sur le port 80
# Backend sur le port 3000
```

### Différences prod vs dev

| Aspect | Dev | Production |
|--------|-----|------------|
| **Frontend** | Vite dev server | Nginx + build optimisé |
| **Backend** | start:dev avec watch | Build compilé |
| **Volumes** | Code source monté | Aucun volume |
| **Optimization** | Non | Oui (minification, gzip) |

---

## 📊 Architecture Docker

```
┌─────────────────────────────────────────┐
│           Docker Network                │
│       (eventpass-network)               │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌───────┐│
│  │ Frontend │  │ Backend  │  │ Postgres││
│  │  :5173   │  │  :3000   │  │  :5432││
│  │  (Vite)  │→ │ (NestJS) │→ │  (DB) ││
│  └──────────┘  └──────────┘  └───────┘│
└─────────────────────────────────────────┘
        ↓              ↓              ↓
   Host :5173    Host :3000    Host :5432
```

---

## 📦 Volumes persistants

| Volume | Contenu | Persistence |
|--------|---------|-------------|
| **postgres_data** | Base de données | Oui, jusqu'à `down -v` |
| **backend_logs** | Logs backend | Oui |
| **/app/node_modules** | Dépendances | Container uniquement |

---

## 🔐 Variables d'environnement

Les variables sont définies dans `docker-compose.yml` :

```yaml
environment:
  DB_HOST: postgres          # Nom du service
  DB_PORT: 5432
  DB_USERNAME: postgres
  DB_PASSWORD: postgres
  DB_DATABASE: eventpass
  JWT_SECRET: your-secret
  NODE_ENV: development
```

Pour la production, utilisez un fichier `.env` :

```bash
# Créer .env à la racine
cp .env.example .env

# Éditer avec vos valeurs
nano .env

# Lancer avec
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🎯 Best Practices

### Développement

1. ✅ Utilisez `docker-compose up -d` pour lancer en arrière-plan
2. ✅ Suivez les logs avec `docker-compose logs -f`
3. ✅ Ne committez jamais les volumes Docker
4. ✅ Utilisez `docker-compose down -v` pour reset la BDD

### Production

1. ✅ Utilisez `docker-compose.prod.yml`
2. ✅ Changez le `JWT_SECRET` 
3. ✅ Utilisez des variables d'environnement sécurisées
4. ✅ Configurez un reverse proxy (Nginx/Traefik)
5. ✅ Activez HTTPS avec Let's Encrypt

---

## 📚 Ressources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Backend API Documentation](./backend/API_README.md)
- [Main README](./README.md)

---

## ✅ Checklist de démarrage

- [ ] Docker Desktop installé et lancé
- [ ] `./docker-start.sh` exécuté
- [ ] Frontend accessible sur http://localhost:5173
- [ ] Backend API sur http://localhost:3000/api
- [ ] Swagger UI sur http://localhost:3000/api/docs
- [ ] Login avec `admin@eventpass.com` / `password123` fonctionne
- [ ] 6 événements visibles dans l'application

---

🎉 **Votre environnement Docker est prêt !**

