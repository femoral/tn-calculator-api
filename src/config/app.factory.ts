import { Pool } from 'pg';
import { makePassword } from '../common/crypto/password';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { makeCache } from '../common/cache/redis';
import { makeSessionMiddleware } from '../middleware/session.middleware';
import {
  makeGetUserController,
  makePostUserController,
} from '../users/user.controller';
import { makeCreateUserInteractor } from '../users/create-user.interactor';
import { makeCreateUserRepository } from '../users/data/create-user.repository';
import { makeGetUserInteractor } from '../users/get-user.interactor';
import { makeGetUserByIdRepository } from '../users/data/get-user-by-id.repository';
import {
  makeDeleteSessionController,
  makePostSessionController,
} from '../sessions/session.controller';
import { makeCreateSessionInteractor } from '../sessions/create-session.interactor';
import { makeCreateSessionRepository } from '../sessions/data/create-session.repository';
import { makeGetUserByUsernameRepository } from '../sessions/data/get-user-by-username.repository';
import {
  makeDeleteRecordController,
  makeGetRecordsController,
  makePostRecordController,
} from '../records/record.controller';
import { makeExecuteOperationInteractor } from '../records/execute-operation.interactor';
import { makeCreateRecordRepository } from '../records/data/create-record.repository';
import { makeGetOperationByTypeRepository } from '../operations/data/get-operation-by-type.repository';
import { makeArithmeticOperator } from '../operations/operator/arithmetic.operator';
import { makeStringOperator } from '../operations/operator/string.operator';
import axios from 'axios';
import * as https from 'https';
import { makeDeleteSessionInteractor } from '../sessions/delete-session.interactor';
import { makeDeleteSessionRepository } from '../sessions/data/delete-session.repository';
import { makeGetRecordsInteractor } from '../records/get-records.interactor';
import { makeGetRecordsByUserIdRepository } from '../records/data/get-records-by-user-id.repository';
import { makeGetOperationsController } from '../operations/operation.controller';
import { makeGetOperationsInteractor } from '../operations/get-operations.interactor';
import { makeGetOperationsRepository } from '../operations/data/get-operations.repository';
import { withErrorHandling } from '../common/error/handler';
import { makeErrorMiddleware } from '../middleware/error.middleware';
import { getDataBaseUrl } from './db';
import { getFromEnv } from './env';
import { makeDeleteRecordInteractor } from '../records/delete-record.interactor';
import { makeDeleteRecordByIdRepository } from '../records/data/delete-record-by-id.interactor';

export const makeApp = async () => {
  const pool = new Pool(getDataBaseUrl());
  const cache = await makeCache({
    url: getFromEnv('REDIS_URL', 'redis://localhost:6379'),
  });

  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(helmet());

  const getPoolHealth = async () => {
    try {
      const client = await pool.connect();
      try {
        const result = await client.query("select 'UP' as status");
        return result.rows[0]['status'];
      } catch (e) {
        //TODO: implement proper logging
        console.error(e);
        return 'DOWN';
      } finally {
        client.release();
      }
    } catch (e) {
      //TODO: implement proper logging
      console.error(e);
      return 'DOWN';
    }
  };

  const password = makePassword();
  const sessionMiddleware = makeSessionMiddleware(cache);

  app.get('/health', async (req, res) => {
    res.send({
      status: 'UP',
      db: await getPoolHealth(),
      cache: cache.health(),
    });
  });

  const postUserController = makePostUserController({
    createUser: makeCreateUserInteractor({
      createUser: makeCreateUserRepository({
        pool,
        password,
      }),
    }),
  });

  const getUserController = makeGetUserController({
    getUser: makeGetUserInteractor({
      getUserById: makeGetUserByIdRepository({ pool }),
    }),
  });

  const postSessionController = makePostSessionController({
    createSession: makeCreateSessionInteractor({
      createSession: makeCreateSessionRepository({ cache }),
      getUserByUsername: makeGetUserByUsernameRepository({ pool }),
      password,
    }),
  });

  const postRecordController = makePostRecordController({
    executeOperation: makeExecuteOperationInteractor({
      createRecord: makeCreateRecordRepository({ pool }),
      getOperationByType: makeGetOperationByTypeRepository({ pool }),
      executeArithmeticOperation: makeArithmeticOperator(),
      executeStringOperation: makeStringOperator({
        axios: axios.create({
          baseURL: 'https://www.random.org',
          httpsAgent: new https.Agent({ keepAlive: true }),
        }),
      }),
    }),
  });

  const deleteSessionController = makeDeleteSessionController({
    deleteSession: makeDeleteSessionInteractor({
      deleteSession: makeDeleteSessionRepository({ cache }),
    }),
  });

  const getRecordsController = makeGetRecordsController({
    getRecords: makeGetRecordsInteractor({
      getRecordsByUserId: makeGetRecordsByUserIdRepository({ pool }),
    }),
  });

  const deleteRecordsController = makeDeleteRecordController({
    deleteRecord: makeDeleteRecordInteractor({
      deleteRecordById: makeDeleteRecordByIdRepository({ pool }),
    }),
  });

  const getOperationsController = makeGetOperationsController({
    getOperations: makeGetOperationsInteractor({
      getOperations: makeGetOperationsRepository({ pool }),
    }),
  });

  app.post('/api/v1/users', withErrorHandling(postUserController));
  app.post('/api/v1/sessions', withErrorHandling(postSessionController));

  app.use(sessionMiddleware);

  app.get('/api/v1/users/:userId', withErrorHandling(getUserController));
  app.delete('/api/v1/sessions', withErrorHandling(deleteSessionController));
  app.get(
    '/api/v1/users/:userId/records',
    withErrorHandling(getRecordsController)
  );
  app.post(
    '/api/v1/users/:userId/records',
    withErrorHandling(postRecordController)
  );
  app.delete(
    '/api/v1/users/:userId/records/:recordId',
    withErrorHandling(deleteRecordsController)
  );

  app.get('/api/v1/operations', withErrorHandling(getOperationsController));

  app.use(makeErrorMiddleware());

  return app;
};
