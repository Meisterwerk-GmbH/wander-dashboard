COMPOSE ?= docker compose
ENV_FILES := $(if $(wildcard .env),--env-file .env,)$(if $(wildcard .env.local), --env-file .env.local,)
COMPOSE_CMD := $(COMPOSE) $(ENV_FILES)

.PHONY: up down start stop restart update logs status

up:
	$(COMPOSE_CMD) up -d --build

down:
	$(COMPOSE_CMD) down

restart: down up

update:
	$(COMPOSE_CMD) build --pull --no-cache
	$(COMPOSE_CMD) up -d --force-recreate

logs:
	$(COMPOSE_CMD) logs -f --tail=200

status:
	$(COMPOSE_CMD) ps
