import {
  GetUserController,
  makeGetUserController,
} from '../../src/users/user.controller';
import { makeGetUserInteractor } from '../../src/users/get-user.interactor';
import { makeGetUserRepository } from '../../src/users/data/get-user.repository';
import { mockResponse } from '../util';
import { NextFunction } from 'express';
import {
  buildGetUserQueryResponse,
  buildGetUserRequest,
  buildGetUserResponse,
} from './get-user.mock';
import { NotFoundError } from '../../src/common/error/errors';

describe('Get User', () => {
  let getUserController: GetUserController;
  const pool = {
    query: jest.fn(),
  };
  const res = mockResponse();
  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    getUserController = makeGetUserController({
      getUserInteractor: makeGetUserInteractor({
        getUserRepository: makeGetUserRepository({ pool: pool as any }),
      }),
    });
  });

  it('should query the database, when called with id', async () => {
    pool.query.mockResolvedValueOnce(buildGetUserQueryResponse());

    await getUserController(buildGetUserRequest(), res, next);

    expect(pool.query).toHaveBeenNthCalledWith(
      1,
      `select id, username, balance from "user" where id = $1 and status = 'ENABLED'`,
      [buildGetUserRequest().params.id]
    );
  });

  it('should return a user, when called with id, given query returns user', async () => {
    pool.query.mockResolvedValueOnce(buildGetUserQueryResponse());

    await getUserController(buildGetUserRequest(), res, next);

    expect(res.json).toHaveBeenNthCalledWith(1, buildGetUserResponse());
  });

  it('should reject NotFoundError, when called with id, given query does not return any user', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    await expect(
      getUserController(buildGetUserRequest(), res, next)
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
