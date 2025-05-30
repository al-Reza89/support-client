# Stage 1: Build
FROM node:20 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# copy env file
COPY .env ./

RUN yarn install

# Copy and build the app
COPY . .
RUN yarn build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/.env ./

# Expose the port the app runs on
EXPOSE 3001

# Use the correct script for production
CMD ["yarn", "run", "start"]