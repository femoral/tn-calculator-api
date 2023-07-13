import {
  GetRecordsController,
  makeGetRecordsController,
} from '../../src/records/record.controller';
import { mockResponse } from '../util';
import { NextFunction } from 'express';
import { ForbiddenError } from '../../src/common/error/errors';
import { makeGetRecordsInteractor } from '../../src/records/get-records.interactor';
import { makeGetRecordsByUserIdRepository } from '../../src/records/data/get-records-by-user-id.repository';
import {
  buildGetRecordMock,
  buildGetRecordWithUnmatchedUserMock,
  buildQueryRecords,
  buildResponseBodyMock,
  paginationScenarios,
  queryScenarios,
} from './get-user-records.mock';
import { Pool } from 'pg';

const statement = `
    select id, operation_id, user_id, amount, user_balance, operation_response, date, count(*) over() AS full_count 
    from record where 
    user_id = $1 
    and status = 'ENABLED'
    and ($2::text is null or id::text like '%' || $2 || '%')
    and ($3::numeric is null or operation_id = $3)
    and ($4::text is null or amount::text like '%' || $4 || '%')
    and ($5::text is null or user_balance::text like '%' || $5 || '%')
    and ($6::text is null or operation_response ilike '%' || $6 || '%')
    and ($7::date is null or date::text like $7 || '%')
    order by date desc limit $8 offset $9`;

describe('Get User Records', () => {
  let getRecordsController: GetRecordsController;
  const pool = {
    query: jest.fn(),
  };
  const res = mockResponse();
  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    getRecordsController = makeGetRecordsController({
      getRecords: makeGetRecordsInteractor({
        getRecordsByUserId: makeGetRecordsByUserIdRepository({
          pool: pool as unknown as Pool,
        }),
      }),
    });

    pool.query.mockResolvedValueOnce(buildQueryRecords());
  });

  queryScenarios.forEach((scenario) => {
    it(`should query the database with the correct parameters when called with ${scenario.name}`, async () => {
      await getRecordsController(buildGetRecordMock(scenario.query), res, next);

      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        statement,
        scenario.expectedDbQueryParameters
      );
    });
  });

  paginationScenarios.forEach((scenario) => {
    it(`should return the correct pagination response when called, given ${scenario.name}`, async () => {
      pool.query.mockReset();
      pool.query.mockResolvedValueOnce(scenario.queryResults);

      await getRecordsController(
        buildGetRecordMock({ page_size: scenario.page_size }),
        res,
        next
      );

      expect(res.json).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          metadata: scenario.expectedMetadata,
        })
      );
    });
  });

  it('should return 200 with response when called', async () => {
    await getRecordsController(buildGetRecordMock(), res, next);

    expect(res.status).toHaveBeenNthCalledWith(1, 200);
    expect(res.json).toHaveBeenNthCalledWith(1, buildResponseBodyMock());
  });

  it('should limit the page size to 50 when called with a page size greater than 50', async () => {
    await getRecordsController(
      buildGetRecordMock({ page_size: '100' }),
      res,
      next
    );

    expect(pool.query).toHaveBeenNthCalledWith(
      1,
      statement,
      expect.arrayContaining([50])
    );
  });

  it('should reject with ForbiddenError when called with a different user id', async () => {
    const promise = getRecordsController(
      buildGetRecordWithUnmatchedUserMock(),
      res,
      next
    );

    await expect(promise).rejects.toThrow(
      'You are not allowed to access this resource'
    );
    await expect(promise).rejects.toBeInstanceOf(ForbiddenError);
  });
});
