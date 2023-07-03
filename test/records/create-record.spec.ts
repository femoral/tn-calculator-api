import { mockResponse } from '../util';
import { NextFunction } from 'express';
import {
  makePostRecordController,
  PostRecordController,
} from '../../src/records/record.controller';
import { makeExecuteOperationInteractor } from '../../src/records/execute-operation.interactor';
import { makeCreateRecordRepository } from '../../src/records/data/create-record.repository';
import { makeGetOperationByTypeRepository } from '../../src/operations/data/get-operation-by-type.repository';
import { makeArithmeticOperator } from '../../src/operations/operator/arithmetic.operator';
import { makeStringOperator } from '../../src/operations/operator/string.operator';
import { Pool } from 'pg';
import { AxiosInstance } from 'axios';
import {
  buildGetOperationByTypeQueryMock,
  buildInsertedRecord,
  buildInsertedRecordQueryMock,
  buildOperationExecutionApiResponse,
  buildOperationExecutionRequestMock,
  buildUserBalanceQueryMock,
} from './create-record.mock';
import {
  BadRequestError,
  ForbiddenError,
  UnprocessableEntityError,
} from '../../src/common/error/errors';

const getUserBalanceStatement = `select balance from "user" where id = $1`;
const insertRecordStatement = `
  insert into "record" (operation_id, user_id, amount, user_balance, operation_response) 
  values ($1, $2, $3, $4, $5)
  returning id, user_id, operation_id, amount, user_balance, operation_response, date
`;
const updateUserBalanceStatement = `UPDATE "user" SET balance = $1 WHERE id = $2`;
const getOperationByTypeStatement =
  'select id, type, cost from "operation" where type = $1';

