#!/bin/sh

MYUID="$(id -u)" MYGID="$(id -g)" docker compose run --rm web-server mypy /app/src/
MYUID="$(id -u)" MYGID="$(id -g)" docker compose run --rm web-server flake8 /app/src/
MYUID="$(id -u)" MYGID="$(id -g)" docker compose run --rm web-server black --check /app/src/