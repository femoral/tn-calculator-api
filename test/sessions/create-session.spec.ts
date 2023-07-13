import {
  makePostSessionController,
  PostSessionController,
} from '../../src/sessions/session.controller';
import { makeCreateSessionInteractor } from '../../src/sessions/create-session.interactor';
import { makeCreateSessionRepository } from '../../src/sessions/data/create-session.repository';
import { makeGetUserByUsernameRepository } from '../../src/sessions/data/get-user-by-username.repository';
import {
  buildDummyUser,
  buildGetUserQueryResponse,
  buildSessionResponse,
  buildUserCredentials,
} from './create-session.mock';
import { mockResponse } from '../util';
import { NextFunction } from 'express';
import { UnauthorizedError } from '../../src/common/error/errors';
import { Password } from '../../src/common/crypto/password';
import { Cache } from '../../src/common/cache/redis';
import { Pool } from 'pg';

const randomBytes = Buffer.from('randomBytes');

jest.mock('node:crypto', () => ({
  randomBytes: jest.fn(() => randomBytes),
}));

describe('Create Session', () => {
  let postSessionController: PostSessionController;
  const cache = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };
  const password = {
    verify: jest.fn(),
  };
  const pool = {
    query: jest.fn(),
  };
  const res = mockResponse();
  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    postSessionController = makePostSessionController({
      createSession: makeCreateSessionInteractor({
        createSession: makeCreateSessionRepository({
          cache: cache as unknown as Cache,
        }),
        password: password as unknown as Password,
        dummyUser: buildDummyUser(),
        getUserByUsername: makeGetUserByUsernameRepository({
          pool: pool as unknown as Pool,
        }),
      }),
    });
  });

  describe('Password verification succeeded and user exists', () => {
    beforeEach(() => {
      password.verify.mockResolvedValueOnce(true);
      pool.query.mockResolvedValueOnce(buildGetUserQueryResponse());
    });

    it('should get user by username, when called', async () => {
      await postSessionController(buildUserCredentials(), res, next);

      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        `select id, username, balance, password from "user" where username = $1 and status = 'ENABLED'`,
        ['test1@test.com']
      );
    });

    it('should verify the crypto, when called', async () => {
      await postSessionController(buildUserCredentials(), res, next);

      expect(password.verify).toHaveBeenNthCalledWith(
        1,
        'hashedPassword',
        'password'
      );
    });

    it('should create a session on cache, when called', async () => {
      await postSessionController(buildUserCredentials(), res, next);

      expect(cache.set).toHaveBeenNthCalledWith(
        1,
        randomBytes.toString('hex'),
        {
          userId: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
        }
      );
    });

    it('should return a session cookie and session response, when called', async () => {
      await postSessionController(buildUserCredentials(), res, next);

      expect(res.cookie).toHaveBeenNthCalledWith(
        1,
        'SESSION',
        randomBytes.toString('hex'),
        {
          httpOnly: true,
          secure: true,
          path: '/',
          sameSite: true,
          maxAge: 1000 * 60 * 60,
        }
      );
      expect(res.json).toHaveBeenNthCalledWith(1, buildSessionResponse());
      expect(res.status).toHaveBeenNthCalledWith(1, 201);
    });
  });

  describe('Password verification failed', () => {
    beforeEach(() => {
      pool.query.mockResolvedValueOnce(buildGetUserQueryResponse());
      password.verify.mockResolvedValueOnce(false);
    });

    it('should throw UnauthorizedError, when called', async () => {
      await expect(
        postSessionController(buildUserCredentials(), res, next)
      ).rejects.toBeInstanceOf(UnauthorizedError);
    });
  });

  describe('User does not exist', () => {
    beforeEach(() => {
      pool.query.mockResolvedValueOnce({ rows: [] });
      password.verify.mockResolvedValueOnce(true);
    });

    it('should throw NotFoundError, when called', async () => {
      await expect(
        postSessionController(buildUserCredentials(), res, next)
      ).rejects.toBeInstanceOf(UnauthorizedError);
    });
  });
});
