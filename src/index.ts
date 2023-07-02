import express from 'express';
import cookieParser from 'cookie-parser';
import { Pool } from 'pg';
import {
  makeGetUserController,
  makePostUserController,
} from './users/user.controller';
import { makeCreateUserInteractor } from './users/create-user.interactor';
import { makeCreateUserRepository } from './users/data/create-user.repository';
import { makeGetUserInteractor } from './users/get-user.interactor';
import { makeGetUserByIdRepository } from './users/data/get-user-by-id.repository';
import { makePassword } from './common/crypto/password';
import { makeCache } from './common/cache/redis';
import { makeCreateSessionRepository } from './sessions/data/create-session.repository';
import { makeCreateSessionInteractor } from './sessions/create-session.interactor';
import {
  makeDeleteSessionController,
  makePostSessionController,
} from './sessions/session.controller';
import { makeGetUserByUsernameRepository } from './sessions/data/get-user-by-username.repository';
import { makeDeleteSessionInteractor } from './sessions/delete-session.interactor';
import { makeDeleteSessionRepository } from './sessions/data/delete-session.repository';
import { makeSessionMiddleware } from './middleware/session.middleware';

const environment = {
  db: {
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    password: 'localtest',
    user: 'postgres',
    pool: {
      min: 1,
      max: 10,
    },
  },
  redis: {
    url: 'redis://localhost:6379',
  },
};

const pool = new Pool({
  host: environment.db.host,
  port: environment.db.port,
  password: environment.db.password,
  user: environment.db.user,
  database: environment.db.database,
  ...environment.db.pool,
});

const password = makePassword();

const app = express();

app.use(express.json());
app.use(cookieParser());

const getPoolHealth = async () => {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query("select 'UP' as status");
      return result.rows[0]['status'];
    } catch (e) {
      console.error(e);
      return 'DOWN';
    } finally {
      client.release();
    }
  } catch (e) {
    console.error(e);
    return 'DOWN';
  }
};
app.get('/health', async (req, res) => {
  res.send({ status: 'UP', pool: await getPoolHealth() });
});

app.post(
  '/v1/users',
  makePostUserController({
    createUserInteractor: makeCreateUserInteractor({
      createUserRepository: makeCreateUserRepository({
        pool,
        password,
      }),
    }),
  })
);

makeCache(environment).then((cache) => {
  const sessionMiddleware = makeSessionMiddleware(cache);

  app.get(
    '/v1/users/:id',
    sessionMiddleware,
    makeGetUserController({
      getUserInteractor: makeGetUserInteractor({
        getUserByIdRepository: makeGetUserByIdRepository({ pool }),
      }),
    })
  );

  app.post(
    '/V1/sessions',
    makePostSessionController({
      createSessionInteractor: makeCreateSessionInteractor({
        createSessionRepository: makeCreateSessionRepository({ cache }),
        getUserByUsername: makeGetUserByUsernameRepository({ pool }),
        password,
      }),
    })
  );

  app.delete(
    '/v1/sessions',
    sessionMiddleware,
    makeDeleteSessionController({
      deleteSessionInteractor: makeDeleteSessionInteractor({
        deleteSessionRepository: makeDeleteSessionRepository({ cache }),
      }),
    })
  );
});

app.listen(3000, () => {
  console.log('Server started ');
});
