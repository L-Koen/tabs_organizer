#!/bin/sh

MYUID="$(id -u)" MYGID="$(id -g)" docker compose run --rm web-server pytest -v