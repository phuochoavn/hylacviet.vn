# --- Stage 1: Builder ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache python3 make g++ git

# Copy package files
COPY package.json yarn.lock* package-lock.json* ./

# Install dependencies
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

# Copy source code
COPY . .

# [PATCH] Increase file upload limit in Admin UI
# Overwriting the component directly in node_modules before build
COPY overrides/upload-media-form-item.tsx node_modules/@medusajs/dashboard/src/routes/products/common/components/upload-media-form-item/upload-media-form-item.tsx
COPY overrides/file-upload/file-upload.tsx node_modules/@medusajs/dashboard/src/components/common/file-upload/file-upload.tsx

# Set env for build
ENV NODE_ENV=production

# Build the application (Output to .medusa/server)
RUN npm run build

# --- Stage 2: Runner ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create medusa user
RUN addgroup --system --gid 1001 medusa && \
    adduser --system --uid 1001 medusa

# [ROOT PROMOTION STRATEGY]
# Copy ONLY the built artifact from .medusa/server to /app
COPY --from=builder --chown=medusa:medusa /app/.medusa/server /app

# Install production dependencies based on the generated package.json
RUN npm install --omit=dev

# Expose port
EXPOSE 9000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:9000/health || exit 1

# Switch to non-root user
USER medusa

# Start the server
CMD ["npm", "run", "start"]