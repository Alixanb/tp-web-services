# 🎉 EventPass - Plateforme de Billetterie

API REST complète et application web pour la gestion d'événements et la vente de billets.

## 🚀 Quick Start avec Docker

### Prérequis
- Docker Desktop installé ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose (inclus avec Docker Desktop)

### Démarrage rapide

```bash
# Cloner le projet
cd tp-web-services

# Lancer toute l'application (Backend + Frontend + PostgreSQL)
docker-compose up -d

# Attendre 30 secondes que tout se lance...
# Puis accéder à:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:3000/api
# - Swagger: http://localhost:3000/api/docs
```

### Arrêter l'application

```bash
docker-compose down
```

### Redémarrer avec reset de la BDD

```bash
# Arrêter et supprimer les volumes (données)
docker-compose down -v

# Relancer (la BDD sera reseedée automatiquement)
docker-compose up -d
```

## 📦 Commandes Docker utiles

```bash
# Voir les logs
docker-compose logs -f

# Logs backend uniquement
docker-compose logs -f backend

# Logs frontend uniquement
docker-compose logs -f frontend

# Voir les conteneurs actifs
docker-compose ps

# Reconstruire les images
docker-compose build

# Redémarrer un service spécifique
docker-compose restart backend
```

## 🔧 Mode Développement (sans Docker)

### Backend

```bash
cd backend

# Installer les dépendances
pnpm install

# Créer la base de données PostgreSQL
createdb eventpass

# Démarrer
./start-backend.sh
# ou
pnpm start:dev
```

### Frontend

```bash
cd frontend

# Installer les dépendances
pnpm install

# Démarrer
pnpm dev
```

## 🌐 URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Application React |
| **Backend API** | http://localhost:3000/api | API REST |
| **Swagger** | http://localhost:3000/api/docs | Documentation interactive |
| **PostgreSQL** | localhost:5432 | Base de données |

## 🔑 Comptes de test

Les comptes sont créés automatiquement au démarrage :

| Rôle | Email | Password |
|------|-------|----------|
| Admin | `admin@eventpass.com` | `password123` |
| Organizer | `organizer1@eventpass.com` | `password123` |
| Client | `client1@example.com` | `password123` |

## 📊 Architecture

```
tp-web-services/
├── backend/           # API NestJS
│   ├── src/
│   ├── Dockerfile
│   └── .env
├── frontend/          # React + Vite
│   ├── src/
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml          # Dev
└── docker-compose.prod.yml     # Production
```

## 🚀 Déploiement Production

```bash
# Build et lancer en mode production
docker-compose -f docker-compose.prod.yml up -d

# Frontend sera sur le port 80
# Backend sur le port 3000
```

## 🐛 Troubleshooting

### Le backend ne démarre pas

```bash
# Vérifier les logs
docker-compose logs backend

# Redémarrer les services
docker-compose restart
```

### Reset complet

```bash
# Tout arrêter et supprimer
docker-compose down -v

# Supprimer les images
docker-compose down --rmi all

# Reconstruire et relancer
docker-compose up -d --build
```

### Port déjà utilisé

```bash
# Vérifier quel processus utilise le port 3000
lsof -ti:3000

# Tuer le processus
lsof -ti:3000 | xargs kill -9

# Ou changer le port dans docker-compose.yml
ports:
  - "3001:3000"  # Au lieu de 3000:3000
```

## 📚 Documentation

- [Backend API Documentation](./backend/API_README.md)
- [Getting Started Guide](./backend/GETTING_STARTED.md)
- [Endpoints Checklist](./backend/ENDPOINTS_CHECKLIST.md)
- [Postman Collection](./backend/EventPass_API.postman_collection.json)

## ✅ Features

- ✅ 25 endpoints REST
- ✅ Authentification JWT
- ✅ Roles-based access control
- ✅ Recherche et filtrage avancés
- ✅ Gestion transactionnelle des commandes
- ✅ Swagger UI intégré
- ✅ Docker & Docker Compose
- ✅ Seeding automatique de la BDD
- ✅ Hot reload en développement

## 🛠️ Stack Technique

**Backend:**
- NestJS 10
- TypeScript
- PostgreSQL 14
- TypeORM
- JWT + Passport
- Swagger/OpenAPI

**Frontend:**
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router

**DevOps:**
- Docker
- Docker Compose
- Nginx (production)

## 📝 License

MIT

## 👥 Équipe

Projet développé dans le cadre du cours de Web Services - M2.

