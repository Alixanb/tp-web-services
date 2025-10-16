# Architecture Frontend - EventPass

## 📋 Vue d'ensemble

Frontend React + TypeScript pour la plateforme de billetterie EventPass, préparé pour s'intégrer avec l'API REST et les services SOAP du backend NestJS.

## 🏗️ Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants shadcn/ui
│   ├── EventCard.tsx   # Carte d'événement
│   ├── TicketCard.tsx  # Carte de billet
│   ├── OrderCard.tsx   # Carte de commande
│   ├── Header.tsx      # En-tête de navigation
│   ├── Footer.tsx      # Pied de page
│   ├── MobileMenu.tsx  # Menu mobile (burger)
│   └── Layout.tsx      # Layout principal
│
├── pages/              # Pages de l'application
│   ├── EventsPage.tsx        # Recherche d'événements (CLIENT)
│   ├── MyOrdersPage.tsx      # Historique commandes (CLIENT)
│   ├── MyTicketsPage.tsx     # Mes billets (CLIENT)
│   ├── LoginPage.tsx         # Authentification
│   ├── organizer/
│   │   ├── MyEventsPage.tsx  # Gestion événements (ORGANIZER)
│   │   └── EventSalesPage.tsx # Rapports ventes (ORGANIZER)
│   └── admin/
│       ├── AdminDashboard.tsx # Dashboard (ADMIN)
│       └── VenuesPage.tsx     # Gestion lieux (ADMIN)
│
├── types/              # Types TypeScript
│   ├── User.ts         # Types utilisateur (CLIENT, ORGANIZER, ADMIN)
│   ├── Event.ts        # Types événement
│   ├── Venue.ts        # Types lieu
│   ├── Category.ts     # Types catégorie
│   ├── Order.ts        # Types commande
│   ├── Ticket.ts       # Types billet
│   └── Report.ts       # Types rapports (SOAP)
│
├── services/           # Services API (à implémenter)
│   ├── auth.service.ts      # POST /auth/login, POST /users
│   ├── event.service.ts     # CRUD /events
│   ├── order.service.ts     # POST /orders, GET /orders
│   ├── ticket.service.ts    # GET /tickets, PUT /tickets/{id}
│   ├── venue.service.ts     # CRUD /venues (ADMIN)
│   ├── user.service.ts      # PUT /users/{id}
│   ├── category.service.ts  # GET /categories
│   └── report.service.ts    # Services SOAP (reporting)
│
└── routes/             # Configuration du routing
    └── index.tsx       # Routes React Router
```

## 👥 Rôles et Permissions

### CLIENT

- ✅ Rechercher et consulter des événements
- ✅ Acheter des billets
- ✅ Consulter ses commandes
- ✅ Afficher ses billets (avec QR code)

### ORGANIZER (Organisateur)

- ✅ Créer et gérer ses événements
- ✅ Modifier les stocks de billets
- ✅ Consulter les rapports de vente (SOAP)
- ✅ Voir les commandes de ses événements

### ADMIN (Administrateur)

- ✅ Gérer tous les utilisateurs
- ✅ Gérer les lieux (CRUD)
- ✅ Accéder aux rapports globaux (SOAP)
- ✅ Superviser l'ensemble du système

## 📡 Endpoints API REST (15+)

Tous les services sont prêts à être connectés :

### Authentification

- `POST /auth/login` - Connexion
- `POST /users` - Création de compte

### Événements

- `GET /events` - Recherche avec filtres
- `GET /events/{id}` - Détails
- `POST /events` - Création (ORGANIZER)
- `PUT /events/{id}` - Modification (ORGANIZER)
- `DELETE /events/{id}` - Suppression (ORGANIZER/ADMIN)

### Commandes

- `POST /orders` - Créer une commande
- `GET /orders/{id}` - Détails commande
- `GET /users/{id}/orders` - Historique

### Billets

- `GET /tickets/{id}` - Détails billet
- `GET /orders/{id}/tickets` - Billets d'une commande
- `PUT /tickets/{id}` - Modifier statut

### Administration

- `POST /venues` - Créer un lieu (ADMIN)
- `PUT /users/{id}` - Modifier profil

## 🔧 Services SOAP (5 opérations)

Prêts à être implémentés dans `report.service.ts` :

1. **generateSaleReport** - Rapport de vente détaillé
2. **updateTicketStock** - Mise à jour stock critique
3. **processRefund** - Processus de remboursement
4. **getVenueCapacity** - Capacité d'un lieu
5. **logAdminAction** - Audit actions admin

## 🎨 Technologies utilisées

- **React 19** - Framework UI
- **TypeScript** - Typage statique
- **React Router** - Navigation
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - Composants UI
- **Lucide React** - Icônes
- **Vite** - Build tool

## 🚀 Prochaines étapes

### 1. Backend API

- [ ] Implémenter les 15+ endpoints REST
- [ ] Créer les 5 opérations SOAP
- [ ] Mettre en place l'authentification JWT
- [ ] Configurer PostgreSQL

### 2. Intégration Frontend

- [ ] Connecter tous les services à l'API
- [ ] Implémenter la gestion du token JWT
- [ ] Ajouter la gestion d'état (Context API ou Zustand)
- [ ] Gérer les erreurs et le loading
- [ ] Implémenter les guards de routes par rôle

### 3. Fonctionnalités avancées

- [ ] Génération de QR codes pour les billets
- [ ] Upload d'images pour les événements
- [ ] Filtres avancés de recherche
- [ ] Pagination des résultats
- [ ] Notifications en temps réel
- [ ] Export PDF des billets

## 📝 Variables d'environnement

Créer un fichier `.env` :

```env
VITE_API_URL=http://localhost:3000/api
```

## 🎯 Points clés de l'architecture

- ✅ **Types complets** - Toutes les entités du domaine sont typées
- ✅ **Services découplés** - Prêts pour l'implémentation API
- ✅ **Routing par rôle** - Structure claire pour CLIENT/ORGANIZER/ADMIN
- ✅ **UI responsive** - Mobile-first avec menu burger
- ✅ **Composants réutilisables** - EventCard, TicketCard, OrderCard
- ✅ **Prêt pour SOAP** - Service de reporting structuré
- ✅ **Conforme au document d'architecture** - Respect total du cahier des charges

## 🔐 Sécurité (à implémenter)

- JWT Token storage (localStorage)
- Protected routes par rôle
- Refresh token mechanism
- CSRF protection
- Rate limiting côté backend

---

**Architecture prête pour l'intégration avec le backend NestJS + PostgreSQL**
