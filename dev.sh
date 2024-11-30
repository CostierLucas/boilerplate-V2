#!/bin/bash

case "$1" in
  "start")
    docker compose up -d --build
    docker compose logs -f web
    ;;
  "restart")
    docker compose restart
    docker compose logs -f web
    ;;
  "stop")
    docker compose down
    ;;
  "logs")
    docker compose logs -f web
    ;;
  *)
    echo "Usage: ./dev.sh [start|restart|stop|logs]"
    ;;
esac 