describe('Create Record', () => {
  let postRecordController: PostRecordController;
  const client = {
    release: jest.fn(),
    query: jest.fn(),
  };

  const pool = {
    query: jest.fn(),
    connect: jest.fn(() => Promise.resolve(client)),
  };
  const axios = {
    get: jest.fn(),
  };
  const res = mockResponse();
  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    postRecordController = makePostRecordController({
      executeOperation: makeExecuteOperationInteractor({
        createRecord: makeCreateRecordRepository({
          pool: pool as unknown as Pool,
        }),
        getOperationByType: makeGetOperationByTypeRepository({
          pool: pool as unknown as Pool,
        }),
        executeArithmeticOperation: makeArithmeticOperator(),
        executeStringOperation: makeStringOperator({
          axios: axios as unknown as AxiosInstance,
        }),
      }),
    });
  });

  describe('User exists and has available balance, operation exists', () => {
    beforeEach(() => {
      client.query.mockImplementation((statement: string) => {
        if (statement === getUserBalanceStatement) {
          return Promise.resolve(buildUserBalanceQueryMock('100'));
        }

        if (statement === insertRecordStatement) {
          return Promise.resolve(buildInsertedRecordQueryMock());
        }

        return Promise.resolve();
      });
      pool.query.mockResolvedValueOnce(buildGetOperationByTypeQueryMock());
    });

    it('should get operation by type, when called', async () => {
      await postRecordController(
        buildOperationExecutionRequestMock({}),
        res,
        next
      );

      expect(pool.query).toHaveBeenCalledWith(getOperationByTypeStatement, [
        'ADDITION',
      ]);
    });

    it('should get user balance, when called', async () => {
      await postRecordController(
        buildOperationExecutionRequestMock({}),
        res,
        next
      );

      expect(client.query).toHaveBeenCalledWith(getUserBalanceStatement, [
        'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
      ]);
    });

    it('should insert record, when called', async () => {
      await postRecordController(
        buildOperationExecutionRequestMock({}),
        res,
        next
      );

      expect(client.query).toHaveBeenCalledWith(
        insertRecordStatement,
        buildInsertedRecord()
      );
    });

    it('should update user balance, when called', async () => {
      await postRecordController(
        buildOperationExecutionRequestMock({}),
        res,
        next
      );

      expect(client.query).toHaveBeenCalledWith(updateUserBalanceStatement, [
        '94.45',
        'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
      ]);
    });

    it('should run everything within a transaction, when called', async () => {
      await postRecordController(
        buildOperationExecutionRequestMock({}),
        res,
        next
      );

      expect(client.query).toHaveBeenNthCalledWith(1, 'BEGIN');
      expect(client.query).toHaveBeenLastCalledWith('COMMIT');
      expect(client.release).toHaveBeenCalledTimes(1);
    });

    it('should store the proper operation result, when called, given operation is ADDITION', async () => {
      await postRecordController(
        buildOperationExecutionRequestMock({
          operands: ['1', '2'],
          operation_type: 'ADDITION',
        }),
        res,
        next
      );

      expect(client.query).toHaveBeenCalledWith(
        insertRecordStatement,
        buildInsertedRecord('3')
      );
    });

    it('should store the proper operation result, when called, given operation is SUBTRACTION', async () => {
      await postRecordController(
        buildOperationExecutionRequestMock({
          operands: ['1', '2'],
          operation_type: 'SUBTRACTION',
        }),
        res,
        next
      );

      expect(client.query).toHaveBeenCalledWith(
        insertRecordStatement,
        buildInsertedRecord('-1')
      );
    });

    it('should store the proper operation result, when called, given operation is MULTIPLICATION', async () => {
      await postRecordController(
        buildOperationExecutionRequestMock({
          operands: ['3', '2'],
          operation_type: 'MULTIPLICATION',
        }),
        res,
        next
      );

      expect(client.query).toHaveBeenCalledWith(
        insertRecordStatement,
        buildInsertedRecord('6')
      );
    });

    it('should store the proper operation result, when called, given operation is DIVISION', async () => {
      await postRecordController(
        buildOperationExecutionRequestMock({
          operands: ['6', '2'],
          operation_type: 'DIVISION',
        }),
        res,
        next
      );

      expect(client.query).toHaveBeenCalledWith(
        insertRecordStatement,
        buildInsertedRecord('3')
      );
    });

    it('should store the proper operation result, when called, given operation is SQUARE_ROOT', async () => {
      await postRecordController(
        buildOperationExecutionRequestMock({
          operands: ['16'],
          operation_type: 'SQUARE_ROOT',
        }),
        res,
        next
      );

      expect(client.query).toHaveBeenCalledWith(
        insertRecordStatement,
        buildInsertedRecord('4')
      );
    });

    it('should return 201 response with record, when called', async () => {
      await postRecordController(
        buildOperationExecutionRequestMock({}),
        res,
        next
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        buildOperationExecutionApiResponse()
      );
    });

    it('should reject ForbiddenError, when called, given the user does not own the resource', async () => {
      await expect(
        postRecordController(
          buildOperationExecutionRequestMock({ missMatchUserId: true }),
          res,
          next
        )
      ).rejects.toBeInstanceOf(ForbiddenError);
    });

    describe('Invalid operands', () => {
      it('should reject BadRequestError, when called, given operation is ADDITION operand count is different than 2', async () => {
        await expect(
          postRecordController(
            buildOperationExecutionRequestMock({
              operation_type: 'ADDITION',
              operands: ['1'],
            }),
            res,
            next
          )
        ).rejects.toBeInstanceOf(BadRequestError);
      });

      it('should reject BadRequestError, when called, given operation is SUBTRACTION operand count is different than 2', async () => {
        await expect(
          postRecordController(
            buildOperationExecutionRequestMock({
              operation_type: 'SUBTRACTION',
              operands: ['1'],
            }),
            res,
            next
          )
        ).rejects.toBeInstanceOf(BadRequestError);
      });

      it('should reject BadRequestError, when called, given operation is MULTIPLICATION operand count is different than 2', async () => {
        await expect(
          postRecordController(
            buildOperationExecutionRequestMock({
              operation_type: 'MULTIPLICATION',
              operands: ['1'],
            }),
            res,
            next
          )
        ).rejects.toBeInstanceOf(BadRequestError);
      });

      it('should reject BadRequestError, when called, given operation is DIVISION operand count is different than 2', async () => {
        await expect(
          postRecordController(
            buildOperationExecutionRequestMock({
              operation_type: 'DIVISION',
              operands: ['1'],
            }),
            res,
            next
          )
        ).rejects.toBeInstanceOf(BadRequestError);
      });

      it('should reject BadRequestError, when called, given operation is SQUARE_ROOT operand count is different than 1', async () => {
        await expect(
          postRecordController(
            buildOperationExecutionRequestMock({
              operation_type: 'SQUARE_ROOT',
              operands: ['1', '2'],
            }),
            res,
            next
          )
        ).rejects.toBeInstanceOf(BadRequestError);
      });

      it('should reject BadRequestError, when called, given operation is SQUARE_ROOT operand is negative', async () => {
        await expect(
          postRecordController(
            buildOperationExecutionRequestMock({
              operation_type: 'SQUARE_ROOT',
              operands: ['-1'],
            }),
            res,
            next
          )
        ).rejects.toBeInstanceOf(BadRequestError);
      });
    });

    describe('Transaction fails', () => {
      beforeEach(() => {
        client.query.mockReset();
        client.query.mockRejectedValueOnce(new Error('Transaction failed'));
        pool.query.mockResolvedValueOnce(buildGetOperationByTypeQueryMock());
      });

      it('should reject and call ROLLBACK and release, when called', async () => {
        await expect(
          postRecordController(
            buildOperationExecutionRequestMock({}),
            res,
            next
          )
        ).rejects.toBeInstanceOf(Error);

        expect(client.query).toHaveBeenLastCalledWith('ROLLBACK');
        expect(client.release).toHaveBeenCalled();
      });
    });

    describe('Operation type is string', () => {
      beforeEach(() => {
        axios.get.mockResolvedValueOnce({
          data: 'randomString',
        });

        pool.query.mockReset();

        pool.query.mockResolvedValueOnce(
          buildGetOperationByTypeQueryMock('RANDOM_STRING')
        );
      });

      it('should fetch a random string, when called', async () => {
        await postRecordController(
          buildOperationExecutionRequestMock({
            operation_type: 'RANDOM_STRING',
          }),
          res,
          next
        );

        expect(axios.get).toHaveBeenCalledWith('/strings/', {
          params: {
            num: 1,
            len: 20,
            format: 'plain',
            digits: 'on',
            upperalpha: 'on',
            loweralpha: 'on',
          },
        });
      });

      it('should store the proper operation result, when called, given operation is SQUARE_ROOT', async () => {
        await postRecordController(
          buildOperationExecutionRequestMock({
            operation_type: 'RANDOM_STRING',
          }),
          res,
          next
        );

        expect(client.query).toHaveBeenCalledWith(
          insertRecordStatement,
          buildInsertedRecord('randomString')
        );
      });
    });
  });

  describe('User does not have remaining balance', () => {
    beforeEach(() => {
      client.query.mockImplementation((statement: string) => {
        if (statement === getUserBalanceStatement) {
          return Promise.resolve(buildUserBalanceQueryMock('4'));
        }

        if (statement === insertRecordStatement) {
          return Promise.resolve(buildInsertedRecordQueryMock());
        }

        return Promise.resolve();
      });
      pool.query.mockResolvedValueOnce(buildGetOperationByTypeQueryMock());
    });

    it('should reject ForbiddenError, when called', async () => {
      await expect(
        postRecordController(buildOperationExecutionRequestMock({}), res, next)
      ).rejects.toBeInstanceOf(UnprocessableEntityError);
    });
  });
});
