#!/bin/sh

MYUID="$(id -u)" MYGID="$(id -g)" docker compose run --rm back-end mypy /app/src/
MYUID="$(id -u)" MYGID="$(id -g)" docker compose run --rm back-end flake8 /app/src/
MYUID="$(id -u)" MYGID="$(id -g)" docker compose run --rm back-end black --check /app/src/