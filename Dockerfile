FROM node:20-alpine AS build
WORKDIR /app

# Instala deps
COPY package*.json ./
RUN npm ci

# Copia el código y compila
COPY . .
RUN npm run build

# ====== Runtime stage ======
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Solo deps de runtime
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev

# Copia artefactos compilados
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
