# 🎭 Guide des données Mock - EventPass

## 📋 Vue d'ensemble

Le frontend fonctionne actuellement avec des **données simulées (mock)** stockées dans `/src/data/mock-data.json` et gérées par `/src/lib/mock-api.ts`.

Cela vous permet de **tester toutes les fonctionnalités** sans avoir besoin du backend !

## 🔧 Comment ça marche ?

### Configuration

Dans chaque service (`*.service.ts`), il y a une constante `USE_MOCK` :

```typescript
const USE_MOCK = true // Mettre à false quand l'API sera prête
```

- `USE_MOCK = true` → Utilise les données mock
- `USE_MOCK = false` → Utilise l'API backend réelle

## 👥 Comptes de test disponibles

### CLIENT

- **Email:** `client@eventpass.com`
- **Mot de passe:** n'importe quoi (pas de vérification en mode mock)
- **Accès:** Recherche d'événements, achat de billets, mes commandes

### ORGANIZER

- **Email:** `organizer@eventpass.com`
- **Mot de passe:** n'importe quoi
- **Accès:** Gestion d'événements, rapports de vente

### ADMIN

- **Email:** `admin@eventpass.com`
- **Mot de passe:** n'importe quoi
- **Accès:** Administration complète, gestion des lieux

## 📊 Données disponibles

### ✅ 6 Événements

- Concert de Jazz en Plein Air (Paris)
- Conférence Tech Summit 2025 (Lyon)
- Festival Gastronomique (Bordeaux)
- Soirée Électro Night (Marseille)
- Marathon de Paris 2026
- Festival Rock Legends (Bordeaux)

### ✅ 4 Catégories

- Musique (245 événements)
- Festival (128 événements)
- Business (89 événements)
- Sport (156 événements)

### ✅ 4 Lieux

- Parc de la Villette (Paris, 5000 places)
- Halle Tony Garnier (Lyon, 8000 places)
- Bordeaux Lac (Bordeaux, 12000 places)
- Le Dôme (Marseille, 8500 places)

### ✅ 3 Commandes

- 2 commandes PAID (avec billets)
- 1 commande CANCELLED

### ✅ Rapports SOAP

- Rapport de vente pour l'événement "Concert de Jazz"

## 🎮 Fonctionnalités testables

### Pages CLIENT ✅

- `/` - Page d'accueil avec événements populaires
- `/events` - Recherche d'événements (avec filtres fonctionnels)
- `/my-orders` - Historique des commandes
- `/my-tickets` - Mes billets avec QR codes

### Pages ORGANIZER ✅

- `/organizer/events` - Liste de mes événements
- `/organizer/sales` - Rapports de vente (SOAP simulé)

### Pages ADMIN ✅

- `/admin/dashboard` - Tableau de bord
- `/admin/venues` - Gestion des lieux

## 🔍 Tester les fonctionnalités

### 1. Connexion

```bash
1. Aller sur /login
2. Email: client@eventpass.com (ou organizer/admin)
3. Mot de passe: n'importe quoi
4. Cliquer sur "Se connecter"
```

### 2. Recherche d'événements

```bash
1. Aller sur /events
2. Taper dans la barre de recherche: "jazz" ou "tech"
3. Les résultats sont filtrés en temps réel
4. Cliquer sur un événement pour voir les détails
```

### 3. Voir mes commandes

```bash
1. Se connecter avec client@eventpass.com
2. Aller sur /my-orders
3. Voir les 3 commandes (2 payées, 1 annulée)
4. Cliquer sur "Voir les détails"
```

### 4. Voir mes billets

```bash
1. Se connecter avec client@eventpass.com
2. Aller sur /my-tickets
3. Voir les 4 billets actifs
4. Cliquer sur "Afficher le QR Code"
```

### 5. Espace organisateur

```bash
1. Se connecter avec organizer@eventpass.com
2. Aller sur /organizer/events
3. Voir tous les événements
4. Aller sur /organizer/sales pour voir le rapport
```

### 6. Espace admin

