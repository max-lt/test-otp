#!/usr/bin/env bash

docker-compose restart
docker-compose logs -f --tail 100
