## Listomatic Jobs

This project is meant to aggregate curated cryptocurrency exchange data sourced from Coin Gecko. The Listomatic web app consumes this data for the purpose of easily importing into Tradingview.

## Create a Postgres DB

run:

- `su - postgres`
- `createuser {DB_USER}`
- `createdb {DB_NAME}`
- `psql postgres`
- `grant all privileges on database {DB_NAME} to {DB_USER};`

## Run with Docker

run :

- `docker-compose build`
- `docker-compose up`

### Run migrations in running Docker container

run :

- `docker ps`
  - note the Container ID for `api`
- `docker exec -t -i [CONTAINER ID] bash`
  - replace `[CONTAINER ID]` with the unique id from the previous step
- `DATABASE_URL=postgres://{DB_USER}:{DB_PASSWORD}@db:{DB_PORT}/{DB_NAME} npm run migrate up`

## Run manually in dev

run: `npm run dev`

### Run migrations manually

run: `DATABASE_URL=postgres://{DB_USER}:{DB_PASSWORD}@localhost:5432/{DB_NAME} npm run migrate up`

### Redo migrations manually

run: `DATABASE_URL=postgres://{DB_USER}:{DB_PASSWORD}@localhost:5432/{DB_NAME} npm run migrate redo 1000`
