# Family app

## Features

* People database
* Family Tree

## Stack

* Remix
* Postgres
* Zod with strict typescript 
* Docker

## Requirements

* node 18
* npm 9
* docker

## Setup
### Dependency installation
* npm install
### Running database
1. create .env file in root app folder
2. check .env.example file for reference
3. find username, password and port in docker-compose.yml postgres service
4. create DATABASE_URL env with following properties "postgresql://<username>:<password>@<address>:<port>/postgres"
5. running db instance > docker compose --profile db up
6. seed database > npx prisma db seed
7. you are ready to go
### Starting app
* npm run dev
