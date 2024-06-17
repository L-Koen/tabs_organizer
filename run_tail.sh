#!/bin/sh

# Start the container with tail -f /dev/null
MYUID="$(id -u)" MYGID="$(id -g)" docker compose up -d --no-deps --force-recreate web-server
MYUID="$(id -u)" MYGID="$(id -g)" docker compose exec web-server tail -f /dev/null