```bash
1. Se connecter avec admin@eventpass.com
2. Aller sur /admin/dashboard
3. Voir les statistiques globales
4. Aller sur /admin/venues pour gérer les lieux
```

## 🔄 Modifier les données mock

### Ajouter un événement

Éditez `/src/data/mock-data.json` :

```json
{
  "events": [
    {
      "id": "event-7",
      "title": "Nouveau Concert",
      "description": "Un super concert",
      "startDate": "2025-12-15T20:00:00Z",
      "endDate": "2025-12-15T23:00:00Z",
      "status": "PUBLISHED",
      "venue": { ...venue-1 },
      "category": { ...cat-musique },
      "organizer": { ...user-organizer-1 },
      "ticketCategories": [
        {
          "id": "ticket-cat-7-1",
          "name": "Standard",
          "price": 30.00,
          "totalStock": 500,
          "availableStock": 450
        }
      ]
    }
  ]
}
```

### Ajouter une commande

```json
{
  "orders": [
    {
      "id": "order-4",
      "user": { ...user-client-1 },
      "orderDate": "2025-10-16T10:00:00Z",
      "status": "PAID",
      "totalAmount": 60.00,
      "tickets": [ ...vos billets ]
    }
  ]
}
```

## 🚀 Passer à l'API réelle

Quand le backend sera prêt :

### 1. Créer le fichier `.env`

```bash
VITE_API_URL=http://localhost:3000/api
```

### 2. Désactiver le mock dans TOUS les services

```typescript
// Dans chaque fichier *.service.ts
const USE_MOCK = false // ← Changer de true à false
```

### 3. Implémenter les vraies requêtes API

Exemple dans `event.service.ts` :

```typescript
async getEvents(filters?: EventFilters): Promise<Event[]> {
  if (USE_MOCK) return mockApi.getEvents(filters)

  // Implémenter avec l'API réelle
  const response = await fetch(`${API_URL}/events?${buildQueryString(filters)}`, {
    headers: {
      'Authorization': `Bearer ${authService.getToken()}`,
    },
  })

  if (!response.ok) throw new Error('Failed to fetch events')
  return response.json()
}
```

## 📝 Notes importantes

### Délai simulé

- Toutes les requêtes mock ont un délai de **500ms** pour simuler la latence réseau
- Modifiable dans `/src/lib/mock-api.ts` : `const delay = (ms: number = 500)`

### Validation

- Les emails ne sont **pas validés** en mode mock
- Les mots de passe ne sont **pas vérifiés**
- Le token JWT est un simple mock

### Limitations

- Pas de vraie création/modification/suppression (les données sont en lecture seule)
- Pas de pagination
- Pas de vraie génération de QR codes (juste un texte simulé)

## 🎯 Avantages du mock

✅ **Développement indépendant** - Pas besoin d'attendre le backend  
✅ **Tests rapides** - Pas de connexion réseau  
✅ **Données contrôlées** - Toujours les mêmes données pour tester  
✅ **Démos** - Parfait pour présenter le frontend  
✅ **Développement offline** - Travaillez sans internet

## 🐛 Debug

### Les données ne s'affichent pas ?

1. Vérifier la console du navigateur (F12)
2. Vérifier que `USE_MOCK = true` dans les services
3. Vérifier que le fichier `/src/data/mock-data.json` est bien présent
4. Vérifier les imports dans `/src/lib/mock-api.ts`

### Erreur "Failed to fetch" ?

→ Normal si `USE_MOCK = false` et que le backend n'est pas lancé

### Les filtres ne fonctionnent pas ?

→ Vérifier l'implémentation dans `/src/lib/mock-api.ts` fonction `getEvents()`

## 📚 Ressources

- **Données mock:** `/src/data/mock-data.json`
- **API mock:** `/src/lib/mock-api.ts`
- **Services:** `/src/services/*.service.ts`
- **Types:** `/src/types/*.ts`

---

**Bon développement ! 🚀**

Quand le backend sera prêt, changez simplement `USE_MOCK = false` et profitez de vraies données !
