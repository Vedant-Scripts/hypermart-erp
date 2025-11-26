# STAGE 1 : BUILDER STAGE
FROM node:24-slim AS builder

# for prisma
RUN apt-get update -y && apt-get install -y openssl libssl3   

# Enable Corepack (built into Node)  for pnpm
RUN corepack enable

# Set the working directory inside the container
WORKDIR /app

# Copy package files for caching
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Copy rest of the files
COPY . .

# Dummy DB URL for prisma generate
ENV DATABASE_URL="postgresql://placeholder/placeholder"

# Generate Prisma Client
RUN pnpm prisma generate

# Build TypeScript → dist
RUN pnpm build

#############################################################################################################

#STAGE 2 : RUNNER STAGE
FROM node:24-slim AS runner

# for prisma
RUN apt-get update -y && apt-get install -y openssl libssl3   

# Enable Corepack for pnpm
RUN corepack enable

#create a secure non-root user
RUN useradd --create-home appuser
USER appuser

# Set working directory inside the runner container
WORKDIR /app

# Copying ONLY the important built outputs
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/prisma ./prisma


ENV PORT=5000
EXPOSE 5000

# Final command that runs the code when running the container (at container run time)
CMD [ "pnpm", "start" ]