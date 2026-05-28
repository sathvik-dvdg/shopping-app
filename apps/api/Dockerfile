# Build Stage
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copy dependency definitions and install
COPY package*.json ./
RUN npm ci

# Copy application source code
COPY . .

# Production Stage
FROM node:20-alpine
WORKDIR /usr/src/app

# Set Node environment to production
ENV NODE_ENV=production

# Copy dependencies and source code from builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/index.js ./
COPY --from=builder /usr/src/app/package.json ./

# Use non-root user for security (built into the Node Alpine image)
USER node

# Expose the API port
EXPOSE 5000

# Healthcheck to allow container orchestration to monitor the app
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Start the application
CMD ["node", "index.js"]