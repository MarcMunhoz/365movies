dev:
	docker compose up -d

prod:
	docker compose prod

# Develop stage only
start:
	docker compose start

stop:
	docker compose stop

down:
	docker compose down --volumes --remove-orphans && docker image rm 365movies_img && rm -rf app/node_modules app/.quasar

restart:
	docker compose restart

logs:
	docker compose logs
