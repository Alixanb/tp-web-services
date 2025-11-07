lien du git : https://github.com/Alixanb/tp-web-services

# EventPass - Plateforme de Billetterie

EventPass est une application web complète pour créer, publier et vendre des événements en ligne. Elle comprend une API NestJS, un front React et une base PostgreSQL déjà peuplée avec des données cohérentes.

## Comment lancer rapidement le projet

### 1. Préparer son environnement
- Installer [Docker Desktop](https://www.docker.com/products/docker-desktop).
- Cloner ce dépôt puis se placer dans le dossier `tp-web-services` :

```bash
git clone <url-du-repo>
cd tp-web-services
```

### 2. Démarrer toute la stack en un clic

```bash
./start.sh
```

- Le script coupe les éventuels processus sur les ports 3000 et 5173, reconstruit les conteneurs si besoin puis lance Docker Compose.
- Le backend, le frontend et PostgreSQL démarrent simultanément.
- Attendre ~30 secondes que la base soit seedée.
- Accès ensuite à :
  - Frontend : http://localhost:5173
  - API REST : http://localhost:3000/api
  - Swagger : http://localhost:3000/api/docs

### 3. Arrêter proprement

```bash
./stop.sh
```

### 4. Repartir de zéro (reset base + rebuild)

```bash
./reset.sh
```

- Supprime les conteneurs, les volumes et reconstruit l’ensemble avant de relancer Docker Compose.
- À utiliser uniquement si l’on veut repartir sur une base de données vide et regénérée.

## Mode développement (sans Docker)

### Backend
```bash
cd backend
pnpm install
createdb eventpass
pnpm start:dev   # ou ./start-backend.sh
```

### Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

## Comptes de test pré-créés

| Rôle      | Email                     | Mot de passe  |
|-----------|---------------------------|---------------|
| Admin     | admin@eventpass.com       | password123   |
| Organisateur | organizer1@eventpass.com | password123   |
| Client    | client1@example.com       | password123   |

## Endpoints et URLs utiles

| Service        | URL                           | Description                  |
|----------------|-------------------------------|------------------------------|
| Frontend       | http://localhost:5173         | Application React            |
| API REST       | http://localhost:3000/api     | Endpoints NestJS             |
| Swagger        | http://localhost:3000/api/docs| Documentation & tests rapides|
| PostgreSQL     | localhost:5432                | Base de données seedée       |

## Ce que nous avons livré (et comment)

- **Code source versionné sur Git** : branches thématiques + commits fréquents avec messages explicites retraçant chaque évolution (features, fix, docs).
- **Minimum 15 endpoints métier** : 25 routes REST exposées couvrant événements, billets, commandes, utilisateurs et catégories (cf. `backend/ENDPOINTS_CHECKLIST.md`).
- **CRUD complet sur 4 entités** : opérations Create/Read/Update/Delete opérationnelles pour `events`, `venues`, `categories` et `tickets` via services NestJS + controllers, accessibles depuis les écrans Admin (rôle Administrateur).
- **Authentification de base** : login JWT avec NestJS Passport, guard `JwtAuthGuard` et rôles Admin/Organisateur/Client appliqués aux routes sensibles.
- **Recherche & filtrage avancés** : endpoints `/events` et `/orders` acceptent filtres (dates, statut, catégories, texte libre) + pagination côté backend.
- **Validation robuste & gestion d'erreurs** : DTO validés par `class-validator`, réponses normalisées, `ApiError` côté frontend pour afficher des messages clairs.
- **Collection Swagger complète** : doc auto-générée disponible sur `/api/docs` + collection Postman `EventPass_API.postman_collection.json` contenant des tests pour tous les endpoints.
- **Base de données réaliste** : seeds PostgreSQL dans `backend/src/database/seed.ts` (événements variés, utilisateurs, billets, commandes cohérentes).

## Architecture du dépôt
```
tp-web-services/
├── backend/   # API NestJS (TypeORM, Swagger, Auth)
├── frontend/  # React + Vite + Tailwind
├── docker-compose.yml         # mode dev
└── docker-compose.prod.yml    # mode prod
```

## Déploiement production
```bash
docker-compose -f docker-compose.prod.yml up -d
# Frontend servi par Nginx sur le port 80
# Backend REST accessible sur :3000
```

## Stack technique

**Backend** : NestJS 10, TypeScript, PostgreSQL 14, TypeORM, JWT, Swagger/OpenAPI

**Frontend** : React 18, TypeScript, Vite, TailwindCSS, React Router

**DevOps** : Docker, Docker Compose, Nginx (prod)

## Ressources complémentaires
- [Documentation API détaillée](./backend/API_README.md)
- [Guide backend pas-à-pas](./backend/GETTING_STARTED.md)
- [Checklist des endpoints](./backend/ENDPOINTS_CHECKLIST.md)
- [Collection Postman](./backend/EventPass_API.postman_collection.json)

## Crédit
Projet réalisé dans le cadre du master Web Services (M2) — équipe Nicolas ARENA, Alixan BALU et Minh NGUYEN

