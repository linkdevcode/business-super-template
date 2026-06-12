.PHONY: help up down restart logs ps config clean

COMPOSE := docker compose -f docker-compose.yml

help:
	@echo "Available commands:"
	@echo "  make up       - Start postgres and pgadmin"
	@echo "  make down     - Stop containers"
	@echo "  make restart  - Restart containers"
	@echo "  make logs     - Follow container logs"
	@echo "  make ps       - Show container status"
	@echo "  make config   - Validate compose config"
	@echo "  make clean    - Stop containers and remove volumes"

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) down && $(COMPOSE) up -d

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

config:
	$(COMPOSE) config

clean:
	$(COMPOSE) down -v
