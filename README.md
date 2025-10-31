cat > README.md <<'EOF'
# Proyecto Purely — Backend (Node.js + TypeScript)

## Requisitos mínimos
- Node.js (recomendado `v18+`) y `npm`
- Docker Desktop (opcional)
- Archivo de entorno ` .env` (ver ` .env.example`)

## Clonar el repositorio
(SSH)
`git clone git@github.com:JhoanLT/purely-backend.git`

(HTTPS)
`git clone https://github.com/JhoanLT/purely-backend.git`

`cd purely-backend`
`git checkout main`

## Ejecutar sin Docker (modo local)
1. Comprobar versiones:
   `node -v`
   `npm -v`

2. Crear o copiar el archivo de entorno:
   `cp .env.example .env`
## Editar ` .env` según tu entorno (BD, API_KEYS, etc.)

3. Instalar dependencias:
   `npm install`

5. Iniciar en modo desarrollo:
   `npm run start:dev`

6. Iniciar en producción:
   `npm run build`
   `npm run start:prod`

7. Probar la API:
   `http://localhost:3000`

8. Detener:
   Presiona `Ctrl+C` en la terminal

## Levantar con Docker Compose
`docker compose up`

Usar archivo específico:
`docker compose -f docker-compose.dev.yml up`

Ejecutar en segundo plano:
`docker compose up -d`

Parar y limpiar:
`docker compose down`

Volver a construir:
`docker compose up --build`

## Tests
`npm run test`
`npm run test:e2e`
`npm run test:cov`

## Notas rápidas
- Si los cambios no se reflejan con Docker Compose: `docker compose up` o `docker compose up --build`.
- Mantén ` .env` fuera del control de versiones; usa ` .env.example`.
- Ajusta los comandos de migraciones según la herramienta que uses.
  EOF
