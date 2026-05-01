include .env
ifneq (,$(wildcard .env.local))
	include .env.local
endif
export

COMPOSE_FILES = \
	-f compose.yaml \
	$(if $(filter dev,$(ENV)),-f compose.override.yaml) \
	$(if $(filter prod,$(ENV)),-f compose.prod.yaml)

ENV_FILES = \
	$(if $(wildcard .env),--env-file .env) \
	$(if $(wildcard .env.local),--env-file .env.local)

DC = docker compose $(COMPOSE_FILES) $(ENV_FILES)

.PHONY: up down start stop restart update logs status

up:
	$(DC) up -d --build

down:
	$(DC) down

restart: down up

update:
	$(DC) build --pull --no-cache
	$(DC) up -d --force-recreate --wait

logs:
	$(DC) logs -f --tail=200

status:
	$(DC) ps
