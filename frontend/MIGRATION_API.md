# Migration vers l'API REST Backend

## 🎯 Vue d'ensemble

Le frontend EventPass a été migré pour utiliser l'API REST du backend au lieu des données mock statiques. Tous les services communiquent maintenant avec le backend NestJS via des appels HTTP authentifiés.

## ✅ Changements effectués

### 1. Création du client API (`/src/lib/api-client.ts`)

Un client API centralisé a été créé avec les fonctionnalités suivantes :

- **Gestion automatique de l'authentification** : Ajout automatique du token JWT dans le header `Authorization: Bearer <token>`
- **Méthodes HTTP complètes** : GET, POST, PUT, PATCH, DELETE
- **Gestion des erreurs** : Transformation des erreurs HTTP en `ApiError` avec code de statut
- **Query parameters** : Support des paramètres de requête pour les filtres
- **Type-safe** : Toutes les méthodes sont typées avec TypeScript

#### Exemple d'utilisation

```typescript
import { apiClient } from '@/lib/api-client'

// GET avec paramètres
const events = await apiClient.get<Event[]>('/events', { 
  city: 'Paris', 
  minPrice: 20 
})

// POST avec authentification automatique
const order = await apiClient.post<Order>('/orders', {
  items: [{ ticketCategoryId: 'xxx', quantity: 2, price: 50 }]
})
```

### 2. Mise à jour des services

Tous les services ont été migrés pour utiliser le `apiClient` :

#### ✅ `auth.service.ts`
- `login()` → `POST /auth/login`
- `register()` → `POST /auth/register`
- Stockage automatique du token et des données utilisateur

#### ✅ `event.service.ts`
- `getEvents(filters)` → `GET /events?...`
- `getEventById(id)` → `GET /events/:id`
- `createEvent(data)` → `POST /events`
- `updateEvent(id, data)` → `PUT /events/:id`
- `deleteEvent(id)` → `DELETE /events/:id`

#### ✅ `category.service.ts`
- `getCategories()` → `GET /categories`
- `getCategoryById(id)` → `GET /categories/:id`
- `createCategory(data)` → `POST /categories`
- `updateCategory(id, data)` → `PUT /categories/:id`
- `deleteCategory(id)` → `DELETE /categories/:id`

#### ✅ `venue.service.ts`
- `getVenues()` → `GET /venues`
- `getVenueById(id)` → `GET /venues/:id`
- `createVenue(data)` → `POST /venues`
- `updateVenue(id, data)` → `PUT /venues/:id`
- `deleteVenue(id)` → `DELETE /venues/:id`

#### ✅ `order.service.ts`
- `createOrder(data)` → `POST /orders`
- `getOrderById(id)` → `GET /orders/:id`
- `getUserOrders(userId)` → `GET /users/:userId/orders`
- `getAllOrders()` → `GET /orders`

#### ✅ `ticket.service.ts`
- `getTicketById(id)` → `GET /tickets/:id`
- `getOrderTickets(orderId)` → Utilise `GET /orders/:id` (tickets inclus)
- `updateTicket(id, data)` → `PUT /tickets/:id`
- `validateTicket(qrCode)` → `POST /tickets/validate`

#### ✅ `user.service.ts`
- `getUserById(id)` → `GET /users/:id`
- `updateUser(id, data)` → `PUT /users/:id`
- `getAllUsers()` → `GET /users`

#### ⚠️ `report.service.ts`
- **Non migré** - En attente de l'implémentation du service SOAP
- Continue d'utiliser les mock data pour le moment

### 3. Configuration

L'URL de l'API est configurée via une variable d'environnement :

**Valeur par défaut** : `http://localhost:3000/api`

Pour changer l'URL, créez un fichier `.env` à la racine du frontend :

```env
VITE_API_URL=http://localhost:3000/api
```

## 🚀 Utilisation

### Démarrer l'application

1. **Démarrer le backend** :
```bash
cd backend
bash start-backend.sh
# ou avec Docker
cd ..
bash docker-start.sh
```

