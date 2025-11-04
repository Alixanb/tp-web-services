# Dockerfile pour le Backend NestJS

FROM node:18-alpine AS development

# Installer pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json pnpm-lock.yaml ./

# Installer les dépendances
RUN pnpm install

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["pnpm", "start:dev"]

# Stage de production
FROM node:18-alpine AS production

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Installer uniquement les dépendances de production
RUN pnpm install --prod

COPY . .

# Build de l'application
RUN pnpm build

EXPOSE 3000

CMD ["node", "dist/main"]

