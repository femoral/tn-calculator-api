import { mockResponse } from '../util';
import { NextFunction } from 'express';
import {
  makePostUserController,
  PostUserController,
} from '../../src/users/user.controller';
import { makeCreateUserInteractor } from '../../src/users/create-user.interactor';
import { makeCreateUserRepository } from '../../src/users/data/create-user.repository';
import {
  buildCreateUserQueryResponse,
  buildCreateUserRequest,
  buildCreateUserResponse,
} from './create-user.mock';
import { Pool } from 'pg';
import { Password } from '../../src/common/crypto/password';

describe('Create User', () => {
  let createUserController: PostUserController;
  const pool = {
    query: jest.fn(),
  };
  const password = {
    hash: jest.fn(() => Promise.resolve('hashedPassword')),
  };
  const res = mockResponse();
  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    createUserController = makePostUserController({
      createUser: makeCreateUserInteractor({
        createUser: makeCreateUserRepository({
          pool: pool as unknown as Pool,
          password: password as unknown as Password,
        }),
      }),
    });

    pool.query.mockResolvedValueOnce(buildCreateUserQueryResponse());
  });

  it('should insert the user, when called with user creation request', async () => {
    await createUserController(buildCreateUserRequest(), res, next);

    expect(pool.query).toHaveBeenNthCalledWith(
      1,
      `insert into "user" (username, password, balance) values ($1, $2, $3) returning id, username, balance`,
      ['test1@test.com', 'hashedPassword', '10.55']
    );
  });

  it('should hash the password, when called with user creation request', async () => {
    await createUserController(buildCreateUserRequest(), res, next);

    expect(password.hash).toHaveBeenNthCalledWith(1, 'password');
  });

  it('should return a user, when called with user creation request, given query returns user', async () => {
    await createUserController(buildCreateUserRequest(), res, next);

    expect(res.json).toHaveBeenNthCalledWith(1, buildCreateUserResponse());
  });
});
