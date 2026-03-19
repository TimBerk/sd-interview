start:
	docker compose up -d
stop:
	docker compose down
clear:
	docker compose down --rmi local --remove-orphans
