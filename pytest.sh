#!/bin/sh

MYUID="$(id -u)" MYGID="$(id -g)" docker compose run --rm back-end pytest -v