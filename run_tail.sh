#!/bin/sh

# Start the container with tail -f /dev/null
MYUID="$(id -u)" MYGID="$(id -g)" docker compose up -d --no-deps --force-recreate back-end
MYUID="$(id -u)" MYGID="$(id -g)" docker compose exec back-end tail -f /dev/null