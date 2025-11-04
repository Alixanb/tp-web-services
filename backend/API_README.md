# EventPass API - Documentation Complète

## 🚀 Vue d'ensemble

API REST complète pour la plateforme de billetterie EventPass, construite avec NestJS, TypeScript et PostgreSQL.

**Base URL:** `http://localhost:3000/api`

## 📋 Table des matières

- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Authentification](#authentification)
- [Endpoints API](#endpoints-api)
- [Tests avec Postman](#tests-avec-postman)
- [Architecture](#architecture)

## 🔧 Installation

```bash
# Installer les dépendances
pnpm install

# Ou avec npm
npm install
```

## ⚙️ Configuration

Créer un fichier `.env` à la racine du projet backend:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=eventpass

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Application
PORT=3000
FRONTEND_URL=http://localhost:5173

# Node Environment
NODE_ENV=development
```

### Configuration PostgreSQL

Assurez-vous que PostgreSQL est installé et en cours d'exécution:

```bash
# Créer la base de données
createdb eventpass

# Ou avec psql
psql -U postgres
CREATE DATABASE eventpass;
```

## 🚀 Démarrage

```bash
# Mode développement avec rechargement automatique
pnpm start:dev

# Mode production
pnpm build
pnpm start:prod
```

L'API sera accessible sur `http://localhost:3000/api`

### Données de test

Au démarrage, la base de données est automatiquement peuplée avec des données de test:

**Comptes utilisateurs:**

- Admin: `admin@eventpass.com` / `password123`
- Organisateur 1: `organizer1@eventpass.com` / `password123`
- Organisateur 2: `organizer2@eventpass.com` / `password123`
- Client 1: `client1@example.com` / `password123`
- Client 2: `client2@example.com` / `password123`

**Données:**

- 6 événements publiés avec différentes catégories
- 6 lieux/venues
- 5 catégories d'événements
- Plusieurs catégories de billets par événement

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

### Obtenir un token

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@eventpass.com",
  "password": "password123"
}
```

**Réponse:**

```json
{
  "user": {
    "id": "uuid",
    "email": "admin@eventpass.com",
    "firstName": "Admin",
    "lastName": "EventPass",
    "role": "ADMIN"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Utiliser le token

Incluez le token dans le header `Authorization` de vos requêtes:

```http
Authorization: Bearer <votre_token>
```

## 📚 Endpoints API

### Authentification

| Méthode | Endpoint         | Description             | Auth |
| ------- | ---------------- | ----------------------- | ---- |
| POST    | `/auth/register` | Créer un nouveau compte | Non  |
| POST    | `/auth/login`    | Se connecter            | Non  |

### Événements

| Méthode | Endpoint      | Description                              | Auth                     |
| ------- | ------------- | ---------------------------------------- | ------------------------ |
| GET     | `/events`     | Liste tous les événements (avec filtres) | Non                      |
| GET     | `/events/:id` | Détails d'un événement                   | Non                      |
| POST    | `/events`     | Créer un événement                       | ORGANIZER, ADMIN         |
| PUT     | `/events/:id` | Modifier un événement                    | ORGANIZER (owner), ADMIN |
| DELETE  | `/events/:id` | Supprimer un événement                   | ORGANIZER (owner), ADMIN |

**Filtres disponibles pour GET /events:**

- `search` - Recherche dans titre et description
- `categoryId` - Filtrer par catégorie
- `city` - Filtrer par ville
- `startDate` - Date de début minimum
- `endDate` - Date de fin maximum
- `minPrice` - Prix minimum
- `maxPrice` - Prix maximum
- `status` - Statut de l'événement

**Exemple:**

```http
GET /api/events?city=Paris&minPrice=20&maxPrice=100&search=concert
```

### Commandes (Orders)

| Méthode | Endpoint      | Description            | Auth   |
| ------- | ------------- | ---------------------- | ------ |
| POST    | `/orders`     | Créer une commande     | Requis |
| GET     | `/orders`     | Liste des commandes    | Requis |
| GET     | `/orders/:id` | Détails d'une commande | Requis |

**Création de commande:**

```json
{
  "items": [
    {
      "ticketCategoryId": "uuid",
      "quantity": 2,
      "price": 49.99
    }
  ]
}
```

**Règles métier:**

- Maximum 10 billets par commande
- Vérification automatique du stock disponible
- Transaction atomique avec gestion de rollback
- Génération automatique des QR codes
- Simulation de paiement (95% de succès)

### Billets (Tickets)

| Méthode | Endpoint       | Description         | Auth                    |
| ------- | -------------- | ------------------- | ----------------------- |
| GET     | `/tickets/:id` | Détails d'un billet | Requis                  |
| PUT     | `/tickets/:id` | Modifier un billet  | Owner, Organizer, Admin |

### Utilisateurs

| Méthode | Endpoint            | Description                 | Auth         |
| ------- | ------------------- | --------------------------- | ------------ |
| GET     | `/users`            | Liste tous les utilisateurs | ADMIN        |
| GET     | `/users/:id`        | Détails d'un utilisateur    | Owner, ADMIN |
| PUT     | `/users/:id`        | Modifier un utilisateur     | Owner, ADMIN |
| GET     | `/users/:id/orders` | Commandes d'un utilisateur  | Owner, ADMIN |

### Lieux (Venues)

| Méthode | Endpoint      | Description          | Auth  |
| ------- | ------------- | -------------------- | ----- |
| GET     | `/venues`     | Liste tous les lieux | Non   |
| GET     | `/venues/:id` | Détails d'un lieu    | Non   |
| POST    | `/venues`     | Créer un lieu        | ADMIN |
| PUT     | `/venues/:id` | Modifier un lieu     | ADMIN |
| DELETE  | `/venues/:id` | Supprimer un lieu    | ADMIN |

### Catégories

| Méthode | Endpoint          | Description                 | Auth  |
| ------- | ----------------- | --------------------------- | ----- |
| GET     | `/categories`     | Liste toutes les catégories | Non   |
| GET     | `/categories/:id` | Détails d'une catégorie     | Non   |
| POST    | `/categories`     | Créer une catégorie         | ADMIN |
| PUT     | `/categories/:id` | Modifier une catégorie      | ADMIN |

## 📮 Tests avec Postman

Une collection Postman complète est disponible: `EventPass_API.postman_collection.json`

### Import dans Postman

1. Ouvrir Postman
2. Cliquer sur "Import"
3. Sélectionner le fichier `EventPass_API.postman_collection.json`
4. La collection sera importée avec toutes les requêtes et tests

### Variables d'environnement

La collection utilise des variables qui sont automatiquement mises à jour:

- `baseUrl` - URL de base de l'API
- `token` - Token JWT (mis à jour automatiquement après login)
- `userId` - ID de l'utilisateur connecté
- `eventId` - ID du dernier événement récupéré
- `orderId` - ID de la dernière commande créée
- `ticketId` - ID du dernier billet créé

### Workflow de test recommandé

1. **Authentification** - Commencer par "Login Admin" ou "Login Client"
2. **Explorer** - Tester "Get All Events", "Get All Venues", "Get All Categories"
3. **Recherche** - Essayer les différents filtres sur les événements
4. **Créer** - Créer un événement en tant qu'organizer
5. **Commander** - Créer une commande en tant que client
6. **Vérifier** - Consulter les billets et commandes créés

### Tests automatiques

Chaque requête Postman inclut des tests automatiques qui vérifient:

- Le code de statut HTTP
- La présence des champs requis dans la réponse
- La structure des données
- Les valeurs des variables

Les variables sont automatiquement extraites des réponses pour être utilisées dans les requêtes suivantes.

## 🏗️ Architecture

### Structure du projet

```
backend/
├── src/
│   ├── auth/              # Module d'authentification
│   │   ├── decorators/    # Decorators personnalisés (CurrentUser, Roles)
│   │   ├── dto/           # DTOs pour login/register
│   │   ├── guards/        # Guards JWT et Roles
│   │   └── strategies/    # Stratégie JWT Passport
│   ├── categories/        # Module Catégories
│   ├── common/            # Code partagé
│   │   └── enum/          # Énumérations (UserRole, OrderStatus, etc.)
│   ├── database/          # Scripts de seeding
│   ├── entities/          # Entités TypeORM
│   ├── event/             # Module Événements
│   ├── orders/            # Module Commandes
│   ├── tickets/           # Module Billets
│   ├── users/             # Module Utilisateurs
│   ├── venues/            # Module Lieux
│   ├── app.module.ts      # Module principal
│   └── main.ts            # Point d'entrée
├── EventPass_API.postman_collection.json
└── README.md
```

### Entités de base de données

- **User** - Utilisateurs (clients, organisateurs, admins)
- **Venue** - Lieux d'événements
- **Category** - Catégories d'événements
- **Event** - Événements
- **TicketCategory** - Catégories de billets pour un événement
- **Order** - Commandes
- **Ticket** - Billets individuels

### Fonctionnalités implémentées

✅ **Authentification & Autorisation**

- JWT avec Passport
- Roles-based access control (RBAC)
- Guards personnalisés

✅ **CRUD Complet**

- Events (avec recherche avancée)
- Orders (avec gestion de stock transactionnelle)
- Tickets
- Users
- Venues
- Categories

✅ **Recherche et Filtrage**

- Recherche par texte (titre, description)
- Filtres multiples (ville, catégorie, prix, dates)
- Query builder TypeORM optimisé

✅ **Logique Métier**

- Gestion de stock en temps réel
- Transactions atomiques pour les commandes
- Validation des données avec class-validator
- Génération de QR codes uniques
- Simulation de paiement

✅ **Sécurité**

- Hash des mots de passe avec bcrypt
- Validation des entrées
- Protection CORS
- Guards d'autorisation

✅ **Base de données**

- PostgreSQL avec TypeORM
- Migrations automatiques (synchronize)
- Relations complexes
- Seeding automatique en développement

## 📊 Statistiques de l'API

- **15+ endpoints** fonctionnels
- **7 entités** en base de données
- **4 rôles** utilisateurs (CLIENT, ORGANIZER, ADMIN, SYSTEM)
- **4 modules CRUD** complets
- **Recherche avancée** sur les événements
- **Gestion transactionnelle** des commandes
- **Tests Postman** inclus

## 🔍 Exemples de requêtes

### Créer un événement

```http
POST /api/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Concert de Jazz",
  "description": "Une soirée exceptionnelle",
  "startDate": "2025-12-15T20:00:00Z",
  "endDate": "2025-12-15T23:00:00Z",
  "status": "PUBLISHED",
  "imageUrl": "https://example.com/image.jpg",
  "venueId": "venue-uuid",
  "categoryId": "category-uuid",
  "ticketCategories": [
    {
      "name": "VIP",
      "price": 50.00,
      "totalStock": 100,
      "description": "Accès backstage"
    },
    {
      "name": "Standard",
      "price": 25.00,
      "totalStock": 500
    }
  ]
}
```

### Créer une commande

```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "ticketCategoryId": "ticket-category-uuid",
      "quantity": 2,
      "price": 50.00
    }
  ]
}
```

### Rechercher des événements

```http
GET /api/events?search=jazz&city=Paris&minPrice=20&maxPrice=100
```

## 🐛 Gestion des erreurs

L'API retourne des codes HTTP standards et des messages d'erreur clairs:

```json
{
  "statusCode": 400,
  "message": "Insufficient stock. Only 5 tickets available",
  "error": "Bad Request"
}
```

Codes de statut:

- `200` - Succès
- `201` - Ressource créée
- `204` - Suppression réussie
- `400` - Requête invalide
- `401` - Non authentifié
- `403` - Accès interdit
- `404` - Ressource non trouvée
- `409` - Conflit (ex: email existe déjà)
- `422` - Validation échouée
- `500` - Erreur serveur

## 📝 Notes de développement

- **dropSchema: true** - La base de données est réinitialisée à chaque redémarrage en développement
- **Seeding automatique** - Les données de test sont créées automatiquement
- **Synchronize: true** - TypeORM synchronise automatiquement le schéma (désactiver en production)
- **Logging** - Les requêtes SQL sont loggées en développement

## 🚀 Prochaines étapes possibles

- [ ] Implémenter les services SOAP pour le reporting
- [ ] Ajouter un système de notifications par email
- [ ] Implémenter les remboursements
- [ ] Ajouter la pagination sur les listes
- [ ] Créer des tests unitaires et E2E
- [ ] Implémenter un rate limiting
- [ ] Ajouter une documentation Swagger/OpenAPI
- [ ] Déployer sur un serveur de production

## 📞 Support

Pour toute question ou problème, consultez la documentation du code source ou les spécifications dans `BACKEND_REQUIREMENTS.txt`.
