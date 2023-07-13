import { Pool } from 'pg';
import { GetOperationRepository } from '../../records/execute-operation.interactor';

const statement =
  'select id, type, cost, operands from "operation" where type = $1';

export const makeGetOperationByTypeRepository =
  (dependencies: { pool: Pool }): GetOperationRepository =>
  async (operationType: string) => {
    const { rows } = await dependencies.pool.query(statement, [operationType]);
    return rows[0];
  };
