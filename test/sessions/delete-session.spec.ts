import {
  DeleteSessionController,
  makeDeleteSessionController,
} from '../../src/sessions/session.controller';
import { makeDeleteSessionInteractor } from '../../src/sessions/delete-session.interactor';
import { makeDeleteSessionRepository } from '../../src/sessions/data/delete-session.repository';
import { mockResponse } from '../util';
import { NextFunction } from 'express';
import { buildDeleteSessionRequest } from './delete-session.mock';

describe('Delete Session', () => {
  let deleteSessionController: DeleteSessionController;
  const cache = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };
  const res = mockResponse();
  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    deleteSessionController = makeDeleteSessionController({
      deleteSessionInteractor: makeDeleteSessionInteractor({
        deleteSessionRepository: makeDeleteSessionRepository({
          cache: cache as any,
        }),
      }),
    });
  });

  it('should delete session from cache, when called with session id', async () => {
    await deleteSessionController(buildDeleteSessionRequest(), res, next);

    expect(cache.del).toHaveBeenNthCalledWith(1, 'sessionCookie');
  });

  it('should return clear cookie and return status 204, when called with session id', async () => {
    await deleteSessionController(buildDeleteSessionRequest(), res, next);

    expect(res.clearCookie).toHaveBeenNthCalledWith(1, 'SESSION');
    expect(res.status).toHaveBeenNthCalledWith(1, 204);
  });
});
