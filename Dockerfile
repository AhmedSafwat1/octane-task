# Build stage
FROM node:21-alpine AS builder

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:21-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install both production and development dependencies for seeding
RUN npm install

# Copy built application from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy TypeScript configuration and source files
COPY tsconfig.json ./
COPY src/ ./src/

# Create startup script
RUN echo '#!/bin/sh' > /usr/src/app/start.sh && \
    echo 'echo "Waiting for database to be ready..."' >> /usr/src/app/start.sh && \
    echo 'sleep 20' >> /usr/src/app/start.sh && \
    echo 'echo "Running database seed..."' >> /usr/src/app/start.sh && \
    echo 'NODE_ENV=production npx ts-node src/database/seed.ts' >> /usr/src/app/start.sh && \
    echo 'echo "Starting application..."' >> /usr/src/app/start.sh && \
    echo 'npm run start:prod' >> /usr/src/app/start.sh && \
    chmod +x /usr/src/app/start.sh

# Expose the application port
EXPOSE 3000

# Start the application using the startup script
CMD ["/usr/src/app/start.sh"] 