#!/bin/sh

# Start the container with tail -f /dev/null
docker-compose up -d --no-deps --force-recreate web-server
docker-compose exec web-server tail -f /dev/null