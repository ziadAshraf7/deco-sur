# syntax=docker/dockerfile:1

##### Base image with corepack/npm ready #####
FROM node:24-alpine AS base
WORKDIR /app
# OpenSSL is required by Prisma's query engine on Alpine
RUN apk add --no-cache openssl

##### Dependencies (cached layer) #####
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

##### Build the app #####
FROM base AS build
COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma
# Generate the Prisma client before compiling (types are used across the app)
RUN npx prisma generate
COPY . .
RUN npm run build
# Drop dev dependencies now that the build is done
RUN npm prune --omit=dev

##### Final, minimal runtime image #####
FROM base AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Non-root user for the app to run as
RUN addgroup -S nestjs && adduser -S nestjs -G nestjs

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY package.json ./
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Folder multer writes uploads to (kept outside the image via a volume, see compose)
RUN mkdir -p /app/uploads/projects && chown -R nestjs:nestjs /app

USER nestjs

EXPOSE 8000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/main"]
