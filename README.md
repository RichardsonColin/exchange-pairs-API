### Create DB
Run from the command line:
- `su - postgres`
- `createuser colin`
- `createdb cryptopairsdb`
- `psql postgres`
- `grant all privileges on database cryptopairsdb to colin;`

### Run Migrations
`DATABASE_URL=postgres://{DB_OWNER}:{DB_PASS}@localhost:5432/{DB_NAME} npm run migrate up`
### Redo Migrations
`DATABASE_URL=postgres://{DB_OWNER}:{DB_PASS}@localhost:5432/{DB_NAME} npm run migrate redo 1000`