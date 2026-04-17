# Requirements

1. NodeJS
2. Yarn
3. Docker
4. VScode extensions: eslint, prettier

# Initial setup

- Copy file `.env.example` to `.env`
- SQL server running at port `port`, with `DB`, `username`, `password` same as in `.env` file. It is recommended to use docker container as db host.
- Redis server running at `port`, with `password` as in `.env` file.

```
docker-compose up -d db redis
```

- Install required library packages:

```
yarn install
```

- Migrate DB tables:

```
yarn typeorm migration:run
```

- Run seeds (`skipped`):

```
yarn typeorm:seed run
```

# Running application

- Run development API server

```
yarn start:dev
```

# Development commands

- Generate migration:

```
yarn typeorm migration:generate -p src/database/migrations/migration-label

```

- Run specified seed:

```
yarn typeorm:seeding seed -s ClassName
```

- Run commands:

```
yarn cli <command-name> [<args>]
```
