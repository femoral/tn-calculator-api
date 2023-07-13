import { Record } from './record.model';
import { Context } from '../common/api.types';
import {
  Operation,
  OperationExecution,
  OperationType,
} from '../operations/operation.model';
import { BadRequestError } from '../common/error/errors';

export type CreateRecordRepository = (
  newRecord: Partial<Record>
) => Promise<Record>;

export type GetOperationRepository = (
  operationType: OperationType
) => Promise<Operation>;

export type Operator = (operation: OperationExecution) => Promise<string>;

export type ExecuteOperationInteractor = (
  operationExecution: OperationExecution,
  context: Context
) => Promise<Record>;

export const makeExecuteOperationInteractor =
  (dependencies: {
    createRecord: CreateRecordRepository;
    getOperationByType: GetOperationRepository;
    executeStringOperation: Operator;
    executeArithmeticOperation: Operator;
  }): ExecuteOperationInteractor =>
  async (operationExecution, context): Promise<Record> => {
    const operation = await dependencies.getOperationByType(
      operationExecution.operation_type
    );

    const record: Partial<Record> = {
      user_id: context.session.userId,
      operation_id: operation.id,
      amount: operation.cost,
    };

    if (operationExecution.operands.length !== operation.operands) {
      throw new BadRequestError('Invalid number of operands');
    }

    if (operation.type === 'RANDOM_STRING') {
      record.operation_response = await dependencies.executeStringOperation(
        operationExecution
      );
    } else {
      record.operation_response = await dependencies.executeArithmeticOperation(
        operationExecution
      );
    }

    return await dependencies.createRecord(record);
  };
