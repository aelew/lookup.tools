FROM imbios/bun-node:21-alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies using Bun
RUN bun install

# Build the app
FROM deps AS builder
WORKDIR /app
COPY . .

RUN bun run build

# Production image, copy all the files and run next
FROM node:21-alpine AS runner
WORKDIR /app

# Mark environment as production
ENV NODE_ENV production

# Disable telemetry during runtime
ENV NEXT_TELEMETRY_DISABLED 1

# For dig DNS lookups
RUN apk add bind-tools

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# `server.js` is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
