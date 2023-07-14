# tn-calculator-api

## Description

This is a calculator API that can perform basic arithmetic operations. It is built using Node.js, Express.js and PostgreSQL.

## Pre requisites

- node.js
- pnpm (or npm)

## Project setup

```
pnpm install
```

## Standalone mode

### Pre requisites
- PostgreSQL 15 (with the provided [sql script](sql/db.sql) preloaded)
- Redis

```
pnpm start:watch
```

## Containerized mode

### Pre requisites
- Docker or Podman Composer

```
docker-compose -f docker-compose.yaml up
```

## Testing

In order to create users for testing purposes, you can use the following endpoint:

```sh
curl --location 'http://localhost:3000/api/v1/users' \
--header 'Content-Type: application/json' \
--data '{
    "username": "test2",
    "password": "test",
    "balance": 10.55
}'
```

## Environment variables

| Variable | Description | Default value          |
| --- | --- |------------------------|
| NODE_ENV | Node environment | development            |
| APP_PORT | Port where the API will be listening | 3000                   |
| REDIS_URL | Redis URL | redis://localhost:6379 |
| DB_HOST | PostgreSQL host | localhost              |
| DB_PORT | PostgreSQL port | 5432                   |
| DB_DATABASE | PostgreSQL database | postgre                |
| DB_USER | PostgreSQL user | calculator             |
| DB_PASSWORD | PostgreSQL password | localpassword          |
