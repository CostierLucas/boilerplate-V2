# Development
FROM node:20-slim as development

RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate

# Production
FROM node:20-slim as production

RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "start"] 