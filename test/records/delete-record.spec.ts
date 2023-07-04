import {
  DeleteRecordController,
  makeDeleteRecordController,
} from '../../src/records/record.controller';
import { mockResponse } from '../util';
import { NextFunction } from 'express';
import { makeDeleteRecordInteractor } from '../../src/records/delete-record.interactor';
import { makeDeleteRecordByIdRepository } from '../../src/records/data/delete-record-by-id.interactor';
import {
  buildDeleteRecordMock,
  buildDeleteRecordWithUnmatchedUserMock,
} from './delete-record.mock';
import { ForbiddenError } from '../../src/common/error/errors';
import { Pool } from 'pg';

describe('Delete Record', () => {
  let deleteRecordController: DeleteRecordController;
  const pool = {
    query: jest.fn(),
  };
  const res = mockResponse();
  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    deleteRecordController = makeDeleteRecordController({
      deleteRecord: makeDeleteRecordInteractor({
        deleteRecordById: makeDeleteRecordByIdRepository({
          pool: pool as unknown as Pool,
        }),
      }),
    });

    pool.query.mockResolvedValueOnce({ rows: [] });
  });

  it('should disable user on the database, when called', async () => {
    await deleteRecordController(buildDeleteRecordMock(), res, next);

    expect(pool.query).toHaveBeenNthCalledWith(
      1,
      `update "record" set status = 'DISABLED' where id = $1 AND user_id = $2`,
      [11, 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a']
    );
  });

  it('should return 204 when called', async () => {
    await deleteRecordController(buildDeleteRecordMock(), res, next);

    expect(res.status).toHaveBeenNthCalledWith(1, 204);
    expect(res.end).toHaveBeenCalledTimes(1);
  });

  it('should reject with ForbiddenError when called with a different user id', async () => {
    const promise = deleteRecordController(
      buildDeleteRecordWithUnmatchedUserMock(),
      res,
      next
    );

    await expect(promise).rejects.toThrow(
      'You are not allowed to access this resource'
    );
    await expect(promise).rejects.toBeInstanceOf(ForbiddenError);
  });
});
