IMAGE_NAME = ubereats-backend
CONTAINER_NAME = ubereats-back

.PHONY: build up down restart logs shell

build:
	docker build -t $(IMAGE_NAME) .

up:
	docker run -d --name $(CONTAINER_NAME) -p 3000:3000 --env-file .env $(IMAGE_NAME)

down:
	docker stop $(CONTAINER_NAME)
	docker rm $(CONTAINER_NAME)

restart: down up

logs:
	docker logs -f $(CONTAINER_NAME)

shell:
	docker exec -it $(CONTAINER_NAME) /bin/sh
