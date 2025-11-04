# 🚀 Docker Quick Start - EventPass

## 🎯 Une seule commande pour tout lancer !

```bash
./docker-start.sh
```

Attendez 40 secondes, puis accédez à **http://localhost:5173**

---

## 📍 URLs

| Service | URL |
|---------|-----|
| 🌐 **Frontend** | http://localhost:5173 |
| 🔌 **Backend** | http://localhost:3000/api |
| 📚 **Swagger** | http://localhost:3000/api/docs |

---

## 🔑 Login

```
Email:    admin@eventpass.com
Password: password123
```

---

## 🛠️ Commandes essentielles

```bash
# Démarrer
./docker-start.sh
# ou
docker-compose up -d

# Arrêter
./docker-stop.sh
# ou
docker-compose down

# Reset BDD
./docker-reset.sh

# Voir les logs
docker-compose logs -f

# Status
docker-compose ps
```

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────┐
│           EventPass Platform                 │
├──────────────────────────────────────────────┤
│                                              │
│  ┌──────────────┐                           │
│  │   Frontend   │   React + Vite            │
│  │  :5173       │                           │
│  └──────┬───────┘                           │
│         │                                    │
│         ▼                                    │
│  ┌──────────────┐                           │
│  │   Backend    │   NestJS API              │
│  │  :3000       │   + Swagger               │
│  └──────┬───────┘                           │
│         │                                    │
│         ▼                                    │
│  ┌──────────────┐                           │
│  │  PostgreSQL  │   Database                │
│  │  :5432       │                           │
│  └──────────────┘                           │
│                                              │
└──────────────────────────────────────────────┘
```

---

## ✅ Checklist

- [ ] Docker Desktop est lancé
- [ ] `./docker-start.sh` exécuté
- [ ] http://localhost:5173 accessible
- [ ] Login avec admin@eventpass.com fonctionne
- [ ] Événements visibles sur la page d'accueil

---

## 🆘 Problème ?

```bash
# Vérifier que Docker tourne
docker ps

# Voir les logs d'erreur
docker-compose logs

# Tout arrêter et recommencer
docker-compose down -v
docker-compose up -d --build
```

---

## 📚 Besoin de plus d'info ?

- **Guide complet** : [DOCKER_GUIDE.md](./DOCKER_GUIDE.md)
- **API Doc** : [backend/API_README.md](./backend/API_README.md)
- **README principal** : [README.md](./README.md)

---

## 🎯 Données préchargées

Après démarrage, vous aurez automatiquement :

- ✅ **5 utilisateurs** (Admin, Organizers, Clients)
- ✅ **6 événements** (concerts, conférences, festivals...)
- ✅ **6 venues** (salles de concert, théâtres...)
- ✅ **5 catégories** (Musique, Sport, Culture...)

---

**🎉 C'est tout ! Profitez de votre application EventPass !**

