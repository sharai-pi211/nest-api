# Этап сборки
FROM node:20-slim AS builder

WORKDIR /app

# Устанавливаем необходимые пакеты
RUN apt-get update && apt-get install -y procps openssl postgresql-client

COPY package*.json ./
RUN npm install

COPY . .

# Копируем конфигурационные файлы TypeScript
COPY tsconfig.build.json ./
COPY tsconfig.json ./

# Генерация Prisma Client
COPY prisma ./prisma
RUN npx prisma generate

RUN npm run build
RUN npm prune --production

# Финальный образ
FROM node:20-slim

WORKDIR /app

# Устанавливаем необходимые пакеты
RUN apt-get update && apt-get install -y procps openssl postgresql-client

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.build.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/doc/api.yaml ./doc/api.yaml

# Проверяем готовность PostgreSQL перед выполнением миграций
ENTRYPOINT sh -c "npx prisma db execute --stdin --url \$DATABASE_URL && npx prisma migrate reset --force && npm run start:dev"

EXPOSE 4000
