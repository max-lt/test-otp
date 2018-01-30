#!/usr/bin/env bash

if [ "$1" == "--local" ]; then
    COMPOSE="-f docker-compose.yml -f docker-compose.local.yml"
else
    COMPOSE="-f docker-compose.yml -f docker-compose.yml"
fi

docker-compose ${COMPOSE} up -d

if [ "$2" != "--no-log" ]; then
    docker-compose ${COMPOSE} logs -f --tail 50
fi