2. **Démarrer le frontend** :
```bash
cd frontend
pnpm install
pnpm dev
```

3. **Accéder à l'application** :
- Frontend : http://localhost:5173
- Backend API : http://localhost:3000/api
- Swagger (documentation) : http://localhost:3000/api/docs

### Authentification

Le système d'authentification fonctionne automatiquement :

1. L'utilisateur se connecte via `authService.login()`
2. Le token JWT est stocké dans `localStorage`
3. Tous les appels API suivants incluent automatiquement le token
4. En cas d'erreur 401, l'utilisateur est déconnecté

**Comptes de test disponibles** :
- Admin : `admin@eventpass.com` / `password123`
- Organisateur : `organizer1@eventpass.com` / `password123`
- Client : `client1@example.com` / `password123`

## 🔍 Gestion des erreurs

Le client API transforme les erreurs HTTP en objets `ApiError` :

```typescript
try {
  const event = await eventService.getEventById('invalid-id')
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`Erreur ${error.statusCode}: ${error.message}`)
    // error.statusCode → 404
    // error.message → "Event not found"
  }
}
```

## 📊 Différences avec les mock data

### Structure des données

Les données de l'API backend sont légèrement différentes des mock data :

1. **IDs** : UUIDs générés par la base de données (ex: `"0499c3b1-db21-4f1d-ad37-52874fffa84a"`)
2. **Dates** : Format ISO 8601 du backend (timestamps PostgreSQL)
3. **Relations** : Les relations sont incluses complètement (venue, category, organizer)
4. **Prix** : Format `string` depuis la base de données (ex: `"89.99"`)

### Nouveaux champs

Le backend ajoute automatiquement :
- `createdAt` sur toutes les entités
- `updatedAt` sur toutes les entités
- Mots de passe hashés (non exposés dans les réponses)

## 🔐 Sécurité

- **Tokens JWT** : Expiration automatique après 24h
- **CORS** : Configuré pour accepter les requêtes depuis `http://localhost:5173`
- **Validation** : Toutes les entrées sont validées côté backend
- **Autorisation** : Les endpoints protégés vérifient les rôles (CLIENT, ORGANIZER, ADMIN)

## 📝 Tests

Pour tester les endpoints API :

1. **Via Postman** : Importer `backend/EventPass_API.postman_collection.json`
2. **Via curl** :
```bash
# Se connecter
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@eventpass.com","password":"password123"}'

# Récupérer les événements
curl http://localhost:3000/api/events

# Récupérer les catégories
curl http://localhost:3000/api/categories
```

## 🎨 Prochaines étapes

- [ ] Implémenter le service SOAP pour les rapports
- [ ] Ajouter une gestion des erreurs plus visuelle (toasts, notifications)
- [ ] Implémenter le refresh automatique du token JWT
- [ ] Ajouter un loader global pendant les appels API
- [ ] Gérer les cas de connexion perdue / offline

## 📞 Support

En cas de problème :
1. Vérifier que le backend est démarré : `curl http://localhost:3000/api/categories`
2. Vérifier la console du navigateur pour les erreurs
3. Vérifier les logs du backend : `cd backend && tail -f logs.txt`
4. Consulter la documentation API : http://localhost:3000/api/docs

## 🔧 Troubleshooting

### Erreur "Network Error" ou "Failed to fetch"
- Vérifier que le backend est démarré
- Vérifier l'URL dans la console : `console.log(import.meta.env.VITE_API_URL)`
- Vérifier CORS dans les logs backend

### Erreur 401 Unauthorized
- Le token est peut-être expiré, se reconnecter
- Vérifier que le token est présent : `localStorage.getItem('token')`

### Données vides ou manquantes
- Vérifier que la base de données a été seedée au démarrage du backend
- Relancer le backend : les données sont recréées à chaque démarrage en mode dev

### Les filtres ne fonctionnent pas
- Vérifier les paramètres envoyés dans la console réseau
- Consulter la documentation API pour les noms exacts des paramètres

