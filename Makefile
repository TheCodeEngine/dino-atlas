.PHONY: dev dev-storybook infra-up infra-down seed reset build build-prod test clean \
       prod-up prod-down prod-restart tunnel tunnel-stop tunnel-logs backup restore

# ── Development ──

dev:
	docker compose up

dev-storybook:
	docker compose --profile dev up

infra-up:
	docker compose up -d pocketbase valkey traefik
infra-down:
	docker compose down

# ── Production ──

prod-up:
	docker compose -f docker-compose.yml up -d

prod-down:
	docker compose -f docker-compose.yml down

prod-restart:
	docker compose -f docker-compose.yml down
	docker compose -f docker-compose.yml up -d

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

tunnel-stop:
	docker compose --profile tunnel stop cloudflared

tunnel-logs:
	docker compose --profile tunnel logs -f cloudflared

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

# ── Backup & Restore ──

BACKUP_DIR := ./backups
TIMESTAMP  := $(shell date +%Y%m%d_%H%M%S)
VOLUME     := pocketbase_data

backup:
	@mkdir -p $(BACKUP_DIR)
	docker run --rm -v dino-atlas_$(VOLUME):/data -v $(PWD)/$(BACKUP_DIR):/backup \
		alpine tar czf /backup/$(VOLUME)_$(TIMESTAMP).tar.gz -C /data .
	@echo "Backup saved to $(BACKUP_DIR)/$(VOLUME)_$(TIMESTAMP).tar.gz"

restore:
	@test -n "$(FILE)" || (echo "Usage: make restore FILE=backups/pocketbase_data_xxx.tar.gz" && exit 1)
	docker compose down pocketbase
	docker run --rm -v dino-atlas_$(VOLUME):/data -v $(PWD)/$(FILE):/backup.tar.gz \
		alpine sh -c "rm -rf /data/* && tar xzf /backup.tar.gz -C /data"
	docker compose up -d pocketbase
	@echo "Restored from $(FILE)"
