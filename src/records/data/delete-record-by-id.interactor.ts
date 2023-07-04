import { Pool } from 'pg';
import { DeleteRecordByIdRepository } from '../delete-record.interactor';

const statement = `update "record" set status = 'DISABLED' where id = $1 AND user_id = $2`;

export const makeDeleteRecordByIdRepository =
  (dependencies: { pool: Pool }): DeleteRecordByIdRepository =>
  async (recordId, context) => {
    await dependencies.pool.query(statement, [
      recordId,
      context.session.userId,
    ]);
  };
