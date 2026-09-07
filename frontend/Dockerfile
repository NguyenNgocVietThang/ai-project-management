# Giai đoạn cơ sở (Base stage)
# Node 20 LTS: các devDependencies (vite 8, vitest 5) yêu cầu Node >= 20.
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
# --legacy-peer-deps: npm 10 (kèm Node 20) siết peerOptional chặt hơn npm 11+ trên máy host;
# xung đột chỉ nằm ở devDependencies phục vụ test (vitest 5 muốn @types/node >= 22),
# không ảnh hưởng runtime của Next.js.
RUN npm ci --legacy-peer-deps

# Giai đoạn phát triển (Development stage)
FROM base AS development
COPY . .
CMD ["npm", "run", "dev"]

# Giai đoạn biên dịch (Build stage)
FROM base AS build
COPY . .
RUN npm run build

# Giai đoạn vận hành (Production stage)
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/public ./public
COPY package*.json ./

EXPOSE 3000
CMD ["npm", "start"]
