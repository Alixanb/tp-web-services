# Dockerfile pour le Frontend React + Vite

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

# Exposer le port Vite
EXPOSE 5173

# Commande de démarrage en mode dev
CMD ["pnpm", "dev", "--host", "0.0.0.0"]

# Stage de build
FROM node:18-alpine AS build

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm build

# Stage de production avec nginx
FROM nginx:alpine AS production

# Copier le build dans nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

