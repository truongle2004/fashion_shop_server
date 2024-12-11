## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# .env
```js

CORS_ORIGIN='http://localhost:5173'

RUNNING_ENV='dev'

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=truong247
MYSQL_DATABASE=todolist
MYSQL_SYNCHRONIZE=true


ACCESS_TOKEN_SECRET_SIGNATURE='ACCESS_TOKEN_TRUONG_LE'
REFRESH_TOKEN_SECRET_SIGNATURE='REFRESH_TOKEN_TRUONG_LE'


ACCESS_TOKEN_EXPIRATION=3600000 
REFRESH_TOKEN_EXPIRATION=604800

REFRESH_TOKEN_EXPIRATION_MS='7d'
ACCESS_TOKEN_EXPIRATION_MS='5s'

IS_PRODUCTION=false
```
