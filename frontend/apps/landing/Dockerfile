FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/landing/ apps/landing/
RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @dino-atlas/landing build

FROM nginx:alpine
COPY --from=builder /app/apps/landing/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
