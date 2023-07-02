import express from 'express';
import { Pool } from 'pg';
import {
  makeGetUserController,
  makePostUserController,
} from './users/user.controller';
import { makeCreateUserInteractor } from './users/create-user.interactor';
import { makeCreateUserRepository } from './users/data/create-user.repository';
import { makeGetUserInteractor } from './users/get-user.interactor';
import { makeGetUserRepository } from './users/data/get-user.repository';
import { makePassword } from './common/crypto/password';

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
};

const pool = new Pool({
  host: environment.db.host,
  port: environment.db.port,
  password: environment.db.password,
  user: environment.db.user,
  database: environment.db.database,
  ...environment.db.pool,
});

const app = express();

app.use(express.json());

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
        password: makePassword(),
      }),
    }),
  })
);

app.get(
  '/v1/users/:id',
  makeGetUserController({
    getUserInteractor: makeGetUserInteractor({
      getUserRepository: makeGetUserRepository({ pool }),
    }),
  })
);

app.listen(3000, () => {
  console.log('Server started ');
});
