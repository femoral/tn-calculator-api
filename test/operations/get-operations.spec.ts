import {
  GetOperationsController,
  makeGetOperationsController,
} from '../../src/operations/operation.controller';
import { mockResponse } from '../util';
import { NextFunction, Request } from 'express';
import { makeGetOperationsInteractor } from '../../src/operations/get-operations.interactor';
import { makeGetOperationsRepository } from '../../src/operations/data/get-operations.repository';
import { Pool } from 'pg';
import { buildAllOperations } from './get-operations.mock';

describe('Get All Operations', () => {
  let getOperationsController: GetOperationsController;
  const pool = {
    query: jest.fn(),
  };
  const res = mockResponse();
  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    getOperationsController = makeGetOperationsController({
      getOperations: makeGetOperationsInteractor({
        getOperations: makeGetOperationsRepository({
          pool: pool as unknown as Pool,
        }),
      }),
    });

    pool.query.mockResolvedValueOnce({ rows: buildAllOperations() });
  });

  it('shoul fetch all operations from the database, when called', async () => {
    await getOperationsController({} as unknown as Request, res, next);

    expect(pool.query).toHaveBeenNthCalledWith(
      1,
      `select id, type, cost, operands from "operation"`
    );
  });

  it('should return operations, when called', async () => {
    await getOperationsController({} as unknown as Request, res, next);

    expect(res.json).toHaveBeenNthCalledWith(1, { data: buildAllOperations() });
  });
});
