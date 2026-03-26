.PHONY: dev dev-storybook infra-up infra-down seed reset build test clean tunnel

# ── Development ──

dev:
	docker compose up

dev-storybook:
	docker compose --profile dev up

infra-up:
	docker compose up -d pocketbase valkey traefik tts

infra-down:
	docker compose down

# ── Database ──

seed:
	cd services/pocketbase/seed && bash import.sh

reset:
	docker compose down -v pocketbase
	docker compose up -d pocketbase
	@echo "Waiting for PocketBase to start..."
	@sleep 3
	$(MAKE) seed

# ── Build ──

build:
	docker compose build

build-prod:
	docker compose -f docker-compose.yml build

# ── Testing ──

test-backend:
	cd backend && cargo test --workspace

test-frontend:
	cd frontend && pnpm test

test: test-backend test-frontend

# ── Tunnel ──

tunnel:
	docker compose --profile tunnel up -d cloudflared

# ── Cleanup ──

clean:
	docker compose down -v
	cd frontend && pnpm clean 2>/dev/null || true
	cd backend && cargo clean 2>/dev/null || true

# ── Logs ──

logs:
	docker compose logs -f

logs-api:
	docker compose logs -f api

logs-generator:
	docker compose logs -f generator

logs-tts:
	docker compose logs -f tts
