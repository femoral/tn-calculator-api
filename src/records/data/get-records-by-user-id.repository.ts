import { Pool } from 'pg';
import { GetRecordsByUserIdRepository } from '../get-records.interactor';

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

export const makeGetRecordsByUserIdRepository =
  (dependencies: { pool: Pool }): GetRecordsByUserIdRepository =>
  async (request, context) => {
    const offset = request.page_size * (request.page - 1);

    const result = await dependencies.pool.query(statement, [
      context.session.userId,
      request.filter.id,
      request.filter.operation_id,
      request.filter.amount,
      request.filter.user_balance,
      request.filter.operation_response,
      request.filter.date,
      request.page_size,
      offset,
    ]);

    return {
      records: result.rows.map((row) => ({
        id: row.id,
        operation_id: row.operation_id,
        user_id: row.user_id,
        amount: row.amount,
        user_balance: row.user_balance,
        operation_response: row.operation_response,
        date: row.date,
      })),
      full_count: result.rows[0]?.full_count,
    };
  };
