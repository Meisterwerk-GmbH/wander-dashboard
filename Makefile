COMPOSE ?= docker compose

.PHONY: start stop restart update logs status

up:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

restart: stop start

update:
	$(COMPOSE) build --pull --no-cache
	$(COMPOSE) up -d --force-recreate

logs:
	$(COMPOSE) logs -f --tail=200

status:
	$(COMPOSE) ps
