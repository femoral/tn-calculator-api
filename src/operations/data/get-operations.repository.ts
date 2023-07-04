import { Pool } from 'pg';
import { GetOperationsRepository } from '../get-operations.interactor';

const statement = `select id, type, cost from "operation"`;
export const makeGetOperationsRepository =
  (dependencies: { pool: Pool }): GetOperationsRepository =>
  async () => {
    const { rows } = await dependencies.pool.query(statement);
    return rows;
  };
