# 🌱 Seeding Automatique de la Base de Données

## 📊 Données préchargées

À chaque démarrage de l'application (Docker ou local), la base de données est **automatiquement** remplie avec :

### 👥 Utilisateurs (5)

| Email | Password | Rôle | Description |
|-------|----------|------|-------------|
| `admin@eventpass.com` | `password123` | ADMIN | Accès complet |
| `organizer1@eventpass.com` | `password123` | ORGANIZER | Créateur d'événements |
| `organizer2@eventpass.com` | `password123` | ORGANIZER | Créateur d'événements |
| `client1@example.com` | `password123` | CLIENT | Acheteur de billets |
| `client2@example.com` | `password123` | CLIENT | Acheteur de billets |

### 🎭 Catégories (5)

- 🎵 **Musique** - Concerts et festivals
- ⚽ **Sport** - Événements sportifs
- 🎨 **Culture** - Expositions et théâtre
- 💼 **Business** - Conférences professionnelles
- 🎉 **Divertissement** - Spectacles variés

### 🏛️ Venues (6)

- **Stade de France** - Saint-Denis (80,000 places)
- **Palais des Congrès** - Paris (3,700 places)
- **Olympia** - Paris (2,000 places)
- **AccorHotels Arena** - Paris (20,300 places)
- **Zénith Paris** - La Villette (6,300 places)
- **Grand Rex** - Paris (2,800 places)

### 🎪 Événements (6)

Chaque événement inclut :
- Titre, description, dates
- 2-3 catégories de billets (VIP, Standard, Étudiant...)
- Stocks de billets variés
- Prix différenciés
- Images et informations complètes

---

## ⚙️ Comment fonctionne le seeding ?

### Dans `backend/src/app.module.ts` :

```typescript
export class AppModule implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    // Seed database in development mode
    if (process.env.NODE_ENV !== 'production') {
      try {
        await seedDatabase(this.dataSource);
      } catch (error) {
        console.error('Error seeding database:', error);
      }
    }
  }
}
```

### Configuration TypeORM :

```typescript
TypeOrmModule.forRoot({
  // ...
  synchronize: true,   // ⚠️ Recrée les tables à chaque démarrage
  dropSchema: true,    // ⚠️ Supprime les données existantes
  // ...
})
```

---

## 🔄 Quand le seeding se déclenche-t-il ?

| Scénario | Seeding ? |
|----------|-----------|
| `docker-compose up -d` | ✅ Oui |
| `./docker-start.sh` | ✅ Oui |
| `./docker-reset.sh` | ✅ Oui |
| `pnpm start:dev` (local) | ✅ Oui |
| Production | ❌ Non |

---

## 🛑 Désactiver le seeding automatique

### Option 1: Modifier `app.module.ts`

Commentez le seeding :

```typescript
async onModuleInit() {
  // Désactiver le seeding
  // await seedDatabase(this.dataSource);
}
```

### Option 2: Désactiver `dropSchema`

Dans `app.module.ts` :

```typescript
TypeOrmModule.forRoot({
  // ...
  synchronize: true,
  dropSchema: false,  // ← Garder les données existantes
  // ...
})
```

### Option 3: Variable d'environnement

Créez une condition :

```typescript
async onModuleInit() {
  if (process.env.ENABLE_SEEDING === 'true') {
    await seedDatabase(this.dataSource);
  }
}
```

Puis dans `docker-compose.yml` :

```yaml
environment:
  ENABLE_SEEDING: "false"  # Désactiver le seeding
```

---

## 🔧 Personnaliser les données de seed

Le fichier de seeding est dans : `backend/src/database/seed.ts`

### Ajouter des utilisateurs :

```typescript
const newUser = usersRepository.create({
  email: 'myuser@example.com',
  password: await bcrypt.hash('mypassword', 10),
  firstName: 'John',
  lastName: 'Doe',
  role: UserRole.CLIENT,
});
await usersRepository.save(newUser);
```

### Ajouter des événements :

```typescript
const newEvent = eventsRepository.create({
  title: 'Mon Événement',
  description: 'Description...',
  startDate: new Date('2025-06-01'),
  endDate: new Date('2025-06-01'),
  venue: venue,
  organizer: organizer,
  categories: [category1, category2],
  status: EventStatus.PUBLISHED,
  imageUrl: 'https://example.com/image.jpg',
});
await eventsRepository.save(newEvent);
```

---

## 📊 Vérifier les données seedées

### Via l'API :

```bash
# Événements
curl http://localhost:3000/api/events

# Catégories
curl http://localhost:3000/api/categories

# Venues
curl http://localhost:3000/api/venues
```

### Via PostgreSQL :

```bash
# Accéder à PostgreSQL dans Docker
docker-compose exec postgres psql -U postgres -d eventpass

# Puis :
\dt                          # Lister les tables
SELECT * FROM users;         # Voir les utilisateurs
SELECT * FROM events;        # Voir les événements
\q                           # Quitter
```

### Via Swagger UI :

1. Ouvrez http://localhost:3000/api/docs
2. Testez les endpoints GET sans authentification
3. Voyez les données directement dans l'interface

---

## 🚨 Problèmes courants

### Le seeding ne se déclenche pas

**Cause :** `NODE_ENV=production`  
**Solution :** Vérifiez dans `docker-compose.yml` :
```yaml
environment:
  NODE_ENV: development  # Pas production !
```

### Erreur "duplicate key value"

**Cause :** Les données existent déjà  
**Solution :** Reset complet :
```bash
docker-compose down -v
docker-compose up -d
```

### Les mots de passe ne fonctionnent pas

**Cause :** Problème de hashing bcrypt  
**Solution :** Vérifiez dans `seed.ts` que bcrypt est bien utilisé :
```typescript
password: await bcrypt.hash('password123', 10)
```

---

## 📝 Best Practices

✅ **Développement** : Gardez le seeding activé pour tests rapides  
✅ **Production** : Désactivez TOUJOURS le seeding  
✅ **Tests** : Utilisez des données cohérentes et réalistes  
✅ **Sécurité** : Ne jamais commit de vrais emails/passwords  

⚠️ **Attention** : `dropSchema: true` **supprime toutes les données** !  
   → N'utilisez jamais en production  
   → Commentez pour garder vos données en dev

---

## 🎯 Résumé

| Fichier | Rôle |
|---------|------|
| `backend/src/database/seed.ts` | Logique de création des données |
| `backend/src/app.module.ts` | Déclenchement du seeding au démarrage |
| `docker-compose.yml` | Variables d'environnement |

**Commande pour reset :** `./docker-reset.sh` ou `docker-compose down -v && docker-compose up -d`

---

🌱 **Le seeding automatique permet de tester rapidement l'application avec des données réalistes !**
