# Giai đoạn cơ sở (Base stage)
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Giai đoạn phát triển (Development stage)
FROM base AS development
COPY . .
CMD ["npm", "run", "dev"]

# Giai đoạn biên dịch (Build stage)
FROM base AS build
COPY . .
RUN npm run build

# Giai đoạn vận hành (Production stage)
FROM node:18-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/public ./public
COPY package*.json ./

EXPOSE 3000
CMD ["npm", "start"]
