# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./


# Install all dependencies, including dev, for build
RUN npm install

COPY database ./database

COPY . .

# Ensure the build command uses npx to run nest build
RUN npm run build

RUN npm prune --omit=dev

# Stage 2: Run the application
FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/database ./database

EXPOSE 2006

CMD ["node", "dist/main"]
