FROM node:20-slim AS builder
WORKDIR /app

COPY app/package.json app/package-lock.json ./

RUN npm install

COPY app/ ./

RUN npm run build

FROM node:20-slim AS runner

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "run", "start"]
