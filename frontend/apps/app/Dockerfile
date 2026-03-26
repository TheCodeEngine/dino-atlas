FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY packages/ packages/
COPY apps/app/ apps/app/
RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @dino-atlas/app build

FROM nginx:alpine
COPY --from=builder /app/apps/app/dist /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html
COPY apps/app